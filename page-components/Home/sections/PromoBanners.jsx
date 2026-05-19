import Endpoints from '@/config/endpoints';
import React, { useEffect, useState } from 'react';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';

export const PromoBanners = () => {
    const fallbackBanners = [
        {
            desktopSrc: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
            mobileSrc: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1080&q=80',
            alt: 'Banner'
        },
        {
            desktopSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
            mobileSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1080&q=80',
            alt: 'Banner'
        }
    ];
    const [current, setCurrent] = useState(0);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await Network.getBannersApi(instId);
            // console.log('API Response for Banners:', response);
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
                    // console.log('Fetched Banners:', bannerSlides);
                    setBanners(bannerSlides);
                } else {
                    setBanners(fallbackBanners);
                }
            } else {
                setBanners(fallbackBanners);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            setBanners(fallbackBanners);
        }
    };

    useEffect(() => {
        if (!banners.length) return undefined;

        const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <section className="w-full relative overflow-hidden bg-gray-900 group shadow-2xl">
            <div className="relative w-full h-[450px] md:h-[550px]">
                {banners.map((banner, i) => (
                    <div
                        key={i}
                        className={`w-full h-full transition-all duration-1000 ease-in-out ${i === current
                            ? 'opacity-100 scale-100 relative'
                            : 'opacity-0 scale-105 absolute top-0 left-0'
                            }`}
                    >
                        <img src={banner.desktopSrc || banner.mobileSrc} alt={banner.alt || 'Banner'} className="w-full h-full object-cover filter brightness-75" />
                        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center px-12">
                            <div className="max-w-xl text-white space-y-4">
                                <span className="bg-[#e11d48] text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest">Admissions Open 2026</span>
                                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">India's Premier CA & CMA Academy</h1>
                                <p className="text-gray-300 font-medium">Learn from India's most celebrated faculties with updated 2026 standard materials.</p>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>
        </section>
    );
};
