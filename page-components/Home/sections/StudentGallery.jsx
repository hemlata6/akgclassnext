import React, { useState, useEffect, useRef } from 'react';
import { LAYOUT_PADDING, Icons } from '../../../constants/Icons';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Ajay Vishwakarma',
        date: '21 March 2026',
        rating: 5,
        text: 'Inka padhaya kabhi samjh naa aaye aisa ho nhi skta yeh Jo bhi padhate hai uska ek logic dete hai aur wo logic itna natural hota hai ki apne aap cheejein yaad hojaati hai mai DT se bohot drta tha lekin jb maine ek baar sir ka podcast dekha and then maine sir k revision dekhe aur aaj mai G1 clear krchuka hu jan26 attempt mai isiliye mai yeh kahunga jo bhi sir se padhne k liye soch rhe hai Aap socho mtt seedha join kro sir ki classes aur result apne aap aayega .....'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        date: '15 March 2026',
        rating: 5,
        text: 'Best teacher for Direct Tax. His teaching style is unique and easy to understand. The way he explains complex concepts with simple logic is amazing. Highly recommended for CA Final students.'
    },
    {
        id: 3,
        name: 'Rahul Mehta',
        date: '10 March 2026',
        rating: 5,
        text: 'CA Shirish Vyas is an incredible mentor. His handwritten notes are a game changer. I cleared my CA Final DT in first attempt just because of his guidance. Thank you sir for your unwavering support!'
    },
    {
        id: 4,
        name: 'Neha Patel',
        date: '5 March 2026',
        rating: 5,
        text: 'I joined sir\'s classes for CA Inter DT and it was the best decision. The concepts are taught in such a logical manner that you never forget them. Sir also motivates us throughout the journey.'
    },
    {
        id: 5,
        name: 'Amit Kumar',
        date: '28 February 2026',
        rating: 5,
        text: 'The way sir breaks down every topic and gives real-life examples makes DT so easy. I used to struggle with tax but now it\'s my strongest subject. Grateful to have found such a great teacher.'
    },
    {
        id: 6,
        name: 'Sneha Reddy',
        date: '20 February 2026',
        rating: 5,
        text: 'Excellent faculty for CA Final DT. His revision videos are a lifesaver during exams. The practice manual is also very comprehensive. I scored 78 in DT thanks to sir\'s guidance!'
    }
];

const StarRating = ({ rating }) => (
    <span className="inline-flex gap-0.5">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < rating ? '#f5b342' : '#e0e0e0'}>
                <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
            </svg>
        ))}
    </span>
);

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const AVATAR_COLORS = ['#333978', '#2d6a4f', '#b9770e', '#c0392b', '#6c3483', '#1a5276'];

function truncateText(text, wordLimit = 10) {
    const words = text.split(' ');
    if (words.length <= wordLimit) return { short: text, isLong: false };
    return { short: words.slice(0, wordLimit).join(' ') + '...', isLong: true };
}

export const StudentGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 1;
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            handleNext();
        }, 6000);
        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    const maxIndex = TESTIMONIALS.length - 1;
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => Math.max(0, prev - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className={LAYOUT_PADDING}>
                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#333978' }}>
                        OUR SUCCESS STORIES
                    </h2>
                    <p className="mt-2 text-base" style={{ color: '#808081' }}>
                        Thousands of successful CAs moulded by CA Shirish Vyas
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`
                            }}
                        >
                            {TESTIMONIALS.map((item, idx) => {
                                const { short, isLong } = truncateText(item.text, 10);
                                const isExpanded = expandedIds.has(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className="flex-shrink-0 w-full"
                                    >
                                        <div className="bg-white rounded-xl border border-slate-200 p-6 h-full flex flex-col transition-shadow hover:shadow-md">
                                            {/* Stars + Google Icon Row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <StarRating rating={item.rating} />
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                                    </svg>
                                                    <span className="text-[10px] font-medium">Google</span>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    "{isExpanded ? item.text : short}"
                                                </p>
                                                {isLong && (
                                                    <button
                                                        onClick={() => {
                                                            setExpandedIds(prev => {
                                                                const next = new Set(prev);
                                                                if (isExpanded) next.delete(item.id);
                                                                else next.add(item.id);
                                                                return next;
                                                            });
                                                        }}
                                                        className="text-xs font-semibold mt-1 hover:underline"
                                                        style={{ color: '#333978' }}
                                                    >
                                                        {isExpanded ? 'Read less' : 'Read more'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Reviewer Info */}
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                                    style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                                                >
                                                    {getInitials(item.name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                                    <p className="text-xs" style={{ color: '#808081' }}>{item.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {TESTIMONIALS.length > itemsPerView && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={!canGoPrev}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 hover:border-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                                style={{ color: '#333978' }}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 hover:border-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                                style={{ color: '#333978' }}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
