import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS } from '../../../constants/Icons';
import { useAuth } from '../../../config/AuthContext';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';
import CourseConfigModal from './CourseConfigModal';
import { useTheme } from '@mui/material';
import {
    ChevronDown,
    Smartphone,
    ArrowRight,
    ShoppingBag,
    User,
    ChevronLeft,
    ChevronRight,
    Clock,
    ArrowUpRight,
    BookOpen,
    Layers,
    Video,
    FileText,
    HelpCircle,
    Volume2,
    Lightbulb,
    Tv,
    PlayCircle,
    Monitor,
    Laptop,
    Download,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    ShieldCheck,
    Calendar
} from 'lucide-react';

// Target Layout Specific Icon Proxies
// const BookOpen = ({ className }) => <Icons.Book className={className} />;
// const ArrowUpRight = ({ className }) => <Icons.ChevronRight className={className} />;

// Cleanly parse HTML strings into safe text and clear any implicit whitespace entity codes
const stripHtmlTags = (htmlString) => {
    if (!htmlString) return '';
    return htmlString
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')  // Remove entire style blocks
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove entire script blocks
        .replace(/<[^>]*>/g, '')                      // Strip literal HTML tags
        .replace(/&nbsp;/gi, ' ')                    // Convert html non-breaking space entities
        .replace(/\u00a0/g, ' ')                      // Convert explicit unicode spaces
        .replace(/\s+/g, ' ')                        // Collapse multiple sequential whitespace fragments
        .trim();                                      // Clean dangling boundaries
};

