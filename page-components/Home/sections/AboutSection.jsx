import React from 'react';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';

export const AboutSection = () => (
  <section className="py-10 bg-white">
    <div className={LAYOUT_PADDING}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-4/12 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/4] bg-slate-100">
            <img src="/vghub/Vivek gaba.png" alt="CA Praveen Jain" className="w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-bold text-lg">CA Praveen Jain</p>
              <p className="text-emerald-300 text-[10px] uppercase tracking-widest">Founder & FR Expert</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-8/12 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Founder, Accounts & <span className="text-slate-400">FR Expert
            </span>
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            <strong>At Fast Education , we don’t just teach Accounting & Financial Reporting; we decode it.</strong>, CA Praveen Jain brings practical industry experience into the classroom, transforming complex accounting concepts and Ind AS into logical, easy-to-retain frameworks. Our goal is simple: to make you <strong>exam-ready and industry-ready</strong>at every stage of the CA journey.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {["CA Foundation to CA Final Focus", "Concept-driven, Practical Learning", "Complete PYQ, RTP & MTP Coverage"].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Icons.Check /> {tag}
              </div>
            ))}
          </div>
          <div className="pt-4">
            <a
              href="/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Know More about your Faculty
              <Icons.ChevronRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

