import React, { useState, useEffect } from 'react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../../constants/Icons';
import Endpoints from '../../../config/endpoints';
import { useRouter } from 'next/router';
import Network from '@/config/Network';
import instId from '@/config/instituteId';

export const HeroSection = ({ onExploreClick }) => {

    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([
        {
            url: "https://placehold.co/800x1200/312e81/FFF?text=Pankaj Aswani",
            desktopSrc: "https://placehold.co/1200x500/312e81/FFF?text=Pankaj Aswani",
            title: "Live Batch",
            bg: "bg-indigo-900"
        },
        // {
        //     url: "https://placehold.co/800x1200/1e293b/FFF?text=CA Jeyasree Krishnamoorthy",
        //     desktopSrc: "https://placehold.co/1200x500/1e293b/FFF?text=CA Jeyasree Krishnamoorthy",
        //     title: "Combo Offer",
        //     bg: "bg-slate-900"
        // }
    ]);

    useEffect(() => {
        fetchBanners();

    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const fetchBanners = async () => {

        try {

            const response = await Network.getBannersApi(instId);
            if (response && response.banners && response.banners.length > 0) {
                // Filter only active banners
                const activeBanners = response.banners.filter(banner => banner.active && !banner?.group);

                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
                        ...banner,
                        type: 'image',
                        url: Endpoints.mediaBaseUrl + banner.banner,
                        title: banner.title || ''
                    }));
                    setSlides(bannerSlides);
                }
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const onDemoLecture = () => {
        router.push('/free-resources');
    }

    return (
        <div className="relative bg-slate-50 pt-10 pb-16 overflow-hidden">
            <div className={`${LAYOUT_PADDING} relative z-10 flex flex-col-reverse lg:flex-row items-center gap-10`}>
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Admissions Open: Enroll Now
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.15]">
                        Master Accounting & <span className={TEXT_GREEN}>Financial Reporting </span>
                        <br />with <span className="text-slate-800">CA Wallah</span>
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                        Simplified concepts, strong AS & Ind AS foundation, and a comprehensive, exam-oriented approach for <b> CA Foundation (Accounts), CA Inter (Advanced Accounting), and CA Final (Financial Reporting) </b> aspirants.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
                        <button onClick={onExploreClick} className={`${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5`}>
                            Explore Batches <Icons.ChevronRight />
                        </button>
                        <button onClick={onDemoLecture} className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Icons.Play /> Demo Lectures
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-6/12 relative group">
                    <div className="relative w-full aspect-video bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out
    ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    ${slide.contentLink ? 'cursor-pointer' : ''}
  `}
                                onClick={() => {
                                    if (slide.contentLink) {
                                        window.open(slide.contentLink, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                            >
                                <img
                                    src={slide.url}
                                    alt={slide.title}
                                    className="w-full h-full object-cover pointer-events-none"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-4 left-4 text-white pointer-events-none">
                                    <p className="text-lg font-bold">{slide.title}</p>
                                    {slide.contentLink && (
                                        <p className="text-xs text-yellow-300 font-semibold mt-1">
                                            Click to view
                                        </p>
                                    )}
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

