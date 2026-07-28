import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '../../../config/AuthContext';
import { useTheme } from '../../../config/ThemeContext';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';
import CourseConfigModal from './CourseConfigModal';
import Endpoints from '../../../config/endpoints';

// Target Layout Specific Icon Proxies
const Clock = ({ className }) => <Icons.Clock className={className} />;
const PlayCircle = ({ className }) => <Icons.Play className={className} />;

const stripHtmlTags = (htmlString) => {
    if (!htmlString) return '';
    return htmlString
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')  // Remove entire style blocks
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove entire script blocks
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

export const CoursesSection = ({ employeeCourseId }) => {
    const router = useRouter();
    const { authToken } = useAuth();
    const { theme } = useTheme();
    const [activeDomain, setActiveDomain] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [carouselGap, setCarouselGap] = useState(20); // 20px = gap-5 desktop, 16px = gap-4 mobile
    const [cartCourses, setCartCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showConfigModal, setShowConfigModal] = useState(false);

    const hasEmployeeCourseSelection = (() => {
        if (!employeeCourseId) return false;
        if (Array.isArray(employeeCourseId)) return employeeCourseId.length > 0;
        if (Array.isArray(employeeCourseId?.courseIds)) return employeeCourseId.courseIds.length > 0;
        if (typeof employeeCourseId === 'string') return employeeCourseId.trim().length > 0;
        return false;
    })();

    useEffect(() => {
        fetchDomains();

        // Dynamic viewport breakpoint monitor
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1); // 1 Card on Mobile
                setCarouselGap(16); // gap-4 on mobile
            } else if (window.innerWidth < 768) {
                setItemsPerView(2); // 2 Cards on Sm-Tablets
                setCarouselGap(20); // gap-5 on tablet
            } else if (window.innerWidth < 1024) {
                setItemsPerView(3); // 3 Cards on Mid-screens
                setCarouselGap(20);
            } else {
                setItemsPerView(4); // 4 Cards on Desktop
                setCarouselGap(20);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load cart from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cartCourses');
            if (savedCart) {
                setCartCourses(JSON.parse(savedCart));
            }

            const handleCartUpdate = () => {
                const updatedCart = localStorage.getItem('cartCourses');
                if (updatedCart) {
                    setCartCourses(JSON.parse(updatedCart));
                }
            };

            window.addEventListener('cartUpdated', handleCartUpdate);
            return () => window.removeEventListener('cartUpdated', handleCartUpdate);
        }
    }, []);

    const fetchDomains = async () => {
        try {
            const response = await Network.fetchDomain(instId);
            const domainList = Array.isArray(response?.domains) ? response.domains : (Array.isArray(response) ? response : []);
            setDomains(domainList);
        } catch (err) {
            console.error('Error fetching domains:', err);
            setDomains([]);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [employeeCourseId]);

    const fetchCourses = async () => {
        try {
            setLoading(true);

            const response = authToken
                ? await Network.getStudentAuthCourse(authToken)
                : await Network.getFreeCourseList(instId);

            const courses = response?.courses || response || [];

            const normalizeEmployeeCourseIds = (value) => {
                if (!value) return [];
                if (Array.isArray(value)) {
                    return value
                        .map((item) => {
                            if (item == null) return null;
                            if (typeof item === 'number' || typeof item === 'string') return Number(item);
                            if (typeof item === 'object') return Number(item.id ?? item.courseId ?? item._id ?? null);
                            return null;
                        })
                        .filter((id) => Number.isFinite(id));
                }
                if (Array.isArray(value?.courseIds)) return normalizeEmployeeCourseIds(value.courseIds);
                if (typeof value === 'string') {
                    return value.split(',').map((v) => Number(v.trim())).filter((id) => Number.isFinite(id));
                }
                return [];
            };

            const employeeCourseIds = normalizeEmployeeCourseIds(employeeCourseId);
            const hasEmployeeCourseFilter = employeeCourseIds.length > 0;
            const employeeCourseIdSet = new Set(employeeCourseIds);

            const filteredCourses = Array.isArray(courses)
                ? courses.filter(c => c.active && c.paid === true && c.type === 'lecture')
                : [];

            const finalCourses = hasEmployeeCourseFilter
                ? filteredCourses.filter((course) => {
                    const idCandidates = [
                        Number(course?.id),
                        Number(course?.courseId),
                        Number(course?._id),
                    ].filter((id) => Number.isFinite(id));
                    return idCandidates.some((id) => employeeCourseIdSet.has(id));
                })
                : filteredCourses;

            setCoursesData(finalCourses);
            setError(null);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses');
            setCoursesData([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = coursesData.filter(c => {
        return activeDomain === null || (c.domain && Array.isArray(c.domain) && c.domain.some(d => d.id === activeDomain));
    });

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeDomain]);

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(filtered.length - itemsPerView, prev + 1));
    };

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < filtered.length - itemsPerView;

    const handleAddToCartFromModal = (cartItem) => {
        const existingCartIndex = cartCourses.findIndex(item => item.coursePricingId === cartItem.coursePricingId);
        let updatedCart;
        if (existingCartIndex !== -1) {
            updatedCart = [...cartCourses];
            updatedCart[existingCartIndex] = cartItem;
        } else {
            updatedCart = [...cartCourses, cartItem];
        }
        setCartCourses(updatedCart);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleExploreMoreClick = (type) => {
        sessionStorage.setItem('storeNavigationState', JSON.stringify({
            source: 'lecture',
            isMobile: false,
            productType: type
        }));
        router.push('/store');
    };

    return (
        <section id="fr-courses" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-12 relative overflow-hidden">
            {/* SECTION CONTROL ROW HEADER */}
            <div className="mb-8 border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 md:justify-start">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Premium Video Coaching</h3>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Our Trending Courses</h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-fit border border-slate-200 overflow-x-auto max-w-full">
                        <button
                            onClick={() => setActiveDomain(null)}
                            className={`text-xs font-semibold px-7 py-2 rounded-lg transition-all whitespace-nowrap ${activeDomain === null ? 'bg-[#0a459a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            All Batches
                        </button>
                        {domains.flatMap(d => d.child || []).map(child => (
                            <button
                                key={child.id}
                                onClick={() => setActiveDomain(child.id)}
                                className={`text-xs font-semibold px-7 py-2 rounded-lg transition-all whitespace-nowrap ${activeDomain === child.id ? 'bg-[#0a459a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>

                    {!hasEmployeeCourseSelection && (
                        <button
                            onClick={() => handleExploreMoreClick('lecture')}
                            className="hidden md:flex items-center gap-1.5 bg-[#0a459a] hover:bg-[#073373] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            Explore Store <Icons.ChevronRight size={14} />
                        </button>
                    )}
                </div>

            </div>
            

            {/* STATUS NOTIFICATION BLOCKS */}
            {loading && (
                <div className="flex justify-center py-12">
                    <p className="text-slate-500 font-semibold text-sm">Loading course catalog...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700 font-semibold text-xs">
                    {error}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 font-semibold text-sm">No course matches active under this selection tier currently.</p>
                </div>
            )}

            {/* SLIDING CAROUSEL MAIN VIEWPORT CONTAINER */}
            {!loading && filtered.length > 0 && (
                <div className="relative group/carousel">
                    <div className="overflow-hidden px-1 py-4 -mx-1">
                        <div
                            className="flex gap-4 sm:gap-5 transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(calc(-${currentIndex} * (${100 / itemsPerView}% + ${carouselGap / itemsPerView}px)))`
                            }}
                        >
                            {filtered.map((course, i) => {
                                const pricing = course.coursePricing && Array.isArray(course.coursePricing) && course.coursePricing.length > 0
                                    ? course.coursePricing.reduce((lowest, current) => {
                                        const currentDiscounted = current.price - (current.price * current.discount / 100);
                                        const lowestDiscounted = lowest.price - (lowest.price * lowest.discount / 100);
                                        return currentDiscounted < lowestDiscounted ? current : lowest;
                                    })
                                    : null;

                                const originalPrice = pricing ? pricing.price : 0;
                                const discountedPrice = pricing ? originalPrice - (originalPrice * pricing.discount / 100) : 0;
                                const hasDiscount = pricing && pricing.discount > 0;

                                // Clean description typography natively via sanitization script layers
                                const cleanDescription = stripHtmlTags(course.shortDescription);

                                return (
                                    <div
                                        key={i}
                                        onClick={() => router.push(`/course/${course.id}`)}
                                        className="bg-white border border-slate-200/70 rounded-2xl p-4 hover:border-[#0a459a] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(10,69,154,0.06)] hover:-translate-y-1 group flex-shrink-0"
                                        style={{
                                            width: `calc((100% - ${(itemsPerView - 1) * carouselGap}px) / ${itemsPerView})`,
                                            minWidth: `calc((100% - ${(itemsPerView - 1) * carouselGap}px) / ${itemsPerView})`
                                        }}
                                    >
                                        <div>
                                            {/* BADGES METADATA ROW */}
                                            <div className="flex justify-between items-center gap-2 mb-3.5">
                                                <span className="flex flex-wrap items-center gap-1.5">
                                                    {course.tags?.length > 0
                                                        ? course.tags.map((t, ti) => (
                                                            <span key={ti} className="text-[9px] font-semibold text-[#0a459a] bg-blue-50 px-2 py-1 rounded border border-blue-100/60 tracking-wide">
                                                                {t.tag}
                                                            </span>
                                                        ))
                                                        : ""
                                                    }
                                                </span>
                                                {course?.setting?.hourBased && Number.isFinite(course?.setting?.duration) && course.setting.duration > 3600 && (
                                                    <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                        {`${Math.round(course.setting.duration / 3600)} Hours`}
                                                    </span>
                                                )}
                                            </div>

                                            {/* FACULTY AND MODULE POSTER CONTROLLER */}
                                            <div className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-xl mb-3.5 relative overflow-hidden flex items-center justify-center p-3 shadow-inner group-hover:bg-slate-100/40 transition-colors">
                                                {course.logo ? (
                                                    <img
                                                        src={`${Endpoints?.mediaBaseUrl}${course.logo}`}
                                                        alt={course.title}
                                                        className="absolute inset-0 w-full h-full object-top object-cover group-hover:scale-102 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-[#0a459a]/10 border border-[#0a459a]/20 flex items-center justify-center font-semibold text-[10px] text-[#0a459a]">
                                                        RJCE
                                                    </div>
                                                )}
                                            </div>

                                            {/* COURSE TITLE & DESCRIPTION */}
                                            <h4 className="font-semibold text-slate-900 text-sm mb-1.5 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#0a459a] transition-colors">
                                                {course.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-3 line-clamp-2">
                                                {cleanDescription || "Access deep-dive modules and live streams explicitly aligned with master class blueprints."}
                                            </p>
                                        </div>

                                        {/* CARD ENROLL BOTTOM FOOTER ACTIONS */}
                                        <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5">
                                                    {hasDiscount && (
                                                        <>
                                                            <span className="text-[10px] text-slate-400 line-through font-semibold leading-none">
                                                                ₹{originalPrice.toLocaleString('en-IN')}
                                                            </span>
                                                            <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-1 py-0.2 rounded">
                                                                {pricing.discount}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900 mt-1 leading-none">
                                                    {pricing ? (discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString('en-IN')}`) : 'Free'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    if (!course.coursePricing || course.coursePricing.length === 0) return;
                                                    e.stopPropagation();
                                                    setSelectedCourse(course);
                                                    setShowConfigModal(true);
                                                }}
                                                className="bg-[#0a459a] text-white font-semibold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow hover:bg-blue-800 transition-all flex items-center gap-1 active:scale-95 hover:shadow-md"
                                            >
                                                Enroll <PlayCircle className="w-3.5 h-3.5 ml-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SLIDER VIEWPORT PAGINATION NACHORS CONTROLS */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={handlePrev}
                            disabled={!canGoPrev}
                            className={`bg-[#0a459a] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoPrev ? 'hover:scale-110 opacity-100 active:scale-95' : 'opacity-20 cursor-not-allowed'
                                }`}
                        >
                            <Icons.ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!canGoNext}
                            className={`bg-[#0a459a] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoNext ? 'hover:scale-110 opacity-100 active:scale-95' : 'opacity-20 cursor-not-allowed'
                                }`}
                        >
                            <Icons.ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Explore Store — aligned to end */}
            {!hasEmployeeCourseSelection && (
                <div className="md:hidden flex justify-center w-full mt-5 mb-2">
                    <button
                        onClick={() => handleExploreMoreClick('lecture')}
                        className="flex items-center gap-2 bg-[#0a459a] hover:bg-[#073373] text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Explore Store <Icons.ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* DYNAMIC CONFIG MODAL HOOK ANCHORS */}
            {showConfigModal && selectedCourse && (
                <CourseConfigModal
                    course={selectedCourse}
                    onClose={() => setShowConfigModal(false)}
                    onAddToCart={handleAddToCartFromModal}
                />
            )}
        </section>
    );
};