export const BookStore = ({ employeeCourseId }) => {
    const router = useRouter();
    const theme = useTheme();
    const { authToken } = useAuth();
    const [activeDomain, setActiveDomain] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCourses, setCartCourses] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showConfigModal, setShowConfigModal] = useState(false);

    // CAROUSEL DISPLAY CONTROLLER STATES
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [carouselGap, setCarouselGap] = useState(24); // 24px = gap-6 desktop, 16px = gap-4 mobile

    const hasEmployeeCourseSelection = (() => {
        if (!employeeCourseId) return false;
        if (Array.isArray(employeeCourseId)) return employeeCourseId.length > 0;
        if (Array.isArray(employeeCourseId?.courseIds)) return employeeCourseId.courseIds.length > 0;
        if (typeof employeeCourseId === 'string') return employeeCourseId.trim().length > 0;
        return false;
    })();

    useEffect(() => {
        fetchDomains();

        // Responsive Breakpoint Monitor Matrix
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1); // 1 Card on Mobile
                setCarouselGap(16); // gap-4 on mobile
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2); // 2 Cards on Tablets
                setCarouselGap(24); // gap-6 on tablet/desktop
            } else if (window.innerWidth < 1280) {
                setItemsPerView(3); // 3 Cards on Mid-screens
                setCarouselGap(24);
            } else {
                setItemsPerView(4); // 4 Cards on Large Desktop
                setCarouselGap(24);
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
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = authToken ? await Network.getStudentAuthCourse(authToken) : await Network.getFreeCourseList(instId);
            const courses = response?.courses || response || [];

            const bookCourses = Array.isArray(courses)
                ? courses.filter(c => c.active && c.type === "books")
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

    // CORRECTED DOMAIN EXAM TIERS FILTRATION MATCH ENGINE
    const filtered = coursesData.filter(c => {
        if (activeDomain === null) return true;

        // Match string names or standard tracking IDs seamlessly across standard dynamic endpoints arrays
        return c.examStageId === activeDomain ||
            c.domainId === activeDomain ||
            (Array.isArray(c.domain) && c.domain.some(d => d.id === activeDomain || d.name === activeDomain)) ||
            (c.examStage && (c.examStage.id === activeDomain || c.examStage.name === activeDomain));
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

    const handleExploreAllClick = () => {
        sessionStorage.setItem('storeNavigationState', JSON.stringify({
            source: 'books',
            isMobile: false,
            productType: 'books'
        }));
        router.push('/store');
    };

    const handleAddToCartFromModal = (cartItem) => {
        const itemWithType = { ...cartItem, type: selectedBook?.type || cartItem.type };
        const existingCartIndex = cartCourses.findIndex(item => item.coursePricingId === itemWithType.coursePricingId);

        let updatedCart;
        if (existingCartIndex !== -1) {
            updatedCart = [...cartCourses];
            updatedCart[existingCartIndex] = itemWithType;
        } else {
            updatedCart = [...cartCourses, itemWithType];
        }

        setCartCourses(updatedCart);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <section id="books-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-12">
            {/* SECTION CONTROL ROW HEADER */}
            <div className="mb-8 border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 md:justify-start">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Exclusive Educational Resources</h3>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">RJCE Master Book Repository</h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-fit border border-slate-200 overflow-x-auto max-w-full">
                        <button
                            onClick={() => setActiveDomain(null)}
                            className={`text-xs font-semibold px-7 py-2 rounded-lg transition-all whitespace-nowrap ${activeDomain === null ? 'bg-[#0a459a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            All Books
                        </button>
                        {domains.flatMap(d => d.child || []).map(child => (
                            <button
                                key={child.id}
                                onClick={() => setActiveDomain(child.id)} // Dynamic mapping against nested children IDs
                                className={`text-xs font-semibold px-7 py-2 rounded-lg transition-all whitespace-nowrap ${activeDomain === child.id ? 'bg-[#0a459a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>

                    {/* Desktop View Unified Redirect Hook Action Anchor */}
                    {!hasEmployeeCourseSelection && (
                        <button
                            onClick={handleExploreAllClick}
                            className="hidden md:flex items-center gap-1.5 bg-[#0a459a] hover:bg-[#073373] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            Explore Store <Icons.ChevronRight size={14} />
                        </button>
                    )}
                </div>

            </div>


            {/* STATUS INTERFACES PADS */}
            {loading && (
                <div className="flex justify-center py-12">
                    <p className="text-slate-500 font-semibold text-sm">Loading book repository...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700 font-semibold text-xs">
                    {error}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 font-semibold text-sm">No books active under this selection tier currently.</p>
                </div>
            )}

            {/* SLIDING CAROUSEL LIST MODULE CATALOG */}
            {!loading && filtered.length > 0 && (
                <div className="relative group/carousel">
                    <div className="overflow-hidden px-1 py-4 -mx-1">
                        <div
                            className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(calc(-${currentIndex} * (${100 / itemsPerView}% + ${carouselGap / itemsPerView}px)))`
                            }}
                        >
                            {filtered.map((book, idx) => {
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

                                // Clean description typography natively via sanitization script layers
                                const cleanDescription = stripHtmlTags(book.shortDescription);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => router.push(`/book/${book.id}`)}
                                        className="bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 hover:border-[#0a459a] transition-all duration-300 flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(10,69,154,0.06)] flex-shrink-0 group cursor-pointer"
                                        style={{
                                            width: `calc((100% - ${(itemsPerView - 1) * carouselGap}px) / ${itemsPerView})`,
                                            minWidth: `calc((100% - ${(itemsPerView - 1) * carouselGap}px) / ${itemsPerView})`
                                        }}
                                    >
                                        <div className="space-y-4">
                                            {/* MOCKUP 3D BOOK COVER THUMBNAIL CONTAINER */}
                                            <div className="w-full aspect-[2.3/2.5] bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center p-4 shadow-inner group-hover:bg-slate-100/50 transition-colors">
                                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#0a459a]/20 border-r border-slate-300/30 z-10"></div>
                                                <BookOpen className="w-8 h-8 text-[#0a459a]/30 absolute right-4 top-4 z-10" />

                                                {book?.logo ? (
                                                    <img
                                                        src={`${Endpoints?.mediaBaseUrl}${book?.logo}`}
                                                        alt={book.title}
                                                        className="absolute inset-0 w-full h-full p-0 object-top object-cover group-hover:scale-105 transition-all duration-500"
                                                    />
                                                ) : (
                                                    <p className="text-[11px] font-semibold text-slate-800 text-center leading-snug tracking-tight px-4 line-clamp-4 relative z-10">
                                                        {book.title}
                                                    </p>
                                                )}
                                            </div>

                                            {/* TITLE & METADATA DESCRIPTION */}
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#0a459a] transition-colors">
                                                    {book.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 font-semibold leading-normal line-clamp-2">
                                                    {cleanDescription || "Comprehensive educational framework curated explicitly for professional exam staging strategies."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* PRICING ACTION BUTTON FOOTER */}
                                        <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {hasDiscount && (
                                                    <span className="text-[10px] text-slate-400 line-through font-semibold leading-none">
                                                        ₹{originalPrice.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span className="text-sm font-semibold text-slate-900 mt-0.5 leading-none">
                                                    {pricing ? (discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString('en-IN')}`) : 'Free'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    if (!book.coursePricing || book.coursePricing.length === 0) return;
                                                    e.stopPropagation();
                                                    setSelectedBook(book);
                                                    setShowConfigModal(true);
                                                }}
                                                className="text-[#0a459a] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform group-hover:underline"
                                            >
                                                Access Book <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CAROUSEL NAVIGATION CONTROLS */}
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
            {/* Mobile View Explore Store — aligned to end */}
            {!hasEmployeeCourseSelection && (
                <div className="md:hidden flex justify-center w-full mt-5 mb-2">
                    <button
                        onClick={handleExploreAllClick}
                        className="flex items-center gap-2 bg-[#0a459a] hover:bg-[#073373] text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Explore Store <Icons.ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* DYNAMIC BOOK PRICING CONFIG MODAL */}
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
