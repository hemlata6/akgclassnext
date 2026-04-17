import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '../../../config/AuthContext';
import { useTheme } from '../../../config/ThemeContext';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';
import CourseConfigModal from './CourseConfigModal';
import Endpoints from '../../../config/endpoints';

export const CoursesSection = ({ employeeCourseId }) => {
    const router = useRouter();
    const { authToken } = useAuth();
    const { theme } = useTheme();
    const [active, setActive] = useState(null);
    const [activeDomain, setActiveDomain] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [tags, setTags] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
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
        fetchTags();
        fetchDomains();

        // Handle responsive items per view
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(4);
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

    const fetchTags = async () => {
        try {
            const response = await Network.fetchTags(instId);
            const tagList = Array.isArray(response?.tags) ? response.tags : (Array.isArray(response) ? response : []);
            setTags(tagList);
        } catch (err) {
            console.error('Error fetching tags:', err);
            setTags([]);
        }
    };

    const fetchDomains = async () => {
        try {
            const response = await Network.fetchDomain(instId);
            const domainList = Array.isArray(response?.domains) ? response.domains : (Array.isArray(response) ? response : []);

            // Get only first-level children (children of parent domains where parentId === 0)
            const firstLevelChildren = [];
            domainList.forEach(domain => {
                if (domain.parentId === 0 && domain.child && Array.isArray(domain.child)) {
                    firstLevelChildren.push(...domain.child);
                }
            });

            setDomains(firstLevelChildren);
        } catch (err) {
            console.error('Error fetching domains:', err);
            setDomains([]);
        }
    };

    useEffect(() => {

        fetchCourses();
    }, [tags, employeeCourseId]);

    const fetchCourses = async () => {
        try {
            setLoading(true);

            const response = authToken
                ? await Network.getStudentAuthCourse(authToken)
                : await Network.getFreeCourseList(instId);

            const courses = response?.courses || response || [];

            // Normalize employee course IDs from multiple possible payload shapes
            const normalizeEmployeeCourseIds = (value) => {
                if (!value) return [];

                if (Array.isArray(value)) {
                    return value
                        .map((item) => {
                            if (item == null) return null;
                            if (typeof item === 'number' || typeof item === 'string') return Number(item);

                            if (typeof item === 'object') {
                                return Number(item.id ?? item.courseId ?? item._id ?? null);
                            }

                            return null;
                        })
                        .filter((id) => Number.isFinite(id));
                }

                if (Array.isArray(value?.courseIds)) {
                    return normalizeEmployeeCourseIds(value.courseIds);
                }

                if (typeof value === 'string') {
                    return value
                        .split(',')
                        .map((v) => Number(v.trim()))
                        .filter((id) => Number.isFinite(id));
                }

                return [];
            };

            const employeeCourseIds = normalizeEmployeeCourseIds(employeeCourseId);
            const hasEmployeeCourseFilter = employeeCourseIds.length > 0;
            const employeeCourseIdSet = new Set(employeeCourseIds);

            // Base filter (your conditions)
            const filteredCourses = Array.isArray(courses)
                ? courses.filter(c =>
                    c.active &&
                    c.paid === true &&
                    c.type === 'lecture'
                )
                : [];

            // Apply employee course filter only if IDs exist
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
        // Filter by domain if selected
        const domainMatch = activeDomain === null || (c.domain && Array.isArray(c.domain) && c.domain.some(d => d.id === activeDomain));

        return domainMatch;
    });

    // console.log('filtered', filtered, activeDomain);


    // Reset currentIndex when filtering changes
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
        // Check if already in cart
        const existingCartIndex = cartCourses.findIndex(
            item => item.coursePricingId === cartItem.coursePricingId
        );

        let updatedCart;
        if (existingCartIndex !== -1) {
            // Update existing item
            updatedCart = [...cartCourses];
            updatedCart[existingCartIndex] = cartItem;
        } else {
            // Add new item
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
    }

    return (
        <section id="fr-courses" className="py-12 bg-slate-50 relative overflow-hidden">
            <div className={LAYOUT_PADDING}>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div>
                            <span className={`${theme.textClass} font-bold tracking-widest text-xs uppercase`}>Our Flagship</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Courses</h2>
                        </div>
                        {/* Mobile: Explore Store button next to title */}
                        {
                            !hasEmployeeCourseSelection && (
                                <button
                                    onClick={() => handleExploreMoreClick('lecture')}
                                    className={`md:hidden ${theme.primaryClass} ${theme.primaryHoverClass} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 flex-shrink-0`}
                                >
                                    Explore Store <Icons.ChevronRight size={16} />
                                </button>
                            )
                        }
                    </div>
                    <div className="flex justify-start md:justify-end">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Desktop: Explore Store button with filters */}
                            {
                                !hasEmployeeCourseSelection && (
                                    <button
                                        onClick={() => handleExploreMoreClick('lecture')}
                                        className={`hidden md:flex ${theme.primaryClass} ${theme.primaryHoverClass} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all items-center gap-2`}
                                    >
                                        Explore Store <Icons.ChevronRight size={16} />
                                    </button>
                                )
                            }
                            {/* Domain Filter */}
                            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setActiveDomain(null)}
                                    className={`ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeDomain === null ? `${theme.primaryClass} text-white shadow-md` : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    All
                                </button>
                                {domains.map(domain => (
                                    <button
                                        key={domain.id}
                                        onClick={() => setActiveDomain(domain.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeDomain === domain.id ? `${theme.primaryClass} text-white shadow-md` : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        {domain.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <p className="text-slate-500">Loading courses...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && coursesData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No courses available at the moment.</p>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div>
                        {/* Carousel Container */}
                        <div className="overflow-hidden">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(calc(-${currentIndex} * (${100 / itemsPerView}% + ${1.5 / itemsPerView}rem)))`
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

                                    return (
                                        <div
                                            key={i}
                                            className="group bg-white rounded-2xl p-3 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col"
                                            style={{
                                                minWidth: `calc((100% - ${(itemsPerView - 1) * 1.5}rem) / ${itemsPerView})`
                                            }}
                                        >
                                            <div
                                                onClick={() => router.push(`/course/${course.id}`)}
                                                className={`rounded-xl ${theme.primaryClass} relative overflow-hidden flex items-end p-3 cursor-pointer`}
                                                style={{ aspectRatio: '16/9' }}
                                            >
                                                {course.logo && (
                                                    <img
                                                        src={`${Endpoints?.mediaBaseUrl}${course.logo}`}
                                                        alt={course.title}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
                                                <div className="relative z-10 w-full">
                                                    <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/20 inline-block mb-1">
                                                        {course.badge || "New"}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold">
                                                        <Icons.Clock /> {course.hours}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 pt-3 flex-1 flex flex-col">
                                                <h3 onClick={() => router.push(`/course/${course.id}`)} className={`text-sm font-bold text-slate-900 leading-snug mb-1 cursor-pointer hover:${theme.textClass}`}>
                                                    {course.title}
                                                </h3>
                                                {/* <p className="text-[10px] text-slate-500 font-medium mb-3">GD / PD / App</p> */}
                                                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] text-slate-500 font-medium">Starting Price</span>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {hasDiscount ? (
                                                                <>
                                                                    <span className="text-[11px] text-slate-400 line-through">
                                                                        ₹{originalPrice.toLocaleString('en-IN')}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                                        {pricing.discount}% OFF
                                                                    </span>
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        {discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString('en-IN')}`}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-lg font-bold text-slate-900">
                                                                    {originalPrice === 0 ? 'Free' : `₹${originalPrice.toLocaleString('en-IN')}`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                const isInCart = cartCourses.some(item => item.id === course.id);

                                                                if (isInCart) {
                                                                    // Remove from cart
                                                                    const updatedCart = cartCourses.filter(item => item.id !== course.id);
                                                                    setCartCourses(updatedCart);
                                                                    localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                                                                    window.dispatchEvent(new Event('cartUpdated'));
                                                                } else {
                                                                    // Add to cart via modal
                                                                    if (!course.coursePricing || course.coursePricing.length === 0) {
                                                                        return;
                                                                    }
                                                                    setSelectedCourse(course);
                                                                    setShowConfigModal(true);
                                                                }
                                                            }}
                                                            className="text-white h-8 w-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                                                            style={{
                                                                backgroundColor: cartCourses.some(item => item.id === course.id) ? '#dc2626' : (theme?.primary || '#2196F3'),
                                                                transform: cartCourses.some(item => item.id === course.id) ? 'scale(1.1)' : 'scale(1)',
                                                                boxShadow: cartCourses.some(item => item.id === course.id) ? '0 10px 15px -3px rgba(220, 38, 38, 0.35)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        >
                                                            {cartCourses.some(item => item.id === course.id) ? <Icons.X /> : <Icons.Cart />}
                                                        </button>
                                                        {cartCourses.some(item => item.id === course.id) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push('/cart');
                                                                }}
                                                                className="h-8 px-3 text-white rounded-full flex items-center justify-center gap-1.5 hover:scale-105 transition-all shadow-md text-xs font-semibold"
                                                                style={{
                                                                    backgroundColor: theme?.primary || '#2196F3',
                                                                }}
                                                            >
                                                                View Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button
                                onClick={handlePrev}
                                disabled={!canGoPrev}
                                className={`${theme.primaryClass} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoPrev ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'
                                    }`}
                            >
                                <Icons.ChevronLeft />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className={`${theme.primaryClass} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoNext ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'
                                    }`}
                            >
                                <Icons.ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Config Modal */}
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

