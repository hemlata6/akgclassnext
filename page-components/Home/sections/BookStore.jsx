import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_CLASS, TEXT_GREEN } from '../../../constants/Icons';
import { useAuth } from '../../../config/AuthContext';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';
import CourseConfigModal from './CourseConfigModal';

export const BookStore = ({ employeeCourseId }) => {
    const router = useRouter();
    const { authToken } = useAuth();
    const [active, setActive] = useState(null);
    const [activeDomain, setActiveDomain] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [tags, setTags] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(8);
    const [cartCourses, setCartCourses] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
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
                setItemsPerView(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth < 1536) {
                setItemsPerView(4);
            } else {
                setItemsPerView(5);
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
    }, [tags]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = authToken ? await Network.getStudentAuthCourse(authToken) : await Network.getFreeCourseList(instId);
            const courses = response?.courses || response || [];

            // Filter courses that have "Book" domain, are active, AND have "Featured Course" tag
            const bookCourses = Array.isArray(courses)
                ? courses.filter(c =>
                    c.active
                    && c.type === "books"
                )
                : [];

            setCoursesData(bookCourses);
            setError(null);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load books');
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
        // Preserve the actual book type from the source object
        const itemWithType = { ...cartItem, type: selectedBook?.type || cartItem.type };

        // Check if already in cart
        const existingCartIndex = cartCourses.findIndex(
            item => item.coursePricingId === itemWithType.coursePricingId
        );

        let updatedCart;
        if (existingCartIndex !== -1) {
            // Update existing item
            updatedCart = [...cartCourses];
            updatedCart[existingCartIndex] = itemWithType;
        } else {
            // Add new item
            updatedCart = [...cartCourses, itemWithType];
        }

        setCartCourses(updatedCart);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleExploreMoreClick = (type) => {
        sessionStorage.setItem('storeNavigationState', JSON.stringify({
            source: 'books',
            isMobile: false,
            productType: type
        }));
        router.push('/store');
    }

    return (
        <section id="books" className="py-12 bg-white">
            <div className={LAYOUT_PADDING}>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div>
                            {/* <span className={`${TEXT_GREEN} font-bold tracking-widest text-xs uppercase`}>Book Store</span> */}
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured books
                            </h2>
                        </div>
                        {/* Mobile: Explore Store button next to title */}
                        {!hasEmployeeCourseSelection && (
                            <button
                                onClick={() => handleExploreMoreClick('books')}
                                className={`md:hidden ${BRAND_GREEN_CLASS} hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 flex-shrink-0`}
                            >
                                Explore Store <Icons.ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex justify-start md:justify-end">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Desktop: Explore Store button with filters */}
                            {!hasEmployeeCourseSelection && (
                                <button
                                    onClick={() => handleExploreMoreClick('books')}
                                    className={`hidden md:flex ${BRAND_GREEN_CLASS} hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all items-center gap-2`}
                                >
                                    Explore Store <Icons.ChevronRight size={16} />
                                </button>
                            )}
                            {/* Domain Filter */}
                            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setActiveDomain(null)}
                                    className={`ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeDomain === null ? `${BRAND_GREEN_CLASS} text-white shadow-md` : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    All
                                </button>
                                {domains.map(domain => (
                                    <button
                                        key={domain.id}
                                        onClick={() => setActiveDomain(domain.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeDomain === domain.id ? `${BRAND_GREEN_CLASS} text-white shadow-md` : 'text-slate-500 hover:text-slate-800'}`}
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
                        <p className="text-slate-500">Loading books...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && coursesData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No books available at the moment.</p>
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
                                {filtered.map((book, i) => {
                                    // Get lowest price with discount from coursePricing array
                                    const pricing = book.coursePricing && Array.isArray(book.coursePricing) && book.coursePricing.length > 0
                                        ? book.coursePricing.reduce((lowest, current) => {
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
                                            className="group flex-shrink-0"
                                            style={{
                                                width: `calc((100% - ${(itemsPerView - 1) * 1.5}rem) / ${itemsPerView})`
                                            }}
                                        >
                                            <div
                                                onClick={() => router.push(`/book/${book.id}`)}
                                                className="relative bg-slate-50 rounded-lg shadow-md mb-2 overflow-hidden border-l-4 border-emerald-900 transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer"
                                                style={{
                                                    aspectRatio: '16/9'
                                                }}
                                            >
                                                {book.logo ? (
                                                    <img
                                                        src={`${Endpoints?.mediaBaseUrl}${book.logo}`}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-white p-2 text-center border border-slate-100" style={{ display: book.logo ? 'none' : 'flex' }}>
                                                    <div className="h-8 w-8 md:h-10 md:w-10 bg-emerald-50 rounded-full flex items-center justify-center text-sm md:text-lg mb-1 md:mb-2">
                                                        📚
                                                    </div>
                                                    <span className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight px-1 line-clamp-3">
                                                        {book.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {hasDiscount ? (
                                                        <>
                                                            <span className="text-[10px] text-slate-400 line-through">
                                                                ₹{originalPrice.toLocaleString('en-IN')}
                                                            </span>
                                                            <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                                                                {pricing.discount}% OFF
                                                            </span>
                                                            <span className="font-bold text-slate-900 text-sm">
                                                                {discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString('en-IN')}`}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-slate-900 text-sm">
                                                            {originalPrice === 0 ? 'Free' : `₹${originalPrice.toLocaleString('en-IN')}`}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            const isInCart = cartCourses.some(item => item.id === book.id);

                                                            if (isInCart) {
                                                                // Remove from cart
                                                                const updatedCart = cartCourses.filter(item => item.id !== book.id);
                                                                setCartCourses(updatedCart);
                                                                localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                                                                window.dispatchEvent(new Event('cartUpdated'));
                                                            } else {
                                                                // Add to cart via modal
                                                                setSelectedBook(book);
                                                                setShowConfigModal(true);
                                                            }
                                                        }}
                                                        className="text-white h-8 w-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                                                        style={{
                                                            backgroundColor: cartCourses.some(item => item.id === book.id) ? '#dc2626' : '#2196F3',
                                                            transform: cartCourses.some(item => item.id === book.id) ? 'scale(1.1)' : 'scale(1)',
                                                            boxShadow: cartCourses.some(item => item.id === book.id) ? '0 10px 15px -3px rgba(220, 38, 38, 0.35)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                        }}
                                                    >
                                                        {cartCourses.some(item => item.id === book.id) ? <Icons.X /> : <Icons.Cart />}
                                                    </button>
                                                    {cartCourses.some(item => item.id === book.id) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push('/cart');
                                                            }}
                                                            className="h-8 px-3 text-white rounded-full flex items-center justify-center gap-1.5 hover:scale-105 transition-all shadow-md text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: '#2196F3',
                                                            }}
                                                        >
                                                            View Cart
                                                        </button>
                                                    )}
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
                                className={`${BRAND_GREEN_CLASS} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoPrev ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'
                                    }`}
                            >
                                <Icons.ChevronLeft />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className={`${BRAND_GREEN_CLASS} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${canGoNext ? 'hover:scale-110 opacity-100' : 'opacity-30 cursor-not-allowed'
                                    }`}
                            >
                                <Icons.ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Book Config Modal */}
            {showConfigModal && selectedBook && (
                <CourseConfigModal
                    course={selectedBook}
                    onClose={() => setShowConfigModal(false)}
                    onAddToCart={handleAddToCartFromModal}
                />
            )}
        </section>
    );
};

