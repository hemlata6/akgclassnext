import React, { useState, useEffect } from 'react';
import { LAYOUT_PADDING, Icons } from '../../../constants/Icons';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';

export const StudentGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [canGoPrev, setCanGoPrev] = useState(false);
    const [canGoNext, setCanGoNext] = useState(true);

    const fallbackGallery = [
        '/vghub/student.jpg',
        '/vghub/6745-4887-6.jpg',
        '/vghub/6619-4887-6.jpg',
        '/vghub/4782-2760-5.jpg',
        '/vghub/4276-7635-9.jpg'
    ];

    useEffect(() => {
        fetchGallery();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        updateNavigationButtons();
    }, [currentIndex, gallery, itemsPerView]);

    const handleResize = () => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) setItemsPerView(1);
            else if (width < 1024) setItemsPerView(2);
            else if (width < 1280) setItemsPerView(3);
            else setItemsPerView(4);
        }
    };

    const getEffectiveGallery = () => {
        if (gallery.length > 0) return gallery;
        return fallbackGallery.map((img, index) => ({ id: `fallback-${index}`, img }));
    };

    const updateNavigationButtons = () => {
        const effectiveLength = getEffectiveGallery().length;
        setCanGoPrev(currentIndex > 0);
        setCanGoNext(currentIndex < effectiveLength - itemsPerView);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        const effectiveLength = getEffectiveGallery().length;
        if (currentIndex < effectiveLength - itemsPerView) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await Network.fetchGalley(instId);

            if (response && Array.isArray(response)) {
                // Map the array of image paths to objects with full URLs
                const galleryItems = response.map((imagePath, index) => ({
                    id: index,
                    img: Endpoints.mediaBaseUrl + imagePath,
                    // title: `Student ${index + 1}`,
                    // type: 'PHOTO'
                }));
                setGallery(galleryItems);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
       <>
         <section className="py-12 bg-white border-t border-slate-200">
            <div className={LAYOUT_PADDING}>
                <div className="text-center mb-10">
                    <span className="text-green-600 font-bold tracking-widest text-xs uppercase">Hall of Fame</span>
                    <h2 className="text-2xl md:text-2xl font-bold text-slate-900 mt-1">Student Wall of Love</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-slate-500">Loading gallery...</p>
                    </div>
                ) : (
                    <div>
                        {/* Carousel Container */}
                        <div className="overflow-hidden">
                            <div
                                className="flex gap-4 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                                }}
                            >
                                {getEffectiveGallery().map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="flex-shrink-0"
                                        style={{
                                            width: `calc((100% - ${(itemsPerView - 1) * 1}rem) / ${itemsPerView})`
                                        }}
                                    >
                                        <div className="gallery-card bg-white shadow-md border border-slate-200 rounded-2xl p-2 hover:shadow-lg transition-shadow">
                                            <div className={`bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center ${gallery.length === 0 ? 'aspect-[3/4]' : ''}`} style={{ minHeight: '200px' }}>
                                                <img
                                                    src={item.img}
                                                    className="gallery-image w-full h-full object-contain hover:opacity-95 transition-all duration-500"
                                                    alt={item.title || `Student feedback ${idx + 1}`}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center text-slate-400 p-8">No Image</div>';
                                                    }}
                                                />
                                            </div>
                                            {item.title && <p className="font-bold text-xs text-slate-900 mt-2 text-center">{item.title}</p>}
                                            {item.type && <span className="text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 uppercase font-bold block text-center">{item.type}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        {getEffectiveGallery().length > itemsPerView && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    onClick={handlePrev}
                                    disabled={!canGoPrev}
                                    className={`bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoPrev ? 'hover:scale-110 hover:bg-emerald-700 opacity-100' : 'opacity-30 cursor-not-allowed'
                                        }`}
                                >
                                    <Icons.ChevronLeft />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canGoNext}
                                    className={`bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoNext ? 'hover:scale-110 hover:bg-emerald-700 opacity-100' : 'opacity-30 cursor-not-allowed'
                                        }`}
                                >
                                    <Icons.ChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style jsx>{`
                .gallery-card {
                    animation: galleryFloat 4.5s ease-in-out infinite;
                    will-change: transform;
                }

                .gallery-card:nth-child(odd) {
                    animation-duration: 5.2s;
                }

                .gallery-card:nth-child(even) {
                    animation-duration: 4.3s;
                }

                .gallery-card:hover {
                    animation: galleryZoom 900ms ease-in-out infinite;
                }

                @keyframes galleryFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes galleryZoom {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
            `}</style>
        </section>
       </>
    );
};
