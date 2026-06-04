import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';
import Endpoints from '../../../config/endpoints';

export const SecondBannerSection = () => {
    const router = useRouter();
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch banners from API
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await Network.getBannersApi(instId);
            if (response && response.banners && response.banners.length > 0) {
                const activeBanners = response.banners.filter(
                    banner =>
                        banner.active &&
                        banner.group?.toLowerCase() === "top banner"
                );

                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
                        ...banner,
                        mobileSrc: Endpoints.mediaBaseUrl + banner.banner,
                        desktopSrc: Endpoints.mediaBaseUrl + banner.banner,
                        alt: banner.title || 'Banner',
                        bg: 'bg-slate-900'
                    }));
                    setSlides(bannerSlides);
                }
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    // Auto-slide every 5 seconds if multiple banners
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // If image banners exist from API, render them as carousel
    if (slides.length > 0) {
        return (
            <section className="py-6 md:py-8">
                <div className={LAYOUT_PADDING}>
                    <div className="relative overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {slides.map((slide, i) => (
                                <div key={i} className="w-full flex-shrink-0 relative">
                                    <img
                                        src={slide.mobileSrc}
                                        alt={slide.alt}
                                        className="w-full h-auto object-cover rounded-2xl"
                                    />
                                    {slide.title && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                            <h2 className="text-white text-xl md:text-3xl font-bold text-center px-4">
                                                {slide.title}
                                            </h2>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Dots navigation */}
                        {slides.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            i === currentSlide
                                                ? 'bg-white w-6'
                                                : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // Fallback: Static promotional banner matching the image style
    return (
        <section className="py-6 md:py-8">
            <div className={LAYOUT_PADDING}>
                <div className="bg-[#071d49] rounded-2xl px-6 md:px-10 py-5 md:py-7 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    {/* Left: Text */}
                    <div className="text-center md:text-left">
                        <h2 className="text-white text-lg md:text-2xl font-bold leading-tight">
                            Get Ready For Nov/Dec 2026 Exams
                        </h2>
                        <p className="text-blue-200/70 text-xs md:text-sm mt-1 font-medium">
                            Enroll now and start your preparation with expert faculty
                        </p>
                    </div>

                    {/* Right: Button */}
                    <button
                        onClick={() => router.push('/store')}
                        className="flex-shrink-0 bg-white text-[#071d49] font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        ENROLL TODAY
                    </button>
                </div>
            </div>
        </section>
    );
};
