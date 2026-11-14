import { useEffect, useState } from 'react';
import { parseYouTube } from './youtube.js';

// Recognises a pasted video link (YouTube or Vimeo) and returns { provider, site, thumb, embed(autoplay), watch }.
// Returns null for anything else (Facebook, TikTok, audio files...): those open in a new tab and use an
// uploaded thumbnail, because browsers are not allowed to read their pictures directly.
function parseVimeo(input) {
  let u;
  try { u = new URL(String(input || '').trim()); } catch { return null; }
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
  const parts = u.pathname.split('/').filter(Boolean);
  const at = parts.findIndex((p) => /^\d+$/.test(p));
  if (at < 0) return null;
  const id = parts[at];
  const next = parts[at + 1] || '';
  const hash = u.searchParams.get('h') || (/^[0-9a-f]{8,}$/i.test(next) ? next : null); // private/unlisted videos
  return {
    provider: 'vimeo',
    site: 'Vimeo',
    id,
    thumb: null, // fetched from Vimeo, see useVideoThumb
    embed: (autoplay = true) => `https://player.vimeo.com/video/${id}?${autoplay ? 'autoplay=1&' : ''}playsinline=1${hash ? `&h=${hash}` : ''}`,
    watch: `https://vimeo.com/${id}${hash ? `/${hash}` : ''}`,
  };
}

export const parseVideo = (url) => parseYouTube(url) || parseVimeo(url);

const vimeoCache = new Map();

// The picture to show for a video: the one the admin uploaded, else YouTube's, else Vimeo's. '' when none.
export function useVideoThumb(video, custom) {
  const key = video?.provider === 'vimeo' ? video.watch : '';
  const [remote, setRemote] = useState(key ? vimeoCache.get(key) || '' : '');

  useEffect(() => {
    if (!key) { setRemote(''); return undefined; }
    if (vimeoCache.has(key)) { setRemote(vimeoCache.get(key)); return undefined; }
    let alive = true;
    fetch(`https://vimeo.com/api/oembed.json?width=640&url=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { const t = j?.thumbnail_url || ''; vimeoCache.set(key, t); if (alive) setRemote(t); })
      .catch(() => { vimeoCache.set(key, ''); });
    return () => { alive = false; };
  }, [key]);

  return custom || video?.thumb || remote || '';
}