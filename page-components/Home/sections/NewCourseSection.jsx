import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '../../../config/AuthContext';
import { useTheme } from '../../../config/ThemeContext';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';
import CourseConfigModal from './CourseConfigModal';
import Endpoints from '../../../config/endpoints';

export const NewCoursesSection = ({ onAddToCart }) => {
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

    useEffect(() => {
        // fetchTags();
        // fetchDomains();

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

    // const fetchTags = async () => {
    //     try {
    //         const response = await Network.fetchTags(instId);
    //         const tagList = Array.isArray(response?.tags) ? response.tags : (Array.isArray(response) ? response : []);
    //         setTags(tagList);
    //     } catch (err) {
    //         console.error('Error fetching tags:', err);
    //         setTags([]);
    //     }
    // };

    // const fetchDomains = async () => {
    //     try {
    //         const response = await Network.fetchDomain(instId);
    //         const domainList = Array.isArray(response?.domains) ? response.domains : (Array.isArray(response) ? response : []);

    //         // Get only first-level children (children of parent domains where parentId === 0)
    //         const firstLevelChildren = [];
    //         domainList.forEach(domain => {
    //             if (domain.parentId === 0 && domain.child && Array.isArray(domain.child)) {
    //                 firstLevelChildren.push(...domain.child);
    //             }
    //         });

    //         setDomains(firstLevelChildren);
    //     } catch (err) {
    //         console.error('Error fetching domains:', err);
    //         setDomains([]);
    //     }
    // };

    useEffect(() => {

        fetchCourses();
    }, []);

   const fetchCourses = async () => {
    try {
        setLoading(true);

        const response = await Network.getFreeCourseList(instId);

        const courses = response?.courses || response || [];

        // Filter courses
        const activeCourses = Array.isArray(courses)
            ? courses.filter((item) =>
                item?.active === true &&
                item?.paid === true &&
                ["CA Foundation Test Series", "CA Inter Test Series", "CA Final Test Series"].includes(item?.title)
            )
            : [];

        setCoursesData(activeCourses);
        setError(null);

    } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setCoursesData([]);
    } finally {
        setLoading(false);
    }
};

    // const filtered = coursesData.filter(c => {
    //     // Filter by domain if selected
    //     const domainMatch = activeDomain === null || (c.domain && Array.isArray(c.domain) && c.domain.some(d => d.id === activeDomain));

    //     return domainMatch;
    // });


    // Reset currentIndex when filtering changes
    // useEffect(() => {
    //     setCurrentIndex(0);
    // }, [activeDomain]);

    // const handlePrev = () => {
    //     setCurrentIndex(prev => Math.max(0, prev - 1));
    // };

    // const handleNext = () => {
    //     setCurrentIndex(prev => Math.min(filtered.length - itemsPerView, prev + 1));
    // };

    // const canGoPrev = currentIndex > 0;
    // const canGoNext = currentIndex < filtered.length - itemsPerView;

    // const handleAddToCartFromModal = (cartItem) => {
    //     // Check if already in cart
    //     const existingCartIndex = cartCourses.findIndex(
    //         item => item.coursePricingId === cartItem.coursePricingId
    //     );

    //     let updatedCart;
    //     if (existingCartIndex !== -1) {
    //         // Update existing item
    //         updatedCart = [...cartCourses];
    //         updatedCart[existingCartIndex] = cartItem;
    //     } else {
    //         // Add new item
    //         updatedCart = [...cartCourses, cartItem];
    //     }

    //     setCartCourses(updatedCart);
    //     localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
    //     window.dispatchEvent(new Event('cartUpdated'));
    // };

    const handleExploreMoreClick = (type) => {
        sessionStorage.setItem('storeNavigationState', JSON.stringify({
            source: 'lecture',
            isMobile: false,
            productType: type
        }));
        router.push('/store');
    }

    const handleExploreMoreAboutCourse = (course) => {
        // Store course data in sessionStorage
        sessionStorage.setItem('selectedCourse', JSON.stringify(course));
        // Redirect to course-drips page
        router.push('/course-drips');
    };

    return (
        <section id="fr-courses" className="py-10 bg-slate-50 relative overflow-hidden">
            <div className={LAYOUT_PADDING}>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div>
                            <span className={`${theme.textClass} font-bold tracking-widest text-xs uppercase`}>Our Flagship</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Test-Series</h2>
                        </div>
                        {/* Mobile: Explore Store button next to title */}
                        <button
                            onClick={() => handleExploreMoreClick('lecture')}
                            className="md:hidden text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                            style={{ backgroundColor: theme.primary }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
                        >
                            Explore Store <Icons.ChevronRight size={16} />
                        </button>
                    </div>

                </div>

                {/* {loading && (
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
                )} */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {coursesData.map((course) => (
                        <div
                            key={course.id}
                            className="group bg-white rounded-2xl p-3 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col"
                        >
                            <div
                                className="rounded-xl relative overflow-hidden flex items-end p-3"
                                style={{
                                    aspectRatio: "16/9",
                                    backgroundColor: theme.primary
                                }}
                            ></div>

                            <div className="p-2 pt-3 flex-1 flex flex-col">
                                <h3
                                    className={`text-sm font-bold text-slate-900 leading-snug mb-3 hover:${theme.textClass}`}
                                >
                                    {course.title}
                                </h3>

                                <div className="mt-auto pt-3 border-t border-slate-50">
                                    <button
                                        onClick={() => handleExploreMoreAboutCourse(course)}
                                        className="w-full text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                                        style={{
                                            backgroundColor: theme?.primary || "#2196F3",
                                            color: "#fff"
                                        }}
                                    >
                                        Explore Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Config Modal */}
            {/* {showConfigModal && selectedCourse && (
                <CourseConfigModal
                    course={selectedCourse}
                    onClose={() => setShowConfigModal(false)}
                    onAddToCart={handleAddToCartFromModal}
                />
            )} */}
        </section>
    );
};

