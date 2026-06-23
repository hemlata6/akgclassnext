import React, { useState } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '@/config/AuthContext';

const FAQS = [
    {
        q: 'Are these courses updated as per the latest ICAI syllabus and exam pattern?',
        a: 'Yes. All lectures, notes, question banks, and test series are fully updated according to the latest ICAI syllabus, amendments, and exam pattern for upcoming CA Foundation, Intermediate, and Final attempts. We continuously update the content whenever ICAI introduces any changes, ensuring you always study the most relevant material.'
    },
    {
        q: 'Will I get complete coverage from basics to exam-level preparation?',
        a: `Absolutely. Our courses are designed to take you from conceptual understanding to exam success:

Conceptual clarity from scratch
Practical and exam-oriented learning
Past exam question practice
Revision and answer-writing strategies

Whether you are a beginner or a repeat student, the course helps you build confidence and perform effectively in exams.`
    },
    {
        q: 'Do you provide notes, question banks, and test series with the course?',
        a: `Yes. Our course is a complete preparation package that includes:

Comprehensive study notes
Exam-oriented question bank
Coverage of past ICAI exam questions
Mock tests and revision support

You won’t need to purchase additional study material separately.`
    },
    {
        q: 'How is this course different from YouTube or free content?',
        a: `Free content is often scattered, incomplete, and lacks a clear study path. Our courses provide:

Structured learning roadmap
Complete syllabus coverage
Exam-focused teaching methodology
Smart preparation and revision strategy

This helps students avoid confusion, save valuable time, and stay focused on what actually matters for exams.`
    },
    {
        q: 'Is this course suitable if I am starting late or have limited preparation time?',
        a: `Yes. Many students join our courses with limited preparation time and still achieve excellent results because the content is concise, practical, and highly exam-focused.

You’ll get a clear study plan and priority-based preparation strategy to maximize your score in the available time.`
    },
    {
        q: 'What if I am unsure whether this course is right for me?',
        a: `That’s exactly why we focus on student outcomes and learning experience. Thousands of CA aspirants trust our courses because of:

Simple and clear explanations
Proven exam strategies
Consistent student success

If you're serious about clearing CA Foundation, Intermediate, or Final, this course provides the guidance, structure, and confidence needed to achieve your goal.`
    }
];

export const StudentSupportSection = () => {
    const [open, setOpen] = useState(null);
    const { institute } = useAuth();

    return (
        <section className="py-6 bg-white border-t border-slate-200">
            <div className={LAYOUT_PADDING}>
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                        <div className="mb-4">
                            <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Support</span>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-3">
                            {FAQS.map((item, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpen(open === i ? null : i)}
                                        className="w-full flex justify-between items-center p-3 text-left font-bold text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        {item.q} <span className="text-emerald-700 text-xl">{open === i ? '-' : '+'}</span>
                                    </button>
                                    {open === i && (
                                        <div className="p-3 pt-0 text-xs text-slate-500 border-t border-slate-100 leading-relaxed">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 sticky top-24">
                        <div className="bg-[#191a45] rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Still Confused? 🤔</h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">Don't worry! Our expert counselors are here to help you design a personalized study plan.</p>

                                {/* Contact Information */}
                                <div className="mb-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                        <span className="text-slate-300">{institute?.address || 'B Wing, 1st Floor, Bhakti Apt, Opp. Jain Temple, Jambhali Galli, Near Moksh Plaza, Borivali West, Mumbai – 400092.'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-emerald-400" />
                                        <a href={`mailto:${institute?.email || 'cashirishvyasonline@gmail.com'}`} className="text-slate-300 hover:text-white">{institute?.email || 'cashirishvyasonline@gmail.com'}</a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href="tel:+918591089800"
                                        className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <Phone /> Call: {institute?.instituteAppSettingsModals?.contact || '+91 85910 89800'}
                                    </a>
                                    <a
                                        href={`https://wa.me/{institute?.instituteAppSettingsModals.contact}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2 shadow-md border border-white/20"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                        WhatsApp Us
                                    </a>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-4 text-center">Available Mon-Sat (10 AM - 7 PM)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
