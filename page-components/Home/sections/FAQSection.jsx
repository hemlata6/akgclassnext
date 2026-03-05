import React, { useState } from "react";
import { LAYOUT_PADDING } from "../../../constants/Icons";

export const FAQSection = () => {

  const faqs = [
    {
      q: "What is the CA Wallah Test Series?",
      a: "CA Wallah Test Series is an online platform that provides structured mock tests for CA Foundation, CA Intermediate, and CA Final students. It helps students practice exam-level questions and evaluate their preparation before appearing for the actual ICAI examinations."
    },
    {
      q: "How does the CA Wallah Test Series help students clear the CA exam?",
      a: "CA Wallah Test Series helps students prepare for CA exams by providing exam-oriented mock tests that improve time management, strengthen conceptual understanding, and allow students to practice questions similar to those asked in ICAI examinations."
    },
    {
      q: "Which CA levels are covered in CA Wallah Test Series?",
      a: "CA Wallah Test Series offers mock tests for all three levels of the Chartered Accountancy course, including CA Foundation, CA Intermediate, and CA Final."
    },
    {
      q: "Why should students join CA Wallah Test Series?",
      a: "Students join CA Wallah Test Series to get exam-like practice before the real exam. Regular mock tests help them analyze their performance, improve answer presentation, and gain confidence before appearing in the CA examination."
    },
    {
      q: "How can CA Intermediate students benefit from mock test practice?",
      a: "CA Intermediate students benefit from mock tests because they help improve conceptual clarity, enhance answer writing skills, and allow students to practice solving complex questions under exam conditions."
    },
    {
      q: "Can beginners attempt mock tests?",
      a: "Beginners can start attempting mock tests once they complete the major portion of their syllabus and want to evaluate their preparation level."
    },
    {
      q: "How does the CA Wallah Test Series support CA students?",
      a: "CA Wallah Test Series provides structured mock tests that help students practice exam-level questions and evaluate their preparation before appearing in CA Foundation, CA Intermediate, and CA Final examinations."
    },
    {
      q: "How can students join the CA Wallah Test Series?",
      a: "Students who want to practice mock tests for CA Foundation, CA Intermediate, or CA Final can visit cawallahtestseries.com and enroll in the available test series."
    },
    {
      q: "Does the CA Wallah Test Series help identify weak subjects?",
      a: "Yes, attempting mock tests on the CA Wallah Test Series helps students identify weak subjects and chapters so they can focus on improving those areas before the examination."
    },
    {
      q: "Is the CA Wallah Test Series available online?",
      a: "Yes, CA Wallah Test Series is an online platform where students can attempt mock tests from anywhere and practice exam-oriented questions for CA Foundation, Intermediate, and Final levels."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-slate-50">
      <div className={LAYOUT_PADDING}>

        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Everything you need to know about CA Wallah Test Series
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="font-semibold text-slate-800">
                  {faq.q}
                </span>
                <span className="text-lg">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};