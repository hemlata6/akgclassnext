import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import Layout from '../../components/Layout';
import { useTheme } from '../../config/ThemeContext';
import Endpoints from '@/config/endpoints';
import { CoursesSection } from '@/page-components/Home/sections/CoursesSection';
import { BookStore } from '@/page-components/Home/sections/BookStore';

const parseFacultyStateQuery = (rawState) => {
    if (!rawState) return null;

    let current = Array.isArray(rawState) ? rawState[0] : rawState;
    if (typeof current !== 'string') return current;

    try {
        current = decodeURIComponent(current);
    } catch {
        // keep original value if decoding fails
    }

    for (let i = 0; i < 3; i += 1) {
        if (typeof current !== 'string') {
            return current && typeof current === 'object' ? current : null;
        }

        const trimmed = current.trim();

        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed === 'string') {
                current = parsed;
                continue;
            }
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch {
            // Some payloads come with extra wrapping quotes and escaped quotes.
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                current = trimmed.slice(1, -1).replace(/\\"/g, '"');
                continue;
            }
            return null;
        }
    }

    return null;
};

const FacultyProfile = ({}) => {

    const router = useRouter();
    const { theme } = useTheme();
    const { facultyname, state } = router?.query || {};

    const facultyState = useMemo(() => {
        return parseFacultyStateQuery(state);
    }, [state]);

    const facultyPayload = useMemo(() => {
        if (!facultyState) return null;
        if (facultyState?.faculty && typeof facultyState.faculty === 'object') {
            return facultyState.faculty;
        }
        if (facultyState?.id || facultyState?.firstName || facultyState?.lastName) {
            return facultyState;
        }
        return null;
    }, [facultyState]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fallbackFaculty = useMemo(() => {
        if (!facultyPayload && !facultyState?.fullName) return null;

        const fullName = facultyPayload
            ? [facultyPayload?.firstName, facultyPayload?.lastName].filter(Boolean).join(' ')
            : facultyState?.fullName;

        const domainNames = Array.isArray(facultyPayload?.domains)
            ? facultyPayload.domains.map((domain) => domain?.name).filter(Boolean)
            : [];

        const highlights = [];
        if (facultyPayload?.designation) highlights.push(`Designation: ${facultyPayload.designation}`);
        if (facultyPayload?.group) highlights.push(`Role: ${facultyPayload.group}`);
        if (facultyPayload?.contact) highlights.push(`Contact: ${facultyPayload.contact}`);
        if (facultyPayload?.email) highlights.push(`Email: ${facultyPayload.email}`);
        if (domainNames.length > 0) highlights.push(`Domains: ${domainNames.join(', ')}`);

        return {
            name: fullName,
            subtitle: facultyPayload?.designation || 'Faculty Mentor',
            profile: facultyPayload?.profile || null,
            image: facultyState?.image || '/nextgen/nextgenlogo.png',
            description: facultyPayload?.description || (domainNames.length > 0 ? `Specialized in ${domainNames.join(', ')}.` : ''),
            journey: facultyPayload?.joining ? `Joined on: ${new Date(facultyPayload.joining).toLocaleDateString()}` : '',
            otherDes: facultyPayload?.address ? `Address: ${facultyPayload.address}` : '',
            tagLine: facultyPayload?.userName ? `@${facultyPayload.userName}` : '',
            highlights,
        };
    }, [facultyPayload, facultyState]);

     const employeeCourseIds = facultyPayload?.courseIds ||
        facultyPayload?.courseId ||
        facultyPayload?.coursesIds ||
        [];


    const faculty = fallbackFaculty;
    const facultyImagePath = faculty?.profile || faculty?.image;
    const facultyImage = !facultyImagePath
        ? '/nextgen/nextgenlogo.png'
        : (String(facultyImagePath).startsWith('http') || String(facultyImagePath).startsWith('/'))
            ? facultyImagePath
            : `${Endpoints.mediaBaseUrl}${facultyImagePath}`;


    if (!faculty) {
        return <div className="p-10 text-center">Faculty Not Found</div>;
    }

    console.log('facultyPayload', facultyPayload);

    return (
        <Layout>
            <div id="faculty-profile-container" data-page="faculty-profile" className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                 <section id="faculty-hero-section" data-section="faculty-hero" className="bg-white py-16" style={{ backgroundColor: '#ffffff' }}>
                    <div className={LAYOUT_PADDING}>
                        <button
                            onClick={() => router.push('/')}
                            className="back-button inline-flex items-center gap-2 mb-8 transition-colors"
                            style={{ color: theme.primary }}
                        >
                            <Icons.ChevronLeft />
                            Back to Home
                        </button>

                         <div className={`flex flex-col md:flex-row items-start gap-12 md:min-h-auto]`}>
                            <div className="w-full md:w-1/3 md:sticky md:top-28 self-start">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square bg-slate-100">
                                    <img
                                        src={facultyImage}
                                        alt={facultyname}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 md:overflow-y-auto md:pr-2">
                                <div className="space-y-6">
                                    {/* {
                                        !faculty && (
                                            <> */}
                                                {/* <h1 className="text-4xl md:text-5xl font-bold text-slate-900">{facultyname}</h1> */}
                                                {/* <p className="subtitle text-2xl text-emerald-700">{facultySubtitle}</p> */}

                                            {/* </>
                                        )
                                    } */}
                                    <div className="description text-lg text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: facultyPayload?.address }} />
                                    {/* <p className="journey-text text-slate-600">
                                        {facultyJourney}
                                    </p> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <CoursesSection employeeCourseId={employeeCourseIds} />
                <BookStore employeeCourseId={employeeCourseIds} />

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
                {/* <section id="faculty-specializations-section" data-section="faculty-specializations" className="py-16 bg-slate-50">
                    <div className={LAYOUT_PADDING}> */}
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

                        {/* <div className="mt-2 max-w-3xl mx-auto">
                            <div className="rounded-2xl p-8 text-white text-center shadow-xl" style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})` }}>
                                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                                    Known for simplifying complex concepts, building strong fundamentals & inspiring students to push beyond limitations
                                </p>
                            </div>
                        </div> */}
                    {/* </div>
                </section> */}

                {/* CTA Section */}
                {/* <section id="faculty-cta-section" data-section="faculty-cta" className="pb-16">
                    <div className={LAYOUT_PADDING}>
                        <div className="cta-box rounded-2xl p-12 text-center text-white shadow-2xl max-w-4xl mx-auto" style={{ backgroundImage: `linear-gradient(135deg, #1e293b, #334155)` }}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your CA Journey?</h2>
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
                </section> */}

            </div>
        </Layout>
    );
};

export default FacultyProfile;
