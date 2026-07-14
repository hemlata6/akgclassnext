import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    Smartphone,
    ArrowRight,
    ShoppingBag,
    User,
    ChevronLeft,
    ChevronRight,
    Clock,
    ArrowUpRight,
    BookOpen,
    Layers,
    Video,
    FileText,
    HelpCircle,
    Volume2,
    Lightbulb,
    Tv,
    PlayCircle,
    Monitor,
    Laptop,
    Download,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    ShieldCheck,
    Calendar
} from 'lucide-react';
import { useRouter } from 'next/router';

export const SecondBannerSection = () => {
    const router = useRouter();

    // Fallback: Static promotional banner matching the image style
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-0 pt-0">
            <div className="mb-4 sm:mb-6 border-b border-slate-200 pb-3 sm:pb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-bold">Exemption Assistance Engine</h3>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-bold">100% Free Learning Resources</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-[#0c1a30] to-[#0a459a] rounded-3xl border border-blue-500/20 shadow-lg p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden aspect-auto md:aspect-video group transition-all duration-300 hover:shadow-xl">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_16px]"></div>
                    <div className="space-y-3 z-10 relative">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded uppercase tracking-wider">CA INTERMEDIATE</span>
                            <span className="text-[9px] font-bold text-emerald-300 flex items-center gap-1">⚡ Free Vault</span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight max-w-md font-bold">Unlock Complete CA Inter Audit & SM Free Resource Panel</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 max-w-sm text-[11px] text-slate-300 font-semibold">
                            <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-blue-400" /> Revision Videos & Marathons</span>
                            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-blue-400" /> Important Notes & E-Books</span>
                            <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Subjective Tests & MCQs</span>
                            <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-blue-400" /> Audio Notes & Exam Tips</span>
                        </div>
                    </div>
                    <div className="pt-4 z-10 relative flex items-center justify-between border-t border-white/10 mt-4">
                        <button onClick={() => router.push('/free-resources')} className="bg-white text-[#0a459a] font-black px-5 py-3 rounded-xl text-[11px] tracking-wider uppercase shadow-md hover:bg-slate-50 transition-all flex items-center gap-1.5 group/btn active:scale-95 font-bold">Explore Inter Vault <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" /></button>
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-blue-200/60 font-bold uppercase tracking-wider"><Lightbulb className="w-4 h-4 text-yellow-400" /> <span>Includes Motivation Corner</span></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#1a0b2e] to-[#311B92] rounded-3xl border border-purple-500/20 shadow-lg p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden aspect-auto md:aspect-video group transition-all duration-300 hover:shadow-xl">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_16px]"></div>
                    <div className="space-y-3 z-10 relative">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded uppercase tracking-wider">CA FINAL EXPERT LEVEL</span>
                            <span className="text-[9px] font-bold text-amber-300 flex items-center gap-1">⭐ Exemption Kit</span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight max-w-md font-bold">Access Advanced Auditing & Professional Ethics Materials</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 max-w-sm text-[11px] text-purple-200/90 font-semibold">
                            <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-purple-400" /> Revision Videos & Marathons</span>
                            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-purple-400" /> Important Notes & E-Books</span>
                            <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Subjective Tests & MCQs</span>
                            <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-purple-400" /> Professional Ethics Audio Notes</span>
                        </div>
                    </div>
                    <div className="pt-4 z-10 relative flex items-center justify-between border-t border-white/10 mt-4">
                        <button onClick={() => router.push('/free-resources')} className="bg-white text-[#311B92] font-black px-5 py-3 rounded-xl text-[11px] tracking-wider uppercase shadow-md hover:bg-slate-50 transition-all flex items-center gap-1.5 group/btn active:scale-95 font-bold">Explore Final Vault <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" /></button>
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-purple-300/60 font-bold uppercase tracking-wider"><Tv className="w-4 h-4 text-purple-400" /> <span>Ex-Big 4 Guidance Deck</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
