import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import Layout from '../../components/Layout';
import { useTheme } from '../../config/ThemeContext';

const FacultyProfile = () => {

    const router = useRouter();
    const { theme } = useTheme();
    const { facultyname } = router?.query || {};
    console.log('faculty name from URL:', router.query, facultyname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getFacultyData = (name) => {
        switch (name) {

            case "sachin-raheja":
                return {
                    name: "CA Sachin Raheja",
                    subtitle: "GST & Economics Mentor",
                    image: "/nextgen/sachin-website-pic.jpg",
                    description:
                        "A Chartered Accountant in first sitting at just 21 years of age, CA Sachin Raheja represents clarity, discipline, and smart strategy. He secured exemptions in GST in both CA Inter and CA Final, reflecting deep conceptual strength and exam mastery.",
                    journey:
                        "With 1.5+ years of GST experience at EY, he combines practical exposure with academic precision. He is also the author of a concise 26-page GST Revision Book for CA/CMA Inter, designed to simplify complex provisions into exam-focused clarity.",
                    otherDes: "Passionate about teaching, his mission is simple: To help students build strong fundamentals, think analytically, and achieve success early — just like he did.",
                    tagLine: "Learn smart. Clear Fast. Achieve young.",
                    highlights: [
                        "Complete PYQ, RTP & MTP Coverage",
                        "Concept Clarity with Strong Application & Logic",
                        "Practical Insights from Professional Experience",
                        "Consistent Mentorship for Confidence & Clarity"
                    ]
                };

            case "manas-arora":
                return {
                    name: "CA Manas Arora",
                    subtitle: "Accounts Faculty for All CA Levels (AIR-47, 44)(Ex-Hsbc, Aditya Birla Group)",
                    image: "/nextgen/manas.png",
                    description:
                        "He is May-23 qualified Chartered Accountant with AIR-47. He has 2 years of post qualification experience at HSBC as a Global Corporate Banker. He has done his Industrial training from Hindalco Industries Limited. He cleared both groups of CA Inter in November 2019 with 7 exemption out of 8 subjects and cleared CA Foundation with AIR-44 in November 2018. He was invited by ICAI branches of Mumbai and Pune and has delivered Leactures on various public forums.",
                    journey:
                        "He has been teaching Advanced Accounts and Financial Management to CA Inter Students. ",
                    otherDes: "CA Manas Arora is of the view that today’s classroom students will be tomorrow’s board meeting attendees, so he teaches with the real life example and practical scenarios which he Learnt during his Banking Job.",
                     tagLine: "#CAwithMA ✨  #HO JAEGA😉",
                    highlights: [
                        "Complete PYQ, RTP & MTP Coverage",
                        "Concept Clarity with Strong Application & Logic",
                        "Practical Insights from Professional Experience",
                        "Consistent Mentorship for Confidence & Clarity"
                    ]
                };

            case "tejinder-pal-singh":
                return {
                    name: "CA Tejinder Pal Singh",
                    subtitle: "Law Faculty | CA Foundation & CA Inter",
                    image: "/nextgen/talwinder.jpeg",
                    description:
                        "CA Tejinder Pal Singh is a Chartered Accountant known for his strong academic record and disciplined approach to excellence. He secured exemptions in all subjects at the CA Final level and was ranked among the Top 3 in Ludhiana — reflecting his conceptual strength and exam-focused preparation.",
                    journey:
                        "With 3 years of post-qualification experience at a reputed CA firm and at HDFC Bank, he brings valuable practical exposure to the classroom. His professional background enables him to bridge the gap between theory and real-world application, helping students understand not just the “what” of law, but also the “why” and “how.”",
                    otherDes: "His teaching philosophy is simple — make Law easy to understand, practical to relate to, and strategic to score in.",
                     tagLine: "",
                    highlights: [
                        "Learn Law with Logic.",
                        "Write with Precision.",
                        "Succeed with Confidence."
                    ]
                };

            default:
                return null;
        }
    };

    const faculty = getFacultyData(facultyname);


    if (!faculty) {
        return <div className="p-10 text-center">Faculty Not Found</div>;
    }

    return (
        <Layout>
            <div id="faculty-profile-container" data-page="faculty-profile" className="bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                <section id="faculty-hero-section" data-section="faculty-hero" className="py-16 border-t" style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}15, ${theme.primary}10)`, borderTopColor: theme.primary }}>
                    <div className={LAYOUT_PADDING}>
                        <button
                            onClick={() => router.push('/')}
                            className="back-button inline-flex items-center gap-2 mb-8 transition-colors"
                            style={{ color: theme.primary }}
                        >
                            <Icons.ChevronLeft />
                            Back to Home
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/3">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center" style={{ backgroundColor: `${theme.primary}20` }}>
                                    <div className="text-center">
                                        <img src={faculty.image}
                                            alt={faculty.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 space-y-6">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">{faculty.name}</h1>
                                <p className="subtitle text-2xl" style={{ color: theme.primary }}>{faculty.subtitle}</p>
                                <p className="description text-lg text-slate-700 leading-relaxed">
                                    {faculty.description}
                                    {/* A Chartered Accountant in first sitting at just 21 years of age, CA Sachin Raheja represents clarity, discipline, and smart strategy. He secured exemptions in GST in both CA Inter and CA Final, reflecting deep conceptual strength and exam mastery. */}
                                </p>
                                <p className="description text-lg text-slate-700 leading-relaxed">
                                    {faculty.journey}
                                    {/* With 1.5+ years of GST experience at EY, he combines practical exposure with academic precision. He is also the author of a concise 26-page GST Revision Book for CA/CMA Inter, designed to simplify complex provisions into exam-focused clarity. */}
                                </p>
                                <p className="description text-lg text-slate-700 leading-relaxed">
                                    {faculty.otherDes}
                                    {/* Passionate about teaching, his mission is simple:
                                    To help students build strong fundamentals, think analytically, and achieve success early — just like he did. */}
                                </p>
                                <div>
                                    <b>{faculty.tagLine}</b>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {faculty.highlights.map((tag, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                            <Icons.Check /> {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Key Highlights Section */}
                {/* <section id="faculty-highlights-section" data-section="faculty-highlights" className="py-16">
                    <div className={LAYOUT_PADDING}>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
                            Key Highlights & <span style={{ color: theme.primary }}>Achievements</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">📚</div>
                                    <h3 className="text-xl font-bold text-slate-900">Education & Qualification</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Chartered Accountant (CA)</p>
                                            <p className="text-sm text-slate-600">Cleared all levels in first attempt with All India Rank 43 in CA Finals</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Bachelor of Commerce (Hons.)</p>
                                            <p className="text-sm text-slate-600">Hindu College, University of Delhi</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">💼</div>
                                    <h3 className="text-xl font-bold text-slate-900">Corporate Experience</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Price Waterhouse Coopers (PwC)</p>
                                            <p className="text-sm text-slate-600">Statutory Audits of Listed companies</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">International Business Advisors LLP</p>
                                            <p className="text-sm text-slate-600">Indirect Tax Advisory (GST + Customs)</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Bharti Airtel Ltd.</p>
                                            <p className="text-sm text-slate-600">Young Leader & Business Finance Manager working closely with PAN-India finance leadership to drive revenue growth and optimize cost structures for Telecom business</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-2xl shadow-lg border p-8 hover:shadow-xl transition-shadow" style={{ backgroundColor: `${theme.primary}08`, borderColor: `${theme.primary}40` }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-4xl">👥</div>
                                    <h3 className="text-xl font-bold text-slate-900">Mentorship Impact</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Teaching CA students since <strong>2019</strong></p>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Trusted by <strong>200,000+ students</strong> for Accountancy, career guidance & conceptual clarity</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckIcon sx={{ color: theme.primary, fontSize: '1.25rem', flexShrink: 0 }} />
                                        <p className="text-slate-900">Consistent record of producing <strong>top scores</strong> in Accountancy</p>
                                    </li>
                                </ul>
                            </div>

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
                </section> */}

                {/* Specializations Section */}
                <section id="faculty-specializations-section" data-section="faculty-specializations" className="py-16 bg-slate-50">
                    <div className={LAYOUT_PADDING}>
                        {/* <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                            Areas of <span style={{ color: theme.primary }}>Specialization</span>
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
                        </div> */}

                        <div className="mt-2 max-w-3xl mx-auto">
                            <div className="rounded-2xl p-8 text-white text-center shadow-xl" style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})` }}>
                                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                                    Known for simplifying complex concepts, building strong fundamentals & inspiring students to push beyond limitations
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="faculty-cta-section" data-section="faculty-cta" className="pb-16">
                    <div className={LAYOUT_PADDING}>
                        <div className="cta-box rounded-2xl p-12 text-center text-white shadow-2xl max-w-4xl mx-auto" style={{ backgroundImage: `linear-gradient(135deg, #1e293b, #334155)` }}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your CA Journey?</h2>
                            {/* <p className="text-lg text-slate-300 mb-8">Join 200,000+ students learning with NextGenCA</p> */}
                            <button
                                onClick={() => router.push('/store')}
                                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-1"
                                style={{ backgroundColor: theme.primary }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
                                onMouseLeave={(e) => e.target.style.backgroundColor = theme.primary}
                            >
                                Explore Courses
                                <Icons.ChevronRight />
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
};

export default FacultyProfile;
