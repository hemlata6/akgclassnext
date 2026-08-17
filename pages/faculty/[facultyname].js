import React, { useEffect, useMemo, useState, useRef, useCallback  } from 'react';
import { useRouter } from 'next/router';
import { LAYOUT_PADDING } from '../../constants/Icons';
import Layout from '../../components/Layout';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import Endpoints from '@/config/endpoints';
import { CoursesSection } from '@/page-components/Home/sections/CoursesSection';
import { BookStore } from '@/page-components/Home/sections/BookStore';
import { Footer } from '@/components/Shared/SharedComponents';


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

const FacultyProfile = ({ }) => {

    const router = useRouter();
    // const { theme } = useTheme();
    const { facultyname, state } = router?.query || {};
    // const [employees, setEmployees] = useState([]);
    // const [employeesLoading, setEmployeesLoading] = useState(false);
    // const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);

    const [banner, setBanner] = useState(null);

    // Fetch banner from API — re-fetch when faculty name changes
    const fetchBanner = useCallback(async () => {
        try {
            const response = await Network.getBannersApi(instId);
            if (response && response.banners && response.banners.length > 0) {
                const normalize = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-');
                const matchingBanner = response.banners.find(
                    banner =>
                        banner.active && normalize(banner.group) === normalize(facultyname)
                );

                if (matchingBanner) {
                    const firstBanner = matchingBanner;
                    setBanner({
                        ...firstBanner,
                        mobileSrc: Endpoints.mediaBaseUrl + firstBanner.banner,
                        desktopSrc: Endpoints.mediaBaseUrl + firstBanner.banner,
                        alt: firstBanner.title || 'Banner',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    }, [facultyname]);

    useEffect(() => {
        setBanner(null);
        fetchBanner();
    }, [facultyname, fetchBanner]);

    const handleBannerClick = () => {
        const isRedirectBanner = String(banner?.type || '').toLowerCase() === 'link';
        const targetUrl = banner?.contentLink;

        if (isRedirectBanner && targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    };

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

    const imageRef = useRef(null);
    const placeholderRef = useRef(null);
    const IMAGE_TOP = 245;
    const IMAGE_WIDTH = 350;

    // Hybrid fixed/absolute to keep image in view while scrolling description (desktop only)
    useEffect(() => {
        const isDesktop = window.innerWidth >= 768;
        if (!isDesktop) return;

        const section = document.getElementById('faculty-hero-section');
        const image = imageRef.current;
        const placeholder = placeholderRef.current;
        if (!section || !image || !placeholder) return;

        const setFixed = () => {
            image.style.position = 'fixed';
            image.style.top = `${IMAGE_TOP}px`;
            image.style.bottom = 'auto';
            image.style.width = `${IMAGE_WIDTH}px`;
        };

        const setAbsolute = () => {
            image.style.position = 'absolute';
            image.style.top = 'auto';
            image.style.bottom = '0';
            image.style.width = `${IMAGE_WIDTH}px`;
        };

        const handleScroll = () => {
            const sectionBottom = section.getBoundingClientRect().bottom;
            const imageHeight = image.offsetHeight;

            if (sectionBottom - IMAGE_TOP - imageHeight <= 0) {
                setAbsolute();
            } else {
                setFixed();
            }
        };

        setFixed();
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    //     fetchEmployeeList();
    // }, []);

    // // Fetch employee list
    // const fetchEmployeeList = async () => {
    //     try {
    //         setEmployeesLoading(true);
    //         const response = await Network.fetchEmployee(instId);
    //         if (response?.errorCode === 0 && response?.employees) {
    //             const filteredEmployees = response.employees.filter(
    //                 emp => emp.showInApp === true
    //             );
    //             setEmployees(filteredEmployees);
    //         } else {
    //             console.log('Failed to fetch employee list:', response?.message || 'Unknown error');
    //             setEmployees([]);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching employee list:', error);
    //         setEmployees([]);
    //     } finally {
    //         setEmployeesLoading(false);
    //     }
    // };

    // Handle faculty navigation
    // const handleFaculty = (employee) => {
    //     const fullName = [employee?.firstName, employee?.lastName].filter(Boolean).join(' ');
    //     router.push(`/faculty/${employee?.id || fullName.toLowerCase().replace(/\s+/g, '-')}`);
    //     setShowFacultyDropdown(false);
    // };

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
            description: facultyPayload?.description,
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
        return <Layout><div className="p-10 text-center">Faculty Not Found</div></Layout>;
    }

    return (
        <Layout>
            {banner && (
                <section className="relative w-full bg-gradient-to-br from-[#0749A2] via-[#0B3276] to-[#0749A2] overflow-hidden">
                    <div
                        onClick={handleBannerClick}
                        className={`w-full aspect-[3/1] md:aspect-[3/1] lg:aspect-[3.5/1.1] relative overflow-hidden shadow-2xl ${banner?.contentLink ? 'cursor-pointer' : ''}`}
                    >
                        {/* Mobile */}
                        <img
                            src={banner.mobileSrc}
                            alt={banner.alt}
                            className="md:hidden w-full h-full object-cover"
                        />

                        {/* Desktop */}
                        <img
                            src={banner.desktopSrc}
                            alt={banner.alt}
                            className="hidden md:block w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0" />
                    </div>
                </section>
            )}
            <div id="faculty-profile-container" data-page="faculty-profile" className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                <section id="faculty-hero-section" data-section="faculty-hero" className="bg-white pt-4 pb-16" style={{ backgroundColor: '#ffffff' }}>
                    <div className={LAYOUT_PADDING}>
                        <div className={`flex flex-col md:flex-row items-start gap-12 relative`}>
                            {/* Placeholder preserves flex layout while fixed image floats on top (desktop only) */}
                            {/* <div className="hidden md:block md:w-1/3" ref={placeholderRef}></div>
                            <div className="w-full md:w-auto sticky top-4 z-10 md:static" ref={imageRef}>
                                <div className="faculty-image">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square bg-slate-100 max-w-[300px] mx-auto md:max-w-none">
                                        <img
                                            src={facultyImage}
                                            alt={faculty?.name}
                                            className="w-full h-full object-contain object-center"
                                        />
                                    </div>
                                </div>
                            </div> */}

                            <div className="w-full md:overflow-y-auto">
                                <div className="space-y-6 bg-white rounded-xl shadow-lg pt-0 pb-[2rem] px=[2rem] border border-slate-100">
                                    {/* <div> */}
                                    {/* <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2> */}
                                    {/* {faculty?.description && (
                                            <div className="text-lg text-slate-700 leading-relaxed mb-4">
                                                {faculty.description}
                                            </div>
                                        )}
                                        {facultyPayload?.address && (
                                            <div className="prose prose-sm max-w-none">
                                                <div className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: facultyPayload.address }} />
                                            </div>
                                        )} */}
                                    {facultyPayload?.address ? (
                                        <div className="description text-lg text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: facultyPayload.address }} />
                                    ) : faculty?.description ? (
                                        <div className="description text-lg text-slate-700 leading-relaxed">
                                            {faculty.description}
                                        </div>
                                    ) : null}
                                    {/* </div> */}

                                    {/* {faculty?.journey && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Career Journey</h3>
                                            <p className="text-slate-600">{faculty.journey}</p>
                                        </div>
                                    )} */}

                                    {/* {faculty?.otherDes && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Additional Information</h3>
                                            <p className="text-slate-600">{faculty.otherDes}</p>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                {employeeCourseIds && employeeCourseIds.length > 0 && (
                    <>
                        <CoursesSection employeeCourseId={employeeCourseIds} />
                        <BookStore employeeCourseId={employeeCourseIds} />
                    </>
                )}

            </div>
            <Footer />
        </Layout>
    );
};

export default FacultyProfile;
