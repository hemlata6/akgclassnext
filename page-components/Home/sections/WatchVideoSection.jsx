import React, { useState } from 'react';

// Files in public/ are served at the root URL path
const FACULTY_IMAGE_URL = '/rishabhjain.png';

const feedbackImages = [
    '/feedbackimages/1.png',
    '/feedbackimages/2.png',
    '/feedbackimages/3.png',
    '/feedbackimages/4.png',
    '/feedbackimages/6.png',
    '/feedbackimages/7.png',
    '/feedbackimages/8.JPG',
    '/feedbackimages/11.jpeg',
    '/feedbackimages/12.jpeg',
];

// Split into two rows
const feedbackImagesRow1 = feedbackImages.slice(0, 5);
const feedbackImagesRow2 = feedbackImages.slice(5);

function FeedbackCard({ imageUrl, onClick }) {
    return (
        <div
            onClick={onClick}
            className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] aspect-square shrink-0 rounded-2xl overflow-hidden bg-[#121829] border border-slate-800/80 shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500/80 hover:shadow-2xl cursor-pointer group"
        >
            <img
                src={imageUrl}
                alt="Student Feedback"
                className="w-full h-full object-cover group-hover:brightness-110 transition duration-300"
            />
        </div>
    );
}

export default function WatchVideoSection() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="relative bg-[#111827] text-white py-14 px-4 md:px-8 font-sans overflow-hidden">

            {/* Dynamic Keyframe Styles */}
            <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 30s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: scrollRight 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">

                {/* --- LEFT SIDE: Featured Faculty Spotlight Card --- */}
                <div className="w-full lg:w-[420px] shrink-0 bg-[#121829] rounded-3xl p-8 md:p-10 border border-slate-800/80 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">

                    {/* Subtle Accent Light Beam */}
                    {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" /> */}

                    {/* Large Profile Photo with Glowing Ring */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
                        <img
                            src={FACULTY_IMAGE_URL}
                            alt="CA Rishabh Jain Sir"
                            className="relative w-56 h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-[#0b101d] shadow-2xl"
                        />
                    </div>

                    {/* Badge */}
                    <span className="text-blue-400 font-bold tracking-widest uppercase text-xs bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-3">
                        Student Feedback
                    </span>

                    {/* Main Name Header */}
                    <h2 className="text-3xl md:text-3xl font-bold tracking-tight text-white">
                        CA Rishabhh Jainn Sir
                    </h2>

                    <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-xs leading-relaxed font-normal">
                        Real feedback & exemption stories from students across CA Inter & Final.
                    </p>

                </div>

                {/* --- RIGHT SIDE: Dual-Row Marquee --- */}
                <div className="w-full lg:flex-1 relative overflow-hidden marquee-container space-y-6 py-2">

                    {/* Side Fades */}
                    <div className="absolute top-0 bottom-0 left-0 w-12 md:w-20 bg-gradient-to-r from-[#0b101d] to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-12 md:w-20 bg-gradient-to-l from-[#0b101d] to-transparent z-10 pointer-events-none" />

                    {/* Top Marquee Row (Moves Left) */}
                    <div className="overflow-hidden w-full">
                        <div className="animate-marquee-left space-x-5">
                            {[...feedbackImagesRow1, ...feedbackImagesRow1].map((imgUrl, idx) => (
                                <FeedbackCard key={`top-${idx}`} imageUrl={imgUrl} onClick={() => setSelectedImage(imgUrl)} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Marquee Row (Moves Right) */}
                    <div className="overflow-hidden w-full">
                        <div className="animate-marquee-right space-x-5">
                            {[...feedbackImagesRow2, ...feedbackImagesRow2].map((imgUrl, idx) => (
                                <FeedbackCard key={`bottom-${idx}`} imageUrl={imgUrl} onClick={() => setSelectedImage(imgUrl)} />
                            ))}
                        </div>
                    </div>

                </div>

            </div>

            {/* Image Popup / Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition z-10"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImage}
                            alt="Feedback"
                            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                        />
                    </div>
                </div>
            )}

        </section>
    );
}
