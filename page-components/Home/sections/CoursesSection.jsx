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
                                    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                                    flexWrap: 'nowrap',
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
                                    const isInCart = cartCourses.some(item => item.id === course.id);

                                    return (
                                        <div
                                            key={i}
                                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col shadow-sm"
                                            style={{
                                                width: 'calc(25% - 1.125rem)',
                                                minWidth: 'calc(25% - 1.125rem)',
                                                maxWidth: 'calc(25% - 1.125rem)',
                                                height: '360px', // reduced height
                                                flex: '0 0 auto',
                                                margin: 0,
                                            }}
                                        >
                                            <div
                                                onClick={() => router.push(`/course/${course.id}`)}
                                                className="aspect-[3/2] bg-white relative overflow-hidden cursor-pointer flex items-center justify-center"
                                                style={{marginBottom: 0}}
                                            >
                                                {course.logo && (
                                                    <img
                                                        src={`${Endpoints?.mediaBaseUrl}${course.logo}`}
                                                        alt={course.title}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                            <div className="px-4 pt-3 pb-2 flex-grow flex flex-col justify-between">
                                                <h4 onClick={() => router.push(`/course/${course.id}`)} className="text-[#111827] font-black text-[13px] leading-tight group-hover:text-[#e11d48] transition-colors uppercase tracking-tighter cursor-pointer mb-1">
                                                    {course.title}
                                                </h4>
                                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center mt-auto">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            {hasDiscount ? (
                                                                <>
                                                                    <span className="text-[#e11d48] font-black text-base tracking-tighter">
                                                                        {discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString('en-IN')}`}
                                                                    </span>
                                                                    <span className="text-gray-300 text-[11px] line-through font-bold tracking-tighter">
                                                                        ₹{originalPrice.toLocaleString('en-IN')}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-[#e11d48] font-black text-base tracking-tighter">
                                                                    {originalPrice === 0 ? 'Free' : `₹${originalPrice.toLocaleString('en-IN')}`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();

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
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md"
                                                            style={{ backgroundColor: isInCart ? '#111827' : '#f8fafc', color: isInCart ? '#ffffff' : '#9ca3af', margin: 0 }}
                                                        >
                                                            {isInCart ? <Icons.X /> : <Icons.Cart />}
                                                        </button>
                                                        {isInCart && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push('/cart');
                                                                }}
                                                                className="h-8 px-2 text-white rounded-lg flex items-center justify-center gap-1 hover:scale-105 transition-all shadow-md text-xs font-semibold bg-[#111827]"
                                                                style={{margin: 0}}
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
                                className={`${theme.primaryClass} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoPrev ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'}`}
                            >
                                <Icons.ChevronLeft />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className={`${theme.primaryClass} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoNext ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'}`}
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

