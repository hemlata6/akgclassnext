import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Award, BadgeCheck, Medal, Users, Crown } from 'lucide-react';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';

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

            <div className="w-full aspect-[3/1] md:aspect-[3/1] lg:aspect-[3.5/1.1] relative overflow-hidden shadow-2xl">

                {/* Animated Background Gradient */}
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
                        {/* Mobile */}
                        <img
                            src={slide.mobileSrc}
                            alt={slide.alt}
                            className="md:hidden w-full h-full object-cover"
                        />

                        {/* Desktop */}
                        <img
                            src={slide.desktopSrc}
                            alt={slide.alt}
                            className="hidden md:block w-full h-full object-cover"
                        />

                        {/* Dark Overlay
                        <div className="absolute inset-0 bg-gradient-to-r from-[#071226]/95 via-[#071226]/80 to-[#071226]/30" />

                        
                        <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
                            <div className="w-full max-w-[800px] text-white">
                                
                                ===== BADGES =====
                                <div className="flex flex-wrap gap-3 mb-[30px] font-montserrat">
                                    <span
                                        className="inline-flex items-center gap-1.5 h-10 px-[18px] text-sm font-bold leading-none rounded-lg"
                                        style={{
                                            background: 'rgba(255,255,255,.03)',
                                            border: '1px solid rgba(255,196,74,.45)',
                                            color: '#FFF',
                                        }}
                                    >
                                        <Crown className="w-3.5 h-3.5 text-[#F6D56B]" fill="#F6D56B" strokeWidth={1.5} />
                                        PROVEN RESULTS
                                    </span>
                                    <span
                                        className="inline-flex items-center h-10 px-[18px] text-sm font-bold leading-none rounded-lg"
                                        style={{
                                            background: 'rgba(255,255,255,.03)',
                                            border: '1px solid rgba(255,196,74,.45)',
                                            color: '#FFF',
                                        }}
                                    >
                                        1000+ EXEMPTIONS
                                    </span>
                                    <span
                                        className="inline-flex items-center h-10 px-[18px] text-sm font-bold leading-none rounded-lg"
                                        style={{
                                            background: 'rgba(255,255,255,.03)',
                                            border: '1px solid rgba(255,196,74,.45)',
                                            color: '#8585c4',
                                        }}
                                    >
                                        REGULAR &amp; FASTTRACK
                                    </span>
                                    <span
                                        className="inline-flex items-center h-10 px-[18px] text-sm font-bold leading-none rounded-lg"
                                        style={{
                                            background: 'rgba(255,255,255,.03)',
                                            border: '1px solid rgba(255,196,74,.45)',
                                            color: '#C8871F',
                                        }}
                                    >
                                        HINDI &amp; ENGLISH
                                    </span>
                                </div>

                                ===== HEADING =====
                                <div className="font-bebas">
                                    SCORE HIGH WITH
                                    <p className="text-white uppercase tracking-[0px] font-bold leading-[0.9] text-[24px] sm:text-[35px]">
                                        SCORE HIGH WITH
                                    </p>

                                    AUDIT MAESTRO - Gold Gradient Text
                                    <h2
                                        className="bg-gradient-to-b from-[#F6D56B] via-[#E5B24B] to-[#C8871F] bg-clip-text text-transparent font-black leading-[0.9] tracking-[0px] mb-0 pt-[5px] pb-[5px] drop-shadow-[0_4px_8px_rgba(185,125,34,0.4)]"
                                        style={{
                                            fontSize: 'clamp(40px, 10vw, 80px)',
                                            WebkitTextStroke: '0.5px rgba(246,213,107,0.15)',
                                        }}
                                    >
                                        AUDIT MAESTRO
                                    </h2>

                                    CA RISHABHH JAINN
                                    <p className="text-white font-bold leading-[0.9] tracking-[0px] mt-[-4px]">
                                        <span className="font-bebas flex items-center gap-[8px]" style={{ fontSize: 'clamp(28px, 6vw, 35px)' }}>
                                            CA RISHABHH JAINN
                                            <div className="w-[62%] h-px bg-gradient-to-r from-[#D9A441] via-[#D9A441]/60 to-transparent"></div>
                                        </span>
                                    </p>
                                </div>

                                ===== DIVIDER =====
                                

                                ===== STATS =====
                                <div className="flex flex-wrap gap-x-0 gap-y-4 mt-[30px] mb-0 font-montserrat w-full">
                                    Stat 1
                                    <div className="flex flex-row items-start gap-3 min-w-[120px] flex-1">
                                        <Award className="text-[#D9A441] w-12 h-12 mt-0 shrink-0" strokeWidth={1.5} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[#D9A441] text-[25px] font-bold leading-none">1000+</span>
                                            <span className="text-white text-base uppercase font-bold leading-tight mt-1">EXEMPTIONS</span>
                                        </div>
                                    </div>
                                    Stat 2
                                    <div className="flex flex-row items-start gap-3 min-w-[120px] flex-1">
                                        <BadgeCheck className="text-[#D9A441] w-12 h-12 mt-0 shrink-0" strokeWidth={1.5} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[#D9A441] text-[25px] font-bold leading-none">75+</span>
                                            <span className="text-white text-base uppercase font-bold leading-tight mt-1">ALL INDIA RANKS</span>
                                        </div>
                                    </div>
                                    Stat 3
                                    <div className="flex flex-row items-start gap-3 min-w-[120px] flex-1">
                                        <Medal className="text-[#D9A441] w-12 h-12 mt-0 shrink-0" strokeWidth={1.5} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[#D9A441] text-[25px] font-bold leading-none">14+</span>
                                            <span className="text-white text-base uppercase font-bold leading-tight mt-1">YEARS OF EXCELLENCE</span>
                                        </div>
                                    </div>
                                    Stat 4
                                    <div className="flex flex-row items-start gap-3 min-w-[120px] flex-1">
                                        <Users className="text-[#D9A441] w-12 h-12 mt-0 shrink-0" strokeWidth={1.5} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[#D9A441] text-[25px] font-bold leading-none">200K+</span>
                                            <span className="text-white text-base uppercase font-bold leading-tight mt-1">STUDENTS MENTORED</span>
                                        </div>
                                    </div>
                                </div>

                                ===== CTA BUTTONS =====
                                <div className="flex flex-wrap items-center gap-4 mt-[10px] font-montserrat">
                                    Primary Button
                                    <button className="group/btn relative inline-flex items-center justify-center h-[54px] w-[230px] rounded-lg font-bold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#D9A441]/30 active:scale-[0.98]"
                                        style={{
                                            background: 'linear-gradient(180deg, #F6D56B 0%, #E5B24B 40%, #C8871F 100%)',
                                            color: '#1a1a1a',
                                        }}
                                    >
                                        <span className="mr-3">ENROLL IN BATCH</span>
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90">
                                            <ArrowRight className="w-4 h-4 text-gray-900 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                ))}

                {/* Prev Button */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 border border-white/20 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 border border-white/20 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots Indicator */}
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

            </div>
        </section>
    );

};
