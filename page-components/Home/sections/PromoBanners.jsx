import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Award, BadgeCheck, Medal, Users, Crown } from 'lucide-react';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';
import mobilebanner from '../../../public/mobilebanner.png'
import desktopbanner from '../../../public/desktopbanner.jpeg'

export const PromoBanners = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const scrollContainerRef = useRef(null);
    const [slides, setSlides] = useState([]);

    const totalSlides = slides.length;

    // Fetch banners from API
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await Network.getBannersApi(instId);
            // console.log('API Response for Banners:', response);
            if (response && response.banners && response.banners.length > 0) {
                const activeBanners = response.banners.filter(
                    banner =>
                        banner.active && banner.group === 'Top banner'
                );

                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
                        ...banner,
                        mobileSrc: Endpoints.mediaBaseUrl + banner.banner,
                        desktopSrc: Endpoints.mediaBaseUrl + banner.banner,
                        alt: banner.title || 'Banner',
                        bg: 'bg-[#0749A2]'
                    }));
                    // console.log('Fetched Banners:', bannerSlides);
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
        // console.log('Banner clicked:', slide);
        const isRedirectBanner = String(slide?.type || '').toLowerCase() === 'link';
        const targetUrl = slide?.contentLink;

        if (isRedirectBanner && targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section className="relative w-full group bg-[#071226] overflow-hidden">
            {/* <div className="w-full aspect-[3/1] md:aspect-[3/1] lg:aspect-[3.5/1.1] relative overflow-hidden shadow-2xl">


                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-5" />

                {slides?.map((slide, index) => (
                    <div
                        onClick={() => handleLinkClick(slide)}
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${index === currentSlide
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0'
                            }`}
                    >

                        <img
                            src={slide.mobileSrc}
                            alt={slide.alt}
                            className="md:hidden w-full h-full object-cover"
                        />


                        <img
                            src={slide.desktopSrc}
                            alt={slide.alt}
                            className="hidden md:block w-full h-full object-cover"
                        />


                    </div>
                ))}


                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 border border-white/20 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>


                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 border border-white/20 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>


                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-12 lg:left-24 flex gap-1.5 sm:gap-2 z-30">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`rounded-full transition-all duration-300 ${currentSlide === idx
                                ? 'w-8 h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/50'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                                }`}
                        />
                    ))}
                </div>

            </div> */}

            {/* Mobile view */}
            <img
                src={mobilebanner.src}
                alt="Promo Banner"
                className="md:hidden w-full h-auto object-cover"
            />

            {/* Desktop view */}
            <img
                src={desktopbanner.src}
                alt="Promo Banner"
                className="hidden md:block w-full h-auto object-cover"
            />

        </section>
    );

};
