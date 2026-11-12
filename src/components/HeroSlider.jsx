import { useCallback, useEffect, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Button from './Button.jsx';
import { heroSlides } from '../data/heroSlides.js';

const INTERVAL = 6000;
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Full-width crossfading hero. Slides come from src/data/heroSlides.js, photos from public/images/hero/.
export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const count = heroSlides.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || reducedMotion()) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [paused, count, index]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    touchStart.current = null;
  };

  const slide = heroSlides[index];

  return (
    <section
      className="hs"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hs__slides">
        {heroSlides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={i === index ? s.alt : ''}
            className={`hs__img ${i === index ? 'is-active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ))}
      </div>
      <div className="hs__shade" />

      <div className="container hs__body">
        <div key={index} className="hs__content" aria-live="polite">
          <span className="hs__tag">{slide.eyebrow}</span>
          <h1>{slide.title}<span>{slide.accent}</span></h1>
          <p>{slide.text}</p>
          <div className="hs__actions">
            <Button to={slide.primary.to} variant="gold">{slide.primary.label}</Button>
            <Button to={slide.secondary.to} variant="light">{slide.secondary.label}</Button>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button className="hs__arrow hs__arrow--prev" onClick={() => go(index - 1)} aria-label="Previous slide"><LuChevronLeft aria-hidden="true" /></button>
          <button className="hs__arrow hs__arrow--next" onClick={() => go(index + 1)} aria-label="Next slide"><LuChevronRight aria-hidden="true" /></button>
          <div className="hs__dots" role="tablist" aria-label="Choose slide">
            {heroSlides.map((s, i) => (
              <button key={s.src} role="tab" aria-selected={i === index} aria-label={`Slide ${i + 1}`} className={`hs__dot ${i === index ? 'is-active' : ''}`} onClick={() => go(i)}>
                {i === index && !paused && !reducedMotion() && <i style={{ animationDuration: `${INTERVAL}ms` }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
