import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';

const BASE = '/gallery/Conference Photos of RJ Sir -20260810T111535Z-1-001/Conference Photos of RJ Sir';

const CITIES = [
  {
    name: 'Ahilyanagar',
    images: [
      'WhatsApp Image 2025-11-21 at 4.35.13 PM.jpeg',
      'WhatsApp Image 2025-11-21 at 4.35.16 PM.jpeg',
      'WhatsApp Image 2025-11-21 at 4.35.17 PM.jpeg',
      'WhatsApp Image 2025-11-21 at 4.35.20 PM.jpeg',
      'WhatsApp Image 2025-11-21 at 4.35.29 PM.jpeg',
    ],
  },
  {
    name: 'Faridabad',
    images: [
      'WhatsApp Image 2025-12-19 at 11.48.18 AM.jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.20 AM (1).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.20 AM.jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.21 AM (1).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.21 AM (2).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.21 AM (3).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.21 AM.jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.22 AM (1).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.22 AM (2).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.22 AM.jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.23 AM (1).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.23 AM (2).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.23 AM.jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.24 AM (1).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.24 AM (2).jpeg',
      'WhatsApp Image 2025-12-19 at 11.48.24 AM.jpeg',
    ],
  },
  {
    name: 'Jamnagar',
    images: [
      '20260619_185845.jpg.jpeg',
      '20260619_185847.jpg.jpeg',
      'DSC_0509.JPG.jpeg',
      'DSC_0510.JPG.jpeg',
      'DSC_0530.JPG.jpeg',
      'DSC_0536.JPG.jpeg',
      'DSC_0542.JPG.jpeg',
      'DSC_0560.JPG.jpeg',
      'DSC_0563.JPG.jpeg',
      'DSC_0564.JPG.jpeg',
      'DSC_0564_1.JPG.jpeg',
      'DSC_0578.JPG.jpeg',
      'DSC_0578_1.JPG.jpeg',
      'DSC_0580.JPG.jpeg',
      'DSC_0580_1.JPG.jpeg',
      'DSC_0582.JPG.jpeg',
    ],
  },
  {
    name: 'Kolkata',
    images: [
      'DSC_0182 (1).JPG',
      'DSC_0182.JPG',
      'DSC_0195.JPG',
      'DSC_0202.JPG',
      'DSC_0204.JPG',
      'DSC_0206.JPG',
      'DSC_0316.JPG',
      'DSC_0317.JPG',
      'IMG_20260623_170827.jpg.jpeg',
    ],
  },
  {
    name: 'Nagpur',
    images: [
      'WhatsApp Image 2026-07-25 at 8.19.09 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.09 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.09 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.10 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.10 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.10 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.10 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.11 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.11 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.11 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.11 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.12 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.12 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.12 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.12 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.13 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.13 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.13 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.13 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.14 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.14 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.14 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.14 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.15 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.15 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.15 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.15 PM (4).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.15 PM.jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.16 PM (1).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.16 PM (2).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.16 PM (3).jpeg',
      'WhatsApp Image 2026-07-25 at 8.19.16 PM.jpeg',
    ],
  },
  {
    name: 'Pune',
    images: [
      '9I1A3940.JPG',
      '9I1A3941.JPG',
      '9I1A4006.JPG',
      'DSC_6252.JPG',
      'DSC_6288.JPG',
      'DSC_6289.JPG',
    ],
  },
];

// Build flat item list once (module-level, not per render)
const ALL_ITEMS = CITIES.flatMap((city) =>
  city.images.map((img) => ({
    city: city.name.toLowerCase(),
    cityName: city.name,
    src: `${BASE}/${encodeURIComponent(city.name)}/${encodeURIComponent(img)}`,
  }))
);

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
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState({ src: null, visible: false });

  const filteredItems = useMemo(
    () => (filter === 'all' ? ALL_ITEMS : ALL_ITEMS.filter((i) => i.city === filter)),
    [filter]
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
          animation: marqueeLeft 180s linear infinite;
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
          {[{ name: 'All Cities', key: 'all' }, ...CITIES.map((c) => ({ name: c.name, key: c.name.toLowerCase() }))].map(
            (tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                  filter === tab.key
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
