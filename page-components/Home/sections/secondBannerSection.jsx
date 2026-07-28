import React from 'react';
import {
    ArrowRight,
    Video,
    FileText,
    HelpCircle,
    Volume2,
    Lightbulb,
    Sparkles,
    ShieldCheck,
    GraduationCap
} from 'lucide-react';
import YoutubeVideoCarouselSection from './YoutubeVideoCarouselSection';

// Playcode.io safe router mock fallback
const usePlaycodeRouter = () => {
    try {
        const { useRouter } = require('next/router');
        return useRouter();
    } catch (e) {
        return {
            push: (path) => console.log(`[Playcode Mock Navigation]: Navigating to ${path}`)
        };
    }
};

export const SecondBannerSection = () => {
    const router = usePlaycodeRouter();

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-4 font-sans">
            {/* Header Title Bar */}
            <div className="mb-4 border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        Comprehensive Learning Hub
                    </h3>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                        100% Free CA Master Resource Vault
                    </h2>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 w-fit">
                    Updated for Upcoming Exams
                </span>
            </div>

            {/* Half-and-Half Layout: Banner Left | YouTube Carousel Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Half: Banner Card */}
                <div className="bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e1b4b] rounded-3xl border border-indigo-500/30 shadow-2xl p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:border-indigo-400/50 h-full flex flex-col">
                    {/* Background Pattern Effects */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col justify-start gap-4">
                        {/* Content Block */}
                        <div className="space-y-4">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> CA Inter & CA Final
                                </span>
                                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    ⚡ Instant Access
                                </span>
                                <span className="text-[10px] font-extrabold text-amber-300 flex items-center gap-1">
                                    ⭐ Zero Cost Registration
                                </span>
                            </div>

                            {/* Title & Description */}
                            <div>
                                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                                    Open Educational Resources
                                </h3>
                                <p className="text-slate-300 text-sm mt-1.5 font-medium leading-relaxed">
                                    Unlock Open Educational resources for Inter Audit and Strategic Management and Final Advanced Auditing
                                </p>
                            </div>

                            {/* Stats Counter Row */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <p className="text-white font-extrabold text-base">1000+</p>
                                    <p className="text-[9px] text-slate-400 font-medium">Exemption</p>
                                </div>
                                <div className="text-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <p className="text-white font-extrabold text-base">200+</p>
                                    <p className="text-[9px] text-slate-400 font-medium">All India Rankers</p>
                                </div>
                                <div className="text-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <p className="text-white font-extrabold text-base">100000+</p>
                                    <p className="text-[9px] text-slate-400 font-medium">Student taught</p>
                                </div>
                            </div>

                            {/* Feature Highlights Grid */}
                            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-200 font-semibold">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                    <span>Class Notes</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm flex items-center gap-1.5">
                                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span>QnA & MCQ Book Pdfs</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Test Papers</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm flex items-center gap-1.5">
                                    <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>Imp exam Pdfs</span>
                                </div>
                            </div>
                        </div>

                        {/* Bonus Tag */}
                        <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                            <span className="text-emerald-400">🎯</span>
                            <span>CA Intermediate Audit and Strategic Management (SM) and CA Final Audit content</span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-2">
                            <button
                                onClick={() => router.push('/free-resources?level=inter')}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold px-4 py-3 rounded-xl text-xs tracking-wider uppercase shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-between group/btn active:scale-[0.98]"
                            >
                                <span>🚀 Explore Free Resources</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>

                            {/* <div className="relative flex items-center gap-2">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest shrink-0">or</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            <button
                                onClick={() => router.push('/free-resources?level=final')}
                                className="w-full bg-white text-slate-900 font-extrabold px-3 py-2.5 rounded-xl text-[10px] tracking-wider uppercase shadow-lg hover:bg-slate-100 transition-all flex items-center justify-between group/btn active:scale-[0.98]"
                            >
                                <span>⭐ Explore Final Resources</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Right Half: YouTube Video Carousel */}
                <div className="h-full">
                    <YoutubeVideoCarouselSection compact />
                </div>
            </div>
        </section>
    );
};

export default SecondBannerSection;