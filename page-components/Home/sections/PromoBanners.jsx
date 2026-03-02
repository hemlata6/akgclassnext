import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';
import { useTheme } from '../../../config/ThemeContext';

export const PromoBanners = () => {
    const { theme } = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const scrollContainerRef = useRef(null);
    const [slides, setSlides] = useState([
        {
            mobileSrc: "https://placehold.co/800x1200/312e81/FFF?text=NextGenCA",
            desktopSrc: "https://placehold.co/1200x500/312e81/FFF?text=NextGenCA",
            alt: "Live Batch"
        },
        // {
        //     mobileSrc: "https://placehold.co/800x1200/1e293b/FFF?text=CA Jeyasree Krishnamoorthy",
        //     desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CA Jeyasree Krishnamoorthy",
        //     alt: "Combo Offer",
        //     bg: "bg-slate-900"
        // }
    ]);

    const totalSlides = slides.length;

    // Fetch banners from API
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await Network.getBannersApi(instId);
            if (response && response.banners && response.banners.length > 0) {
                const activeBanners = response.banners.filter(banner => banner.active);

                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
                        ...banner,
                        mobileSrc: Endpoints.mediaBaseUrl + banner.banner,
                        desktopSrc: Endpoints.mediaBaseUrl + banner.banner,
                        alt: banner.title || 'Banner'
                    }));
                    setSlides(bannerSlides);
                }
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

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
                                    className={`
                               w-full
      h-auto
      object-contain
                  transition-all duration-[1400ms]
                  
                  ${active
                                            ? `
                        scale-100
                        blur-0
                        rotate-y-0
                        opacity-100
                      `
                                            : `
                        scale-75
                        blur-md
                        opacity-60
                      `
                                        }
                `}
                                />

                                {/* FLIP + ZOOM EFFECT */}
                                <div
                                    className={`
                  absolute inset-0
                  transition-all duration-[1400ms]
                  ${active
                                            ? "bg-transparent"
                                            : "bg-black/20"
                                        }
                `}
                                />

                            </div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
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
                </div>
            </div>
        </section>
    );
};
