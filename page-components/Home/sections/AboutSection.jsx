import React from 'react';
import { BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, Icons, LAYOUT_PADDING, TEXT_GREEN } from '../../../constants/Icons';

export const AboutSection = () => (
  <section className="py-10 bg-white">
    <div className={LAYOUT_PADDING}>
      <div className="flex flex-col md:flex-row items-center gap-8">

        <div className="w-full md:w-8/12 space-y-4">
          <div className="flex-1 text-center lg:text-left">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Admissions Open: Enroll Now
            </div> */}
            <h5 className="text-1xl lg:text-1xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.15]">
              A Chartered Accountant <span className={TEXT_GREEN}>in first sitting at just 21 years of age, CA Sachin Raheja represents clarity, discipline, and smart strategy. </span>
              <span className="text-slate-800">He secured exemptions in GST in both CA Inter and CA Final, reflecting deep conceptual strength and exam mastery.</span>
            </h5>
            <p className="text-slate-600 text-base md:text-md max-w-lg mx-auto lg:mx-0 mb-4 leading-relaxed">
              With 1.5+ years of GST experience at EY, he combines practical exposure with academic precision. He is also the author of a concise 26-page GST Revision Book for CA/CMA Inter, designed to simplify complex provisions into exam-focused clarity.
              {/* <br /> Passionate about teaching, his mission is simple:
              To help students build strong fundamentals, think analytically, and achieve success early — just like he did. */}
            </p>
          </div>
          <div>
            <b>Learn smart. Clear Fast. Achieve young.</b>
          </div>
          <div className="flex flex-wrap gap-4">
            {["Complete PYQ, RTP & MTP Coverage", "Concept Clarity with Strong Application & Logic", "Practical Insights from Professional Experience", "Consistent Mentorship for Confidence & Clarity"].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Icons.Check /> {tag}
              </div>
            ))}
          </div>
          <div className="pt-2">
            <a
              href="/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Know More about your Faculty
              <Icons.ChevronRight />
            </a>
          </div>
        </div>
        <div className="w-full md:w-4/12 relative">
          {/* <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/4] bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-slate-700 font-bold text-lg">Sachin Raheja</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-bold text-lg">CA Sachin Raheja</p>
              <p className="text-emerald-300 text-[10px] uppercase tracking-widest">GST & Economics Mentor </p>
            </div>
          </div> */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/4] bg-slate-100">
            <img src="/nextgen/sachin.jpg" alt="Sachin Raheja" className="w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-bold text-lg">CA Sachin Raheja</p>
              <p className="text-emerald-300 text-[10px] uppercase tracking-widest">GST & Economics Mentor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

