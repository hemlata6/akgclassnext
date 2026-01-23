import React, { useState, useEffect } from 'react';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';

const MARATHON_CLIPS = [
    { src: "https://placehold.co/400x300/1e293b/FFF?text=Delhi+Marathon", caption: "Delhi Marathon - Housefull" },
    { src: "https://placehold.co/400x300/0f172a/FFF?text=Pune+Audit", caption: "Pune - 500+ Students" },
    { src: "https://placehold.co/400x300/312e81/FFF?text=Mumbai+Live", caption: "Mumbai - Full Energy" },
    { src: "https://placehold.co/400x300/4c1d95/FFF?text=Student+Love", caption: "After Class Doubts" },
    { src: "https://placehold.co/400x300/020617/FFF?text=Exam+Day", caption: "Last Day Revision" }
];

export const MarathonGallery = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % MARATHON_CLIPS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="marathon" className="py-12 bg-slate-50">
            <div className={LAYOUT_PADDING}>
                <div className="text-center mb-10">
                    <span className="text-slate-400 font-bold tracking-widest text-xs uppercase">The Vibe</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Face-to-Face Marathons</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[400px]">
                    <div className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 relative rounded-2xl overflow-hidden group bg-black shadow-2xl shadow-indigo-500/10">
                        {MARATHON_CLIPS.map((clip, i) => (
                            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                <img src={clip.src} className="w-full h-full object-cover transform scale-105" alt="Slideshow" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                                    <div>
                                        <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block shadow-lg">LIVE MOMENT</span>
                                        <p className="text-white font-bold text-lg md:text-xl drop-shadow-md">{clip.caption}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10">
                        <img src={MARATHON_CLIPS[1].src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0" alt="Thumb 1" />
                    </div>
                    <div className="hidden md:block col-span-1 row-span-1 relative rounded-2xl overflow-hidden group bg-black border border-white/10">
                        <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                                <Icons.Play />
                            </div>
                        </div>
                        <img src={MARATHON_CLIPS[2].src} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Video Thumb" />
                    </div>
                    <div className="hidden md:block col-span-2 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10">
                        <img src={MARATHON_CLIPS[3].src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0" alt="Thumb 3" />
                    </div>
                    <div className="md:hidden grid grid-cols-2 gap-4 h-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-md">
                            <img src={MARATHON_CLIPS[1].src} className="w-full h-full object-cover grayscale" alt="Mob 1" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-md">
                            <img src={MARATHON_CLIPS[3].src} className="w-full h-full object-cover grayscale" alt="Mob 2" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
