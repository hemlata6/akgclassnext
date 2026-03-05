import React from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';

export const WhyChooseUsSection = () => {

  const features = [
    {
      icon: "📝",
      title: "ICAI Pattern Based Mock Tests",
      desc: "All papers strictly follow the latest ICAI exam pattern and marking scheme."
    },
    {
      icon: "🎯",
      title: "70%+ Question Similarity",
      desc: "Exam-focused questions designed to match real ICAI difficulty level."
    },
    {
      icon: "📋",
      title: "Detailed Evaluation & Feedback",
      desc: "Line-by-line evaluation with answer presentation improvement suggestions."
    },
    {
      icon: "📄",
      title: "Scanned Evaluated Copies",
      desc: "Receive your checked copies with remarks similar to ICAI correction style."
    },
    {
      icon: "📊",
      title: "Performance Analysis Report",
      desc: "Track strengths, weak areas, and overall progress through structured reports."
    },
    {
      icon: "🔁",
      title: "Revision Test Support",
      desc: "Special revision test series before exams for final practice boost."
    },
    {
      icon: "🎓",
      title: "Mentorship & Strategy Guidance",
      desc: "Premium students receive exam strategy sessions and answer-writing tips."
    }
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className={LAYOUT_PADDING}>

        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Why Choose CA Wallah Test Series?
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base max-w-2xl mx-auto">
            Experience ICAI-level preparation with structured mock tests,
            detailed evaluation, and expert guidance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>

              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {feature.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};