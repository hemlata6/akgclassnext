import React, { useState, useEffect, useRef } from 'react';
import { LAYOUT_PADDING } from '@/constants/Icons';

const PauseIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const PlayIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const ChevronLeftIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRightIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

const YoutubeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const YOUTUBE_VIDEOS = [
    {
        id: "1",
        youtubeId: "x2A8eboPJsk",
        title: "CA Inter Audit & SM Guidance & Self Study Strategy",
        duration: "Strategy",
        category: "CA Inter",
        description: "Complete guidance and self-study strategy for CA Inter Audit & SM for Sept 26 Exam by CA Rishabhh Jainn Sir."
    },
    {
        id: "2",
        youtubeId: "NVkbw0j_0jA",
        title: "CA Inter Audit Marathon - Complete Revision",
        duration: "Marathon",
        category: "CA Inter",
        description: "Comprehensive revision session for CA Inter Audit covering key concepts and exam-focused topics."
    },
    {
        id: "3",
        youtubeId: "xQxiem9h90U",
        title: "CA Inter Audit Crisp Revision | Chapter 1 Part 1",
        duration: "Revision",
        category: "CA Inter Audit",
        description: "CA Inter Audit Crisp Revision Series - Chapter 1 Part 1 by CA Rishabhh Jainn Sir."
    },
    {
        id: "4",
        youtubeId: "C_xt5K9HTBY",
        title: "CA Inter Audit Crisp Revision | SA 300 Chapter 2",
        duration: "Revision",
        category: "CA Inter Audit",
        description: "CA Inter Audit Crisp Revision Series - SA 300 Part 1 Chapter 2 by CA Rishabhh Jainn Sir."
    },
    {
        id: "5",
        youtubeId: "hOGQqjCTKK4",
        title: "CA Final Audit | Guidance & Self Study Strategy",
        duration: "Strategy",
        category: "CA Final",
        description: "Guidance and self-study strategy for CA Final Audit Nov 26 Exam by CA Rishabhh Jainn Sir."
    }
];

export const YoutubeVideoCarouselSection = ({ compact }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [itemsPerView, setItemsPerView] = useState(compact ? 1 : 3);

    const timerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (compact) {
                setItemsPerView(2);
            } else if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [compact]);

    const maxIndex = Math.max(0, YOUTUBE_VIDEOS.length - itemsPerView);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    useEffect(() => {
        if (isPlaying && !activeVideoId) {
            timerRef.current = setInterval(() => {
                handleNext();
            }, 3500);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, activeVideoId, currentIndex, itemsPerView]);

    const content = (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 pb-3 border-b border-slate-200 gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest mb-1">
                                <YoutubeIcon className="w-3.5 h-3.5" />
                                <span>Free Video Lectures</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm transition-all"
                                title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
                            >
                                {isPlaying ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
                            </button>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={handlePrev}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-[#0a459a] hover:text-white hover:border-[#0a459a] shadow-sm transition-all active:scale-95"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-[#0a459a] hover:text-white hover:border-[#0a459a] shadow-sm transition-all active:scale-95"
                                >
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div
                        className="relative overflow-hidden flex-1"
                        onMouseEnter={() => setIsPlaying(false)}
                        onMouseLeave={() => setIsPlaying(true)}
                    >
                        <div
                            className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{
                                transform: `translateX(calc(-${currentIndex} * (${100 / itemsPerView}% + ${24 / itemsPerView}px)))`
                            }}
                        >
                            {YOUTUBE_VIDEOS.map((video) => (
                                <div
                                    key={video.id}
                                    className="flex-shrink-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0a459a]/40 transition-all duration-300 group flex flex-col justify-between"
                                    style={{
                                        width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
                                        minWidth: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`
                                    }}
                                >
                                    {/* Thumbnail / Video */}
                                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                        {activeVideoId === video.id ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                                                title={video.title}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setActiveVideoId(video.id)}
                                                className="relative w-full h-full cursor-pointer group/thumb"
                                            >
                                                <img
                                                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/50 transition-colors flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                                                        <PlayIcon className="w-5 h-5 text-white ml-0.5" />
                                                    </div>
                                                </div>
                                                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                    {video.duration}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-[#0a459a] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {video.category}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-[#0a459a] transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                                {video.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setActiveVideoId(video.id)}
                                            className="w-full bg-slate-100 hover:bg-[#0a459a] text-slate-700 hover:text-white font-bold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1 active:scale-98"
                                        >
                                            <PlayIcon className="w-3 h-3" /> Watch
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center items-center gap-2 mt-3">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-[#0a459a]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
    );

    if (compact) {
        return content;
    }

    return (
        <section className="py-12 bg-slate-50">
            <div className={`${LAYOUT_PADDING}`}>
                {content}
            </div>
        </section>
    );
};

export default YoutubeVideoCarouselSection;
