import React, { useState, useRef } from 'react';

const VideoHighlight = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);
    const togglePlay = () => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section className="relative w-full h-[65vh] overflow-hidden bg-black flex items-center justify-center border-y border-white/10 shadow-inner">
            {/* Replaced with an unblocked educational ambient loop link that doesn't trigger CORS/Hotlink restrictions */}
            <video
                ref={videoRef} autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                src="https://assets.mixkit.co/videos/preview/mixkit-studying-under-a-desk-lamp-42238-large.mp4"
            />
            <div className="relative z-10 text-center px-6 max-w-5xl">
                <div className="flex justify-center mb-6 font-black text-3xl tracking-widest text-white">
                    <img src="/logo.png" alt="Fast Education" className="w-16 md:w-40 h-16 md:h-30 object-contain" />
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase">Welcome to FAST Education</h2>
                <p className="text-lg md:text-xl text-gray-200 font-bold tracking-[0.1em] mb-10 opacity-90 py-6 border-y border-white/10 uppercase">Turning 'attempt' into 'success' since 2006. Welcome aboard!</p>
                <button className="bg-white text-black px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#e11d48] hover:text-white transition-all group overflow-hidden relative">
                    <span className="relative z-10 flex items-center gap-4">Get more of us on YouTube <span className="text-xl group-hover:translate-x-3 transition-transform duration-500">→</span></span>
                </button>
            </div>
            <div className="absolute bottom-10 right-10 z-20 flex items-center gap-6">
                <button onClick={togglePlay} className="w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#e11d48] transition-all duration-500 shadow-2xl">
                    {isPlaying ? <span>❚❚</span> : <span>▶</span>}
                </button>
                <div className="bg-[#e11d48] text-white px-8 py-5 rounded-[2.5rem] font-black text-[13px] uppercase tracking-widest shadow-[0_20px_60px_-10px_rgba(225,29,72,0.5)] flex items-center gap-3">
                    <span className="text-2xl">💬</span> Help
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
        </section>
    );
};

export default VideoHighlight;