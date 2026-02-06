import React, { useState, useEffect } from 'react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../../constants/Icons';
import Endpoints from '../../../config/endpoints';
import { useRouter } from 'next/router';
import Network from '@/config/Network';
import instId from '@/config/instituteId';

export const HeroSection = ({ onExploreClick }) => {

    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);

    const facultyCards = [
        { title: 'CA Arun Setia', url: '/vghub/Arun Setia.png' },
        { title: 'CA Vivek Gaba', url: '/vghub/Vivek gaba.png' },
        { title: 'CA Ankush Bansal', url: '/vghub/Ankush Bansal.png' },
        { title: 'CA GD Saluja', url: '/vghub/GD Saluja.png' },
        { title: 'CA Harsh Gupta', url: '/vghub/harsh gupta.jpg' }
    ];

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
                const activeBanners = response.banners.filter(banner => banner.active);

                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
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
                    <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 shadow-sm">India's #1 IDT Faculty</span>
                    <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-tight">Smart Prep for <br /><span className="text-indigo-700 drop-shadow-sm">IDT</span> & <span className="text-slate-500">AFM</span></h1>
                    <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                        Join the future of CA preparation. Personalized learning paths powered by expert logic.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
                        <button onClick={onExploreClick} className={`${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5`}>
                            View Courses <Icons.ChevronRight />
                        </button>
                        <button onClick={onDemoLecture} className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Icons.Play /> Watch Demo
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-6/12 relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {facultyCards.map((card, index) => (
                            <div
                                key={card.title}
                                className={`bg-white p-4 rounded-2xl shadow-xl border border-slate-200 text-center transform hover:scale-105 transition-transform duration-300 ${index === 0 ? 'md:col-start-1 md:row-start-1 md:-translate-y-2' :
                                        index === 1 ? 'md:col-start-2 md:row-start-1 md:translate-y-6' :
                                            index === 2 ? 'md:col-start-3 md:row-start-1 md:-translate-y-4' :
                                                index === 3 ? 'md:col-start-1 md:row-start-2 md:translate-y-4' :
                                                    'md:col-start-3 md:row-start-2 md:-translate-y-1'
                                    }`}
                            >
                                <div className="w-full aspect-square bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={card.url}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        alt={card.title}
                                    />
                                </div>
                                <p className="font-bold text-slate-900 text-sm">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

