import React, { useState } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '@/config/AuthContext';

const FAQS = [
    {
        q: "Are the courses updated according to the latest ICAI syllabus and exam pattern?",
        a: "Yes. Every course is regularly updated to match the latest ICAI syllabus, amendments, and examination pattern so you always study the most relevant content."
    },
    {
        q: "Will I learn from the basics or is prior knowledge required?",
        a: "Our courses are designed to take you from fundamental concepts to advanced exam-oriented preparation, making them suitable for both beginners and repeaters."
    },
    {
        q: "What study material is included with the course?",
        a: "Depending on the course, you'll receive comprehensive notes, question banks, practice questions, revision material and other exam-focused resources."
    },
    {
        q: "How is this course different from free YouTube lectures?",
        a: "The actual lectures are exactly the replica of YouTube lectures which are available as demo for free. There is no difference between the demo lectures and the actual lectures uploaded in the course."
    },
    {
        q: "Is this course suitable if I'm starting late for my exams?",
        a: "Absolutely. We offer efficient study plans, revision strategies, and high-impact lectures designed to help students maximize their preparation even with limited time."
    },
    {
        q: "Will I receive doubt-solving support?",
        a: "Yes. Students can submit academic doubts through our support system, and our faculty team ensures timely clarification."
    },
    {
        q: "How long will I have access to the course?",
        a: "Course validity varies by batch. The exact access period is mentioned on each course page before enrollment."
    },
    {
        q: "Can I watch the lectures multiple times?",
        a: "Yes. During the validity period, you can revisit lectures as many times as permitted under the course access policy."
    },
    {
        q: "Are the lectures available on both mobile and desktop?",
        a: "Yes. You can access your course through supported devices, allowing you to study anytime and anywhere."
    },
    {
        q: "Is PDF of iPad notes provided?",
        a: "View option is given of iPad notes used by sir which every student is expected to write and make notes for theory reference during exams."
    },
    {
        q: "Will I receive revision lectures before the exams?",
        a: "Yes. Revision sessions, amendment updates, and exam-oriented guidance are provided whenever applicable."
    },
    {
        q: "Can I prepare for both May and September attempts using the same course?",
        a: "For CA/CMA Inter May / June / Sep / Dec & Jan attempt have the same syllabus, and CA Final May & Nov have the same syllabus."
    },
    {
        q: "Is there any refund or cancellation policy?",
        a: "Please refer to our Refund & Cancellation Policy available on the website before purchasing any course."
    },
    {
        q: "How do I enroll in a course?",
        a: "Simply choose your preferred course, complete the online payment process, and you'll receive access within 24 hours along with login instructions."
    },
    {
        q: "I'm a repeater. Is this course suitable for me?",
        a: "Yes. Our structured teaching approach focuses on strengthening conceptual understanding, improving answer-writing skills, and helping repeaters overcome previous challenges."
    },
    {
        q: "Can I access the course after changing my device?",
        a: "Yes. Device change policies are mentioned in the course guidelines. Support is available if you need assistance."
    },
    {
        q: "What if I face technical issues while accessing my course?",
        a: "Our technical support team is available to help you resolve login, playback, or access-related issues as quickly as possible."
    },
    {
        q: "How do I know which course is right for me?",
        a: "Our academic counselors can help you choose the most suitable course based on your level, attempt, and preparation status."
    },
    {
        q: "How can I get a time sheet or chapter-wise duration of lectures?",
        a: "The time sheet is uploaded on Drive and you will get access once lectures are purchased."
    },
    {
        q: "Can I extend my course after expiry?",
        a: "Yes, by paying nominal charges the course is extendable."
    },
    {
        q: "Does Shirish Sir solve questions in class?",
        a: "Yes, all questions in our practice manual are done in class both for Inter and Final."
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
