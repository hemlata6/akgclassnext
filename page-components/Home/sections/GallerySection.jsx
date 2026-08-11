import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import Network from '@/config/Network';
import Endpoints from '@/config/endpoints';
import { useAuth } from '@/config/AuthContext';
import instId from '@/config/instituteId';

// ── Lightbox ──────────────────────────────────────────────
const Lightbox = React.memo(({ src, visible, onClose }) => {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    if (visible) {
      document.addEventListener('keydown', esc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [visible, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="flex justify-end z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center my-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {src && <img src={src} alt="Gallery" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />}
      </div>
      <div className="text-center text-[10px] text-slate-400">
        Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-white/70">ESC</kbd> to close
      </div>
    </div>
  );
});
Lightbox.displayName = 'Lightbox';

// ── Gallery Card ──────────────────────────────────────────
const GalleryCard = React.memo(({ item, onOpen }) => {
  const [error, setError] = useState(false);

  const handleClick = useCallback(() => {
    onOpen(item.src);
  }, [onOpen, item.src]);

  if (error) {
    return (
      <div className="flex-shrink-0 w-52 sm:w-60">
        <div className="rounded-xl bg-slate-100 border border-slate-200 h-[220px] flex items-center justify-center text-slate-400 text-xs">
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-52 sm:w-60 cursor-pointer group/card" onClick={handleClick}>
      <div className="rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#0749A2]/40 hover:scale-[1.02]">
        <div className="relative overflow-hidden h-[220px]">
          <img
            src={item.src}
            alt={`${item.cityName} Event`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            loading="lazy"
            onError={() => setError(true)}
          />
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full pointer-events-none">
            &#x1F4CD; {item.cityName}
          </div>
        </div>
      </div>
    </div>
  );
});
GalleryCard.displayName = 'GalleryCard';

// ── Main Section ──────────────────────────────────────────
export const GallerySection = () => {

  const { authToken } = useAuth();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState({ src: null, visible: false });
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchGalleryFromApi = async () => {
    try {
      setLoading(true);

      // Step 1: Get the Gallery course
      const response = await Network.getFreeCourseList(instId);
      const courses = response?.courses || response || [];
      const galleryCourse = courses.find(
        course => course.title === "Gallery"
      );

      if (!galleryCourse) {
        setLoading(false);
        return;
      }

      const courseId = galleryCourse.id || galleryCourse._id || galleryCourse.courseId;

      // Step 2: Get city folders (parentId = 0)
      const cityResponse = await Network.fetchScheduleApi(courseId, 0);

      const cityFolders = Array.isArray(cityResponse)
        ? cityResponse
        : (cityResponse?.contentList || cityResponse?.contents || cityResponse?.courses || []);

      if (!cityFolders.length) {
        setLoading(false);
        return;
      }

      // Step 3: For each city folder, get images
      const citiesWithImages = await Promise.all(
        cityFolders.map(async (folder) => {
          const folderId = folder.id || folder._id || folder.contentId || folder.courseId;
          const folderName = folder.name || folder.title || folder.folderName || 'Unknown';

          const imagesResponse = await Network.fetchScheduleApi(courseId, folderId);

          const imageList = Array.isArray(imagesResponse)
            ? imagesResponse
            : (imagesResponse?.contentList || imagesResponse?.contents || imagesResponse?.courses || []);

          return {
            name: folderName,
            images: imageList.map(img => {
              const fileName = img.name || img.title || img.fileName || img.contentName || 'image';
              const rawUrl = img.thumb || img.fileUrl || img.path || img.logo || img.content || '';
              const fileUrl = rawUrl ? `${Endpoints.mediaBaseUrl}${rawUrl}` : '';
              return { name: fileName, url: fileUrl };
            }).filter(img => img.url) // only keep items with valid URLs
          };
        })
      );

      // Filter out cities with no images
      const validCities = citiesWithImages.filter(c => c.images.length > 0);

      if (validCities.length === 0) {
        setLoading(false);
        return;
      }

      // Build flat item list for the marquee
      const allItems = validCities.flatMap(cityData =>
        cityData.images.map(img => ({
          city: cityData.name.toLowerCase(),
          cityName: cityData.name,
          src: img.url,
        }))
      );

      setCities(validCities);
      setGalleryItems(allItems);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching gallery from API:', err);
      // Keep hardcoded fallback on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryFromApi();
  }, []);

  const filteredItems = useMemo(
    () => (filter === 'all' ? galleryItems : galleryItems.filter((i) => i.city === filter)),
    [filter, galleryItems]
  );

  const openLightbox = useCallback((src) => {
    setLightbox({ src, visible: true });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <section id="gallery" className="py-12 bg-white overflow-hidden scroll-mt-24">
      <style>{`
        .marquee-track-gallery {
          display: flex;
          width: max-content;
          animation: marqueeLeft 160s linear infinite;
          will-change: transform;
        }
        .marquee-container-gallery:hover .marquee-track-gallery {
          animation-play-state: paused;
        }
        @keyframes marqueeLeft {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className={LAYOUT_PADDING}>
        <div className="mb-6 border-b border-slate-200 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Global Events &amp; Conferences
          </h3>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Captured <span className="text-[#0749A2]">Moments</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Live highlight reel from our conferences, seminars, and networking events across India.
          </p>
        </div>

        {/* City Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[{ name: 'All Cities', key: 'all' }, ...cities.map((c) => ({ name: c.name, key: c.name.toLowerCase() }))].map(
            (tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${filter === tab.key
                  ? 'bg-[#0749A2] text-white border-[#0749A2] shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#0749A2] hover:text-[#0749A2]'
                  }`}
              >
                {tab.key !== 'all' ? `📍 ${tab.name}` : tab.name}
              </button>
            )
          )}
        </div>
      </div>

      {/* Auto-scroll Marquee */}
      <div className="marquee-container-gallery relative w-full overflow-hidden py-2">
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <div className="marquee-track-gallery gap-4 items-stretch">
          {filteredItems.map((item, idx) => (
            <GalleryCard key={`a-${idx}`} item={item} onOpen={openLightbox} />
          ))}
          {filteredItems.map((item, idx) => (
            <GalleryCard key={`b-${idx}`} item={item} onOpen={openLightbox} />
          ))}
        </div>
      </div>

      <Lightbox src={lightbox.src} visible={lightbox.visible} onClose={closeLightbox} />
    </section>
  );
};

export default GallerySection;
