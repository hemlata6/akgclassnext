import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';

const FALLBACK_SLIDES = [
    {
        mobileSrc: 'https://placehold.co/800x1200/312e81/FFF?text=MyEduNeeds',
        desktopSrc: 'https://placehold.co/1200x500/312e81/FFF?text=MyEduNeeds',
        alt: 'MyEduNeeds Banner'
    }
];

const resolveBannerSrc = (bannerPath) => {
    if (!bannerPath) return FALLBACK_SLIDES[0].desktopSrc;
    if (typeof bannerPath === 'string' && /^https?:\/\//i.test(bannerPath)) return bannerPath;
    return `${Endpoints.mediaBaseUrl}${bannerPath}`;
};

const isBannerActive = (activeValue) => activeValue === true || activeValue === 1 || activeValue === '1' || activeValue === 'true';

export const MyEduNeedsPromoBanners = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const scrollContainerRef = useRef(null);
    const [slides, setSlides] = useState(FALLBACK_SLIDES);

    const totalSlides = slides.length;

    // Fetch banners from API
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async (allowRetry = true) => {
        try {
            const response = await Network.getBannersApi(instId);
            const allBanners = Array.isArray(response?.banners) ? response.banners : [];
            const activeBanners = allBanners.filter((banner) => isBannerActive(banner?.active));
            const targetBanners = activeBanners.length > 0 ? activeBanners : allBanners;

            if (targetBanners.length > 0) {
                const bannerSlides = targetBanners
                    .filter((banner) => banner?.banner)
                    .map((banner) => ({
                        ...banner,
                        mobileSrc: resolveBannerSrc(banner.banner),
                        desktopSrc: resolveBannerSrc(banner.banner),
                        alt: banner.title || 'Banner'
                    }));

                setSlides(bannerSlides.length > 0 ? bannerSlides : FALLBACK_SLIDES);
            } else if (allowRetry) {
                setTimeout(() => fetchBanners(false), 1200);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            if (allowRetry) setTimeout(() => fetchBanners(false), 1200);
        }
    };

    useEffect(() => {
        if (currentSlide >= slides.length) setCurrentSlide(0);
    }, [slides.length, currentSlide]);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, totalSlides]);

    // Scroll to slide when currentSlide changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const slideWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: slideWidth * currentSlide,
                behavior: 'smooth'
            });
        }
    }, [currentSlide]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 10 seconds
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const handleClickOnImage = (slide) => {
        if (slide.contentLink) {
            window.open(slide.contentLink, '_blank');
        }
    };

    return (
        <section className="py-4 md:py-6 px-3 sm:px-4 md:px-0 overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="w-full md:max-w-7xl md:mx-auto relative md:px-4 lg:px-8">
                {/* Navigation Buttons - Desktop */}
                <button
                    onClick={prevSlide}
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-900 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-900 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: "none" }}
                >
                    {slides.map((slide, index) => {

                        const active = index === currentSlide;

                        return (
                            <div
                                key={index}
                                className={`
                flex-shrink-0
                w-full
                snap-center
                relative
                overflow-hidden
                rounded-2xl
                transition-all duration-1000
                ${active ? "z-10" : "z-0"}
              `}
                            >

                                {/* IMAGE */}
                                <img
                                    src={slide.desktopSrc}
                                    alt={slide.alt}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    onError={(event) => {
                                        event.currentTarget.src = FALLBACK_SLIDES[0].desktopSrc;
                                    }}
                                    className={`
                               w-full
      h-auto
      object-contain
                  transition-all duration-500
                  opacity-100
                `}
                                />

                                {/* FLIP + ZOOM EFFECT */}
                                <div
                                    className={`
                  absolute inset-0
                  transition-all duration-500
                  bg-transparent
                `}
                                />

                            </div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                {/* Pagination Dots */}
                {/* <div className="absolute -bottom-5 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full shadow-md transition-all duration-300 ${currentSlide === index
                                    ? 'bg-white w-6'
                                    : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div> */}
            </div>
        </section>
    );
};
