import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import { Icons, LAYOUT_PADDING } from '../constants/Icons';
import { Footer } from '../components/Shared/SharedComponents';

const FacultyProfile = () => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div id="faculty-profile-container" data-page="faculty-profile" className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                <section id="faculty-hero-section" data-section="faculty-hero" className="bg-white py-16" style={{ backgroundColor: '#ffffff' }}>
                    <div className={LAYOUT_PADDING}>
                        <button
                            onClick={() => router.push('/')}
                            className="back-button inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-8 transition-colors"
                        >
                            <Icons.ChevronLeft />
                            Back to Home
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/3">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square bg-slate-100">
                                    <img
                                        src="/sir image1.jpg"
                                        alt="CA Vipul Dhall"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 space-y-6">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">CA Vipul Dhall</h1>
                                <p className="subtitle text-2xl text-emerald-700">All India Rank 43 | First Attempt Chartered Accountant</p>
                                <p className="description text-lg text-slate-700 leading-relaxed">
                                    CA Vipul Dhall is a first-attempt Chartered Accountant and All India Rank 43 holder, known for transforming the way thousands of students learn Accountancy across India. A graduate of the prestigious Hindu College, University of Delhi, Vipul blends corporate experience with a deep passion for teaching, empowering over 200,000 students through clarity, mentorship, and real-world financial insight.
                                </p>
                                <p className="journey-text text-slate-600">
                                    His journey—from PwC to Bharti Airtel Ltd. to becoming a nationally trusted CA mentor—continues to inspire thousands of students to believe that the CA dream is not just achievable, but conquerable with the right guidance.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Highlights Section */}
                <section id="faculty-highlights-section" data-section="faculty-highlights" className="py-16">
                    <div className={LAYOUT_PADDING}>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
                            Key Highlights & <span className="text-emerald-800">Achievements</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Education & Qualification */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">📚</div>
                                    <h3 className="text-xl font-bold text-slate-900">Education & Qualification</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Chartered Accountant (CA)</p>
                                            <p className="text-sm text-slate-600">Cleared all levels in first attempt with All India Rank 43 in CA Finals</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Bachelor of Commerce (Hons.)</p>
                                            <p className="text-sm text-slate-600">Hindu College, University of Delhi</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Corporate Experience */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">💼</div>
                                    <h3 className="text-xl font-bold text-slate-900">Corporate Experience</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Price Waterhouse Coopers (PwC)</p>
                                            <p className="text-sm text-slate-600">Statutory Audits of Listed companies</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">International Business Advisors LLP</p>
                                            <p className="text-sm text-slate-600">Indirect Tax Advisory (GST + Customs)</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Bharti Airtel Ltd.</p>
                                            <p className="text-sm text-slate-600">Young Leader & Business Finance Manager working closely with PAN-India finance leadership to drive revenue growth and optimize cost structures for Telecom business</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Mentorship Impact */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">👥</div>
                                    <h3 className="text-xl font-bold text-slate-900">Mentorship Impact</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Teaching CA students since <strong>2019</strong></p>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Trusted by <strong>200,000+ students</strong> for Accountancy, career guidance & conceptual clarity</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: '#059669', fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Consistent record of producing <strong>top scores</strong> in Accountancy</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Student Achievements */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl shadow-lg border border-amber-200 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">🏆</div>
                                    <h3 className="text-xl font-bold text-slate-900">Highest Marks by Students</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-white/70 rounded-xl p-4">
                                        <p className="font-semibold text-slate-900">CA Foundation Accounting</p>
                                        <p className="text-3xl font-bold text-amber-600">97</p>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/70 rounded-xl p-4">
                                        <p className="font-semibold text-slate-900">CA Inter Advanced Accounting</p>
                                        <p className="text-3xl font-bold text-amber-600">92</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Specializations Section */}
                <section id="faculty-specializations-section" data-section="faculty-specializations" className="py-16 bg-slate-50">
                    <div className={LAYOUT_PADDING}>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                            Areas of <span className="text-emerald-800">Specialization</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { title: "CA Foundation Accounts", icon: "📚" },
                                { title: "CA Inter Advanced Accounts", icon: "📊" },
                                { title: "CA Final Financial Reporting", icon: "📈" }
                            ].map((spec, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <div className="text-4xl mb-4">{spec.icon}</div>
                                    <h3 className="text-lg font-bold text-slate-900">{spec.title}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 max-w-3xl mx-auto">
                            <div className="emerald-box bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-8 text-white text-center shadow-xl">
                                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                                    Known for simplifying complex concepts, building strong fundamentals & inspiring students to push beyond limitations
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="faculty-cta-section" data-section="faculty-cta" className="py-16">
                    <div className={LAYOUT_PADDING}>
                        <div className="cta-box bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-center text-white shadow-2xl max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your CA Journey?</h2>
                            <p className="text-lg text-slate-300 mb-8">Join 200,000+ students learning with CA Vipul Dhall</p>
                            <button
                                onClick={() => router.push('/store')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                Explore Courses
                                <Icons.ChevronRight />
                            </button>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
};

export default FacultyProfile;
