import React from 'react';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';

export const WhyChooseUs = () => (
  <section className="bg-white border-b border-slate-100 py-8 relative z-20 shadow-sm">
    <div className={LAYOUT_PADDING}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[
          { t: "Ind AS Expert", i: "🧠" },
          { t: "Concept Logic", i: "💡" },
          { t: "Updated Material", i: "📚" },
          { t: "Doubt Support", i: "💬" },
          { t: "Test Series", i: "📝" },
          { t: "Exam Strategy", i: "🎯" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-emerald-100 transition-colors border border-emerald-100/50">
              {item.i}
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide group-hover:text-emerald-700">
              {item.t}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

