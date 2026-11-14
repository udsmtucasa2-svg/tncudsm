// Turns a pasted YouTube link into what the site needs: a thumbnail, an embed address and a watch address.
// Understands watch?v=, youtu.be/, /shorts/, /live/, /embed/ and playlists, with or without a start time.
// Anything else (a channel page, Facebook, audio files...) returns null and is simply opened in a new tab.
const ID = /^[\w-]{11}$/;

// "1h2m3s", "90s" or "90" -> seconds
function toSeconds(v) {
  if (!v) return 0;
  if (/^\d+$/.test(v)) return Number(v);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(v);
  return m ? (Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)) : 0;
}

export function parseYouTube(input) {
  if (!input) return null;
  let u;
  try { u = new URL(String(input).trim()); } catch { return null; }
  const host = u.hostname.replace(/^(www\.|m\.|music\.)/, '');
  const parts = u.pathname.split('/').filter(Boolean);
  let id = null;

  if (host === 'youtu.be') id = parts[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (parts[0] === 'watch') id = u.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v'].includes(parts[0])) id = parts[1];
  } else return null;

  const list = u.searchParams.get('list');
  if (id && !ID.test(id)) id = null;
  if (!id && !list) return null;

  const start = toSeconds(u.searchParams.get('t') || u.searchParams.get('start'));
  const params = new URLSearchParams({ rel: '0', playsinline: '1' });
  if (start) params.set('start', String(start));
  if (list) params.set('list', list);

  return {
    provider: 'youtube',
    site: 'YouTube',
    id,
    list,
    thumb: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null,
    // autoplay is only added when the viewer taps a card to play
    embed: (autoplay = true) => {
      const p = new URLSearchParams(params);
      if (autoplay) p.set('autoplay', '1');
      return `https://www.youtube-nocookie.com/embed/${id || 'videoseries'}?${p}`;
    },
    watch: id ? `https://www.youtube.com/watch?v=${id}${list ? `&list=${list}` : ''}${start ? `&t=${start}s` : ''}` : `https://www.youtube.com/playlist?list=${list}`,
  };
}