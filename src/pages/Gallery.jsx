import { LuImage } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';

export default function Gallery() {
  const { data, loading, error, reload } = useFetch(api.getGallery);
  const photos = data.filter((g) => g.src);
  return (
    <>
      <PageBanner title="Memories & Gallery" subtitle="Moments from our ministry" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : photos.length === 0 ? (
            <EmptyState icon={LuImage} title="No photos yet">Photos from our programmes will be added here.</EmptyState>
          ) : (
            <div className="gallery">
              {photos.map((g) => (
                <figure key={g.id} className="gallery__item">
                  <img src={g.src} alt={g.caption} loading="lazy" />
                  <figcaption className="gallery__cap">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
