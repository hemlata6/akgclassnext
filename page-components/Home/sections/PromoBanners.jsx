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
            mobileSrc: "https://placehold.co/800x1200/312e81/FFF?text=CA VIVEK GABA",
            desktopSrc: "https://placehold.co/1200x500/312e81/FFF?text=CA VIVEK GABA",
            alt: "Live Batch",
            bg: "bg-indigo-900"
        },
        {
            mobileSrc: "https://placehold.co/800x1200/1e293b/FFF?text=CA ARUN SETIA",
            desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CA ARUN SETIA",
            alt: "Combo Offer",
            bg: "bg-slate-900"
        },
        {
            mobileSrc: "https://placehold.co/800x1200/1e293b/FFF?text=CS ANKUSH BANSAL",
            desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CS ANKUSH BANSAL",
            alt: "Combo Offer",
            bg: "bg-slate-900"
        },
        {
            mobileSrc: "https://placehold.co/800x1200/1e293b/FFF?text=CA CS HARSH GUPTA",
            desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CA CS HARSH GUPTA",
            alt: "Combo Offer",
            bg: "bg-slate-900"
        },
        {
            mobileSrc: "https://placehold.co/800x1200/1e293b/FFF?text=CS GD SALUJA",
            desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CS GD SALUJA",
            alt: "Combo Offer",
            bg: "bg-slate-900"
        }
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

    const handleLinkClick = (slide) => {
        if (slide?.contentLink) {
            window.open(slide?.contentLink, '_blank');
        }
    }

    return (
        <section className="relative w-full group bg-slate-900 overflow-hidden">

            <div className="w-full aspect-[2/1] md:aspect-[3/1] relative overflow-hidden">

                {slides?.map((slide, index) => (
                    <div
                        onClick={() => handleLinkClick(slide)}
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Mobile */}
                        <img
                            src={slide.mobileSrc}
                            alt={slide.alt}
                            className="md:hidden w-full h-full object-cover opacity-60"
                        />

                        {/* Desktop */}
                        <img
                            src={slide.desktopSrc}
                            alt={slide.alt}
                            className="hidden md:block w-full h-full object-cover opacity-60"
                        />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex items-center justify-start pl-6 md:pl-20 lg:pl-32">
                            <div
                                className="max-w-xl text-white opacity-0 animate-in slide-in-from-left-10 duration-700"
                                style={{
                                    animationDelay: '100ms',
                                    animationFillMode: 'forwards'
                                }}
                            >
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 tracking-tight">
                                    {slide.alt}
                                </h2>

                                <button className="bg-white text-slate-900 hover:bg-indigo-50 px-8 py-3.5 rounded-lg font-bold text-sm md:text-base transition-all hover:translate-x-1 flex items-center gap-2">
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Prev Button */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white p-3 border border-white/10 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <ChevronLeft />
                </button>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white p-3 border border-white/10 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <ChevronRight />
                </button>

                {/* Dots */}
                <div className="absolute bottom-8 left-6 md:left-20 lg:left-32 flex gap-2 z-30">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx
                                ? 'w-8 bg-indigo-500'
                                : 'w-2 bg-white/30 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );

};
