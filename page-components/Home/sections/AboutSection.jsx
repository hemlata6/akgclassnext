import React from 'react';
import { BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, Icons, LAYOUT_PADDING, TEXT_GREEN } from '../../../constants/Icons';
import { useTheme } from '../../../config/ThemeContext';

export const AboutSection = () => {
  const { theme } = useTheme();
  return (
    <section className="py-6 bg-white">
      <div className={LAYOUT_PADDING}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-8/12 space-y-4">
            <div className="flex-1 text-center lg:text-left">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Admissions Open: Enroll Now
            </div> */}
              <h1 className="text-2xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.15]">
                Master Accounting & <span className={TEXT_GREEN}>Financial Reporting </span>
                <br />with <span className="text-slate-800">CA Wallah</span>
              </h1>
              <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Simplified concepts, strong AS & Ind AS foundation, and a comprehensive, exam-oriented approach for <b> CA Foundation (Accounts), CA Inter (Advanced Accounting), and CA Final (Financial Reporting) </b> aspirants.
              </p>
            </div>
            {/* <div className="flex flex-wrap gap-4 pt-2">
            {["CA Foundation to CA Final Focus", "Concept-driven, Practical Learning", "Complete PYQ, RTP & MTP Coverage"].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Icons.Check /> {tag}
              </div>
            ))}
          </div> */}
            <div className="pt-1 text-center lg:text-left">
              <a
                href="/faculty"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                style={{ backgroundColor: theme.primary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
              >
                Know More about your Faculty
                <Icons.ChevronRight />
              </a>
            </div>
          </div>
          <div className="w-full md:w-4/12 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/4] bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-slate-700 font-bold text-lg">CA Wallah</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-lg">CA Wallah</p>
                <p className="text-emerald-300 text-[10px] uppercase tracking-widest">Founder & FR Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

