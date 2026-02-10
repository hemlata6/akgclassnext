import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';

export const PromoBanners = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const scrollContainerRef = useRef(null);
    const [slides, setSlides] = useState([
        {
            mobileSrc: "https://placehold.co/800x1200/312e81/FFF?text=CA Pankaj Aswani",
            desktopSrc: "https://placehold.co/1200x500/312e81/FFF?text=CA Pankaj Aswani",
            alt: "Live Batch",
            bg: "bg-indigo-900"
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
        setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
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
                    className="flex overflow-x-auto gap-3 md:gap-6 pb-0 snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 w-[calc(100vw-24px)] sm:w-[calc(100vw-32px)] md:w-full h-[200px] sm:h-[240px] md:h-[350px] snap-center relative rounded-xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl md:shadow-indigo-500/10 group cursor-pointer ${slide.bg}`}
                        >
                            <img
                                src={slide.mobileSrc}
                                className="md:hidden w-full h-full object-cover"
                                alt={`${slide.alt} Mobile`}
                            />
                            <img
                                src={slide.desktopSrc}
                                className="hidden md:block w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                alt={`${slide.alt} Desktop`}
                            />
                        </div>
                    ))}
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
