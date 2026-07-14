import React from 'react';
import { Smartphone, Monitor, Laptop } from 'lucide-react';

export const AppDownload = () => (
  <section className="max-w-7xl mx-auto px-6 pb-20">
    <div className="bg-gradient-to-r from-white via-slate-50/50 to-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(10,69,154,0.03)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_16px_48px_rgba(10,69,154,0.06)]">
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-50/50 rounded-full pointer-events-none blur-3xl"></div>
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-50/30 rounded-full pointer-events-none blur-3xl"></div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
        {/* Classy Structured Copy Blocks */}
        <div className="space-y-3 max-w-xl">
          <span className="text-[9px] font-black bg-blue-50 text-[#0a459a] border border-blue-200/60 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm inline-block font-bold">
            CROSS-PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight font-bold">
            One Centralized Hub. Available Across All Stores.
          </h2>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            Seamlessly transit between screen viewports. Access encrypted offline video lectures, read downloaded reference notes, and check performance metrics on any phone or laptop device flawlessly.
          </p>
        </div>

        {/* Immersive White Glass Button Grid Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          {/* Android */}
          <a
            href="https://play.google.com/store/apps/details?id=com.classiolabs.ekatvamacademy&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 hover:border-[#0a459a] p-3.5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,69,154,0.06)] min-w-[130px] active:scale-95"
          >
            <Smartphone className="w-5 h-5 text-emerald-500 mb-1.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black font-bold text-slate-800 tracking-tight">Android App</span>
          </a>
          {/* iOS */}
          <a href="#" className="bg-white border border-slate-200 hover:border-[#0a459a] p-3.5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,69,154,0.06)] min-w-[130px] active:scale-95">
            <Smartphone className="w-5 h-5 text-sky-500 mb-1.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black font-bold text-slate-800 tracking-tight">Apple iOS</span>
          </a>
          {/* Windows */}
          <a href="#" className="bg-white border border-slate-200 hover:border-[#0a459a] p-3.5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,69,154,0.06)] min-w-[130px] active:scale-95">
            <Monitor className="w-5 h-5 text-blue-500 mb-1.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black font-bold text-slate-800 tracking-tight">Windows PC</span>
          </a>
          {/* macOS */}
          <a href="#" className="bg-white border border-slate-200 hover:border-[#0a459a] p-3.5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,69,154,0.06)] min-w-[130px] active:scale-95">
            <Laptop className="w-5 h-5 text-purple-500 mb-1.5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black font-bold text-slate-800 tracking-tight">macOS Apple</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

