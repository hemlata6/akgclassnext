import React, { useState } from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';

const PLAYLIST_URL = "https://www.youtube.com/watch?v=CmEith20z5E&list=PLGo2uMKHpiuHlnp82gICF8Vwsz7N7Mech";

const testimonials = [
  {
    id: "CmEith20z5E",
    title: "Student Testimony for CA DIRECT TAX",
    author: "CA Final Student",
    comment: "NR Taxation & TDS/TCS coverage were excellent. Sir's daily recall made concepts crystal clear.",
  },
  {
    id: "OgXnMYvVu58",
    title: "What You Must Know Before Joining",
    author: "CA Dipti Lahoti",
    comment: "Sir's daily viva sessions, homework checks, and 1.5-day revision material made Direct Tax effortless.",
  },
  {
    id: "zM0qc0VpX4U",
    title: "CA Direct Tax Strategy Revealed",
    author: "CA Harsh Jain",
    comment: "Simplifying complex tax topics with structured books and real exam-like practice tests.",
  },
  {
    id: "FRDjuP0li-U",
    title: "CA Final Tax Strategy",
    author: "CA Harsh Jain",
    comment: "Unique memorization techniques and mock tests provided a true reality check before exams.",
  },
  {
    id: "3qnJyFycFMM",
    title: "Direct Tax Review & Strategy",
    author: "CA Dipti Lahoti",
    comment: "Personal mentoring, face-to-face interaction, and golden guidance for clearing in the first attempt.",
  },
  {
    id: "nnA6O4lOLjs",
    title: "My Journey & Experience with CA Shirish Vyas",
    author: "CA Aman Jalan",
    comment: "Simplified memory techniques transformed a massive subject into an enjoyable learning experience.",
  },
  {
    id: "C2fRp72V7HI",
    title: "How I Became a CA - Student Journey",
    author: "CA Hardik Kini",
    comment: "Daily revisions in class helped retain concepts thoroughly; the coaching style builds high discipline.",
  },
  {
    id: "-ju406fACv4",
    title: "AIR 30 CA Inter May 25 Success Story",
    author: "Sakshat Shetty (AIR 30)",
    comment: "Scored exemption with 78 in Tax thanks to personalized attention and color-coded iPad notes.",
  },
  {
    id: "Mhbj_AByW3c",
    title: "Dedication and Trust in Mentors",
    author: "Sakshi Rawat",
    comment: "Personal phone guidance from Sir motivated me to attempt and clear the exam without skipping.",
  },
];

export default function YoutubeTestimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const prevSlide = () => {
    setStartIndex((prev) => (prev === 0 ? testimonials.length - itemsPerPage : prev - 1));
  };

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= testimonials.length - itemsPerPage ? 0 : prev + 1));
  };

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-12 md:py-2 md:pt-0 md:pb-14 bg-white">
      <div className={LAYOUT_PADDING}>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Student Testimonials
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Watch real student reviews and success stories ({startIndex + 1}-{startIndex + visibleTestimonials.length} of {testimonials.length})
            </p>
          </div>

          {/* Buttons: View All + Carousel Controls */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#000d4e] hover:bg-[#000d4e] text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <button
              onClick={prevSlide}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              aria-label="Previous Testimonials"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              aria-label="Next Testimonials"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleTestimonials.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md flex flex-col transition-shadow hover:shadow-lg">
              
              {/* Responsive Embedded YouTube Player */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.id}`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Title and Details */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs italic mb-3 leading-relaxed line-clamp-2">
                    "{item.comment}"
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                  — {item.author}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Carousel Dot Indicators */}
        <div className="flex justify-center space-x-1.5 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index > testimonials.length - itemsPerPage ? testimonials.length - itemsPerPage : index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                startIndex === index ? 'w-6 bg-red-500' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}