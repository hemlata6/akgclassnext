import React from 'react';
import { PlayCircle } from 'lucide-react';

export const StudentGallery = () => {
    const studentShortsData = [
        { name: "Ananya Sharma", score: "Audit Exemption 78", course: "CA Inter Audit Regular", previewText: "Strategy shared for writing structural answers exactly according to ICAI framework helped immensely!" },
        { name: "Rahul Jaiswal", score: "AIR 14 Secured", course: "CA Final Advanced Audit", previewText: "Professional Ethics modules and clause breakdown matrices changed the full flow of my preparation." },
        { name: "Priyesh Solanki", score: "Audit Exemption 72", course: "CA Inter Audit + SM Combo", previewText: "Integrated study approach coupled with Concise Chartbooks allowed me to finish the curriculum in just 3 days!" },
        { name: "Sneha Reddy", score: "Cleared Final Both Groups", course: "CA Final Audit Batch", previewText: "The Ex-Big 4 structural strategies guidelines made standard disclosures logical instead of dry memorization." }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
            <div className="mb-8 border-b border-slate-200 pb-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-bold">Success Stories</h3>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-bold">Student Reviews & Exemption Shorts</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {studentShortsData.map((short, idx) => (
                    <div key={idx} className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden aspect-[9/16] group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/95 z-10"></div>
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-0 select-none">
                            <div className="flex flex-col items-center gap-2 text-slate-700 group-hover:text-[#0a459a] transition-colors duration-300">
                                <PlayCircle className="w-12 h-12 transform group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Click to Play Short</span>
                            </div>
                        </div>
                        <div className="absolute top-4 left-4 z-20 flex items-center">
                            <span className="text-[9px] font-black text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider shadow font-bold">★ {short.score}</span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end space-y-2">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-black text-white tracking-tight font-bold">{short.name}</h4>
                                <p className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wide font-bold">{short.course}</p>
                            </div>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-3 bg-black/20 p-2 rounded-lg backdrop-blur-sm border border-white/5 shadow-inner font-bold">"{short.previewText}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
