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

    const updateNavigationButtons = () => {
        setCanGoPrev(currentIndex > 0);
        setCanGoNext(currentIndex < gallery.length - itemsPerView);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < gallery.length - itemsPerView) {
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
        <section className="py-12 bg-white border-t border-slate-200">
            <div className={LAYOUT_PADDING}>
                <div className="text-center mb-10">
                    <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase">Hall of Fame</span>
                    <h2 className="text-2xl md:text-2xl font-bold text-slate-900 mt-1">Real Results</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-slate-500">Loading gallery...</p>
                    </div>
                ) : gallery.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500">No images available</p>
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
                                {gallery.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex-shrink-0"
                                        style={{
                                            width: `calc((100% - ${(itemsPerView - 1) * 1}rem) / ${itemsPerView})`
                                        }}
                                    >
                                        <div className="bg-white shadow-md border border-slate-200 rounded-2xl p-2 hover:shadow-lg transition-shadow">
                                            <div className="bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: '200px' }}>
                                                <img
                                                    src={item.img}
                                                    className="block hover:opacity-95 transition-all duration-500 rounded-lg"
                                                    alt={item.title || 'Student photo'}
                                                    style={{ maxHeight: '350px', maxWidth: '100%', height: 'auto', width: 'auto', objectFit: 'contain' }}
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
                        {gallery.length > itemsPerView && (
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
        </section>
    );
};
