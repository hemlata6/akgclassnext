import React, { useState } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '@/config/AuthContext';

const FAQS = [
    { q: 'Why is RCA considered the best CA coaching institutes in Hyderabad?', a: 'RCA has been a trusted name in CA coaching since 2015, known for experienced faculty, structured preparation, conceptual teaching, and consistent student results across CA Foundation, Inter, and Final.' },
    { q: 'Does RCA conduct regular tests and revision exams?', a: 'Yes. RCA conducts periodic tests - chapter-wise along with the batch and Mock exams after the syllabus completion. The tests help the students to get more clarity, improve speed, presentation, and confidence before the main exams.' },
    { q: 'Does RCA provide coaching in English Language?', a: 'Yes. RCA offers complete CA coaching in English medium with conceptual clarity, exam-oriented preparation, and practical problem-solving approach. The jokes cracked in class may be in Hindi / Telugu or if a student requires further explanation in Hindi / Telugu, these language may be used.' },
    { q: 'What makes Rahul Sir\'s Costing coaching different from others?', a: 'RCA is known for strong conceptual teaching in Costing, extensive practice sessions, exam-focused revisions, and multiple student success stories including high scores and 100/100 results.' },
    { q: 'Does RCA help students who are attempting CA exams again?', a: 'Absolutely. RCA has guided many repeat-attempt students with strategic preparation plans, conceptual rebuilding, revision support, and exam-writing techniques.' },
    { q: 'How does RCA help students score high marks in CA exams?', a: 'RCA emphasizes conceptual clarity, repeated revisions, exam-oriented practice, presentation techniques, and strategic preparation methods to help students perform better.' }
];

export const StudentSupportSection = () => {
    const [open, setOpen] = useState(null);
    const {institute } = useAuth();

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
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Still Confused? 🤔</h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">Don't worry! Our expert counselors are here to help you design a personalized study plan.</p>

                                {/* Contact Information */}
                                <div className="mb-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                        <span className="text-slate-300">{institute?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-emerald-400" />
                                        <a href={`mailto:${institute?.email}`} className="text-slate-300 hover:text-white">{institute?.email}</a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href="tel:+917703880232"
                                        className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <Phone /> Call: +{institute?.instituteAppSettingsModals?.contact}
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
