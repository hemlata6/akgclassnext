import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart } from 'lucide-react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS, TEXT_GREEN } from '../../constants/Icons';
import Endpoints from '../../config/endpoints';
import CourseConfigModal from '../Home/sections/CourseConfigModal';
import Network from '../../config/Network';
import instId from '../../config/instituteId';

const BookDetailPage = ({ bookData, onBack }) => {
    const router = useRouter();
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [cartCourses, setCartCourses] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [suggestedCourses, setSuggestedCourses] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [routeData, setRouteData] = useState(null);
    const [tokenFromUrl, setTokenFromUrl] = useState(null);
    const [allEmployee, setAllEmployee] = useState([]);

    // Detect query params on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const isMobileParam = params.get('isMobile');
            const tokenParam = params.get('token');

            if (isMobileParam) setRouteData(isMobileParam);
            if (tokenParam) setTokenFromUrl(tokenParam);
        }
    }, [router.asPath]);

    // Build query string from route params to preserve across navigation
    const getQueryString = () => {
        const params = new URLSearchParams();
        if (routeData) params.append('isMobile', routeData);
        if (tokenFromUrl) params.append('token', tokenFromUrl);
        const queryStr = params.toString();
        return queryStr ? `?${queryStr}` : '';
    };

    useEffect(() => {
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
    }, []);

    // Fetch all courses for suggestions
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await Network.getFreeCourseList(instId);
                setAllCourses(response.courses || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchAllCourses();
    }, []);

    // Get suggested courses/books based on checkout tag
    useEffect(() => {
        if (bookData?.setting?.checkoutTag && allCourses && allCourses.length > 0) {
            const filterCourseTags = allCourses.filter(item => {
                const tagslists = item.tags || [];
                return tagslists.some(tag => tag.id === bookData.setting.checkoutTag);
            });
            setSuggestedCourses(filterCourseTags);
        }
    }, [bookData, allCourses]);

    // Get lowest price
    const pricing = bookData?.coursePricing && Array.isArray(bookData.coursePricing) && bookData.coursePricing.length > 0
        ? bookData.coursePricing.reduce((lowest, current) => {
            const currentDiscounted = current.price - (current.price * current.discount / 100);
            const lowestDiscounted = lowest.price - (lowest.price * lowest.discount / 100);
            return currentDiscounted < lowestDiscounted ? current : lowest;
        })
        : null;

    const originalPrice = pricing ? pricing.price : 0;
    const discountedPrice = pricing ? originalPrice - (originalPrice * pricing.discount / 100) : 0;
    const hasDiscount = pricing && pricing.discount > 0;

    const isInCart = cartCourses.some(item => item.id === bookData?.id);

    const handleAddToCartFromModal = (cartItem) => {
        const existingCartIndex = cartCourses.findIndex(
            item => item.coursePricingId === cartItem.coursePricingId
        );

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

    const handleRemoveFromCart = () => {
        const updatedCart = cartCourses.filter(item => item.id !== bookData.id);
        setCartCourses(updatedCart);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleSuggestedCourseAddToCart = (suggestedCourse) => {
        const isAlreadyInCart = cartCourses.some(item => item.id === suggestedCourse.id);

        if (isAlreadyInCart) {
            const updatedCart = cartCourses.filter(item => item.id !== suggestedCourse.id);
            setCartCourses(updatedCart);
            localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            setSelectedBook(suggestedCourse);
            setShowConfigModal(true);
        }
    };

    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                const response = await Network.fetchEmployee(instId);
                setAllEmployee(response.employees || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchAllEmployee();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 animate-in fade-in duration-500 pb-20 md:pb-0">
            {/* Breadcrumb */}
            <div className={`${LAYOUT_PADDING} pt-3 pb-1`}>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium animate-in slide-in-from-left duration-300">
                    <button onClick={onBack} className="hover:text-indigo-600 transition-colors">Home</button>
                    <Icons.ChevronRight size={10} />
                    {/* <span className="text-slate-800 font-bold">CA Final</span>
          <Icons.ChevronRight size={10} /> */}
                    <span className="text-slate-800 font-bold truncate max-w-[200px]">{bookData?.title}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className={`${LAYOUT_PADDING} pb-24 lg:pb-8`}>
                <div className={`flex flex-col lg:grid ${suggestedCourses.length > 0 ? 'lg:grid-cols-12' : 'lg:grid-cols-5'} gap-4 lg:gap-6`}>
                    {/* Left: Book Cover */}
                    <div className={`${suggestedCourses.length > 0 ? 'lg:col-span-3' : 'lg:col-span-2'} animate-in fade-in slide-in-from-bottom-4 slide-in-from-left zoom-in-95 duration-700 ease-out`} style={{ animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div className="lg:sticky lg:top-24 lg:aspect-video lg:max-h-[400px]">
                            <div className="flex flex-col lg:h-full">
                                <div className="relative group lg:flex-1">
                                    {/* Book Cover Container */}
                                    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-slate-100 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl lg:h-full">
                                        <div
                                            className="bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center aspect-video lg:aspect-video lg:h-full"
                                        >
                                            {bookData?.logo ? (
                                                <img
                                                    src={`${Endpoints?.mediaBaseUrl}${bookData.logo}`}
                                                    alt={bookData.title}
                                                    className={`w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                                    onLoad={() => setImageLoaded(true)}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        setImageLoaded(true);
                                                    }}
                                                />
                                            ) : null}
                                            {(!bookData?.logo || !imageLoaded) && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                                                    <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl mb-1.5 animate-pulse">
                                                        📚
                                                    </div>
                                                    <h3 className="text-white font-bold text-[10px] leading-tight">{bookData?.title}</h3>
                                                </div>
                                            )}
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                                            New
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl -z-10"></div>
                                    <div className="absolute -top-2 -left-2 w-14 h-14 bg-amber-200/30 rounded-full blur-xl -z-10"></div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-3 space-y-1.5">
                                    {isInCart ? (
                                        <>
                                            <button
                                                onClick={handleRemoveFromCart}
                                                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                            >
                                                <Icons.X size={14} />
                                                Remove from Cart
                                            </button>
                                            <button
                                                onClick={() => router.push(`/cart${getQueryString()}`)}
                                                className={`w-full ${BRAND_GREEN_CLASS} hover:bg-indigo-700 text-white py-2 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5`}
                                            >
                                                <Icons.Cart size={14} />
                                                View Cart
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setShowConfigModal(true)}
                                            className={`w-full ${BRAND_GREEN_CLASS} hover:bg-indigo-700 text-white py-2 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 animate-pulse`}
                                        >
                                            <Icons.Cart size={14} />
                                            Add to Cart
                                        </button>
                                    )}

                                    <button className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                        <Icons.Share size={14} />
                                        Share Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Book Details */}
                    <div className={`${suggestedCourses.length > 0 ? 'lg:col-span-6' : 'lg:col-span-3'} space-y-4 animate-in fade-in slide-in-from-bottom-4 slide-in-from-right zoom-in-95 duration-700 delay-150 ease-out overflow-hidden`} style={{ animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        {/* Title Section */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    📚 Book
                                </span>
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    ⭐ Best Seller
                                </span>
                            </div>

                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                                {bookData?.title?.split('').map((char, index) => (
                                    <span
                                        key={index}
                                        className="inline-block animate-letter-drop"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                            opacity: 0,
                                            animationFillMode: 'forwards'
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </h1>

                            {bookData?.shortDescription && (
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    {bookData.shortDescription}
                                </p>
                            )}

                            {/* <div className="flex items-center gap-1.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[8px] shadow-sm">
                                        CA
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-xs">MyEduNeeds</p>
                                        <p className="text-[10px] text-emerald-600">Author</p>
                                    </div>
                                </div>
                            </div> */}
                            <div>
                                <div>
                                    {allEmployee
                                        ?.filter((employee) =>
                                            employee.courseIds?.includes(Number(bookData?.id))
                                        )
                                        .map((employee) => (
                                            <img
                                                key={employee.id}
                                                src={Endpoints.mediaBaseUrl + employee.profile}
                                                className="h-12 w-12 rounded-full object-cover border-2 border-white"
                                                alt={employee.firstName}
                                                title={`${employee.firstName} ${employee.lastName}`}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Course Info Section */}
                        {/* {bookData?.coursePricing && bookData.coursePricing.length > 0 && (
                            <div className="flex items-center gap-4 py-2 border-y border-slate-200">
                              
                                {bookData.coursePricing[0].validityType && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                                            <Icons.Clock size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-bold">Validity</p>
                                            <p className="text-xs font-bold text-slate-900 capitalize">
                                                {bookData.coursePricing[0].validityType === 'lifetime' ? 'Lifetime' :
                                                    bookData.coursePricing[0].validityType === 'expiry' && bookData.coursePricing[0].expiry ?
                                                        new Date(bookData.coursePricing[0].expiry).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) :
                                                        bookData.coursePricing[0].duration ?
                                                            (() => {
                                                                const totalDays = Math.floor(bookData.coursePricing[0].duration / (1000 * 60 * 60 * 24));
                                                                const yr = Math.floor(totalDays / 365);
                                                                const mon = Math.floor((totalDays % 365) / 30);
                                                                return `${yr ? yr + 'Y ' : ''}${mon ? mon + 'M' : ''}`.trim() || 'N/A';
                                                            })() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-purple-50 rounded-lg text-purple-700">
                                        <Icons.Eye size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-500 uppercase font-bold">Watch Time</p>
                                        <p className="text-xs font-bold text-slate-900">
                                            {bookData.coursePricing[0].watchTime === 'Unlimited' || !bookData.coursePricing[0].watchTime
                                                ? 'Unlimited'
                                                : `${bookData.coursePricing[0].watchTime}x`}
                                        </p>
                                    </div>
                                </div>

                                {(bookData.coursePricing[0].onlineContentAccess ||
                                    bookData.coursePricing[0].offlineContentAccess ||
                                    bookData.coursePricing[0].liveAccess) && (
                                        <div className="flex items-center gap-1.5">
                                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
                                                <Icons.Book size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-500 uppercase font-bold">Access</p>
                                                <p className="text-xs font-bold text-slate-900">
                                                    {[
                                                        bookData.coursePricing[0].onlineContentAccess && 'Online',
                                                        bookData.coursePricing[0].offlineContentAccess && 'Offline',
                                                        bookData.coursePricing[0].liveAccess && 'Live'
                                                    ].filter(Boolean).join(' + ') || 'Standard'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )} */}

                        {/* Price Section */}
                        <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-100">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Book Price</p>
                                    <div className="flex items-baseline gap-1.5">
                                        {hasDiscount ? (
                                            <>
                                                <span className="text-xl font-bold text-emerald-700">
                                                    ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-xs text-slate-400 line-through">
                                                    ₹{originalPrice.toLocaleString('en-IN')}
                                                </span>
                                                <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {pricing.discount}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold text-emerald-700">
                                                {originalPrice === 0 ? 'Free' : `₹${originalPrice.toLocaleString('en-IN')}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        <Icons.Clock size={12} />
                                        Limited
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                                <div className="h-4 w-0.5 bg-emerald-600 rounded-full"></div>
                                About This Book
                            </h2>
                            <div
                                className="text-slate-600 text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: bookData?.description || "Comprehensive study material designed for CA Final students. This book covers all essential topics with practical examples, illustrations, and exam-oriented approach."
                                }}
                            />
                        </div>
                    </div>

                    {/* Suggested Courses Column */}
                    {suggestedCourses.length > 0 && (
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100 lg:h-[calc(100vh-120px)] overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-1 w-10 rounded-full flex-shrink-0 ${BRAND_GREEN_CLASS}`}></div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Related Books</h2>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 lg:overflow-y-auto lg:pr-2" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    {suggestedCourses.map((suggestedCourse) => (
                                        <div
                                            key={suggestedCourse.id}
                                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
                                        >
                                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
                                                <img
                                                    src={suggestedCourse.logo ? `${Endpoints.mediaBaseUrl}${suggestedCourse.logo}` : '/api/placeholder/400/300'}
                                                    alt={suggestedCourse.title}
                                                    className="w-full h-full object-cover block"
                                                />
                                            </div>
                                            <div className="p-3 sm:p-4">
                                                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 min-h-[40px] break-words">
                                                    {suggestedCourse.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {(() => {
                                                        const pricing = suggestedCourse.coursePricing?.[0];
                                                        const price = pricing?.price || 0;
                                                        const discount = pricing?.discount || 0;
                                                        const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;
                                                        return (
                                                            <>
                                                                <span className="text-base font-bold text-emerald-700">
                                                                    ₹{finalPrice.toFixed(2)}
                                                                </span>
                                                                {discount > 0 && (
                                                                    <>
                                                                        <span className="text-xs text-slate-400 line-through">
                                                                            ₹{price.toFixed(2)}
                                                                        </span>
                                                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                                            {discount}% OFF
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSuggestedCourseAddToCart(suggestedCourse)}
                                                        className={`flex-1 font-semibold py-2 px-3 text-xs rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${cartCourses.some(item => item.id === suggestedCourse.id)
                                                            ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                                            : `${BRAND_GREEN_CLASS} hover:bg-indigo-700 text-white`
                                                            }`}
                                                    >
                                                        <ShoppingCart className="h-3.5 w-3.5" />
                                                        {cartCourses.some(item => item.id === suggestedCourse.id) ? 'Remove' : 'Add to cart'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Config Modal */}
            {showConfigModal && (selectedBook || bookData) && (
                <CourseConfigModal
                    course={selectedBook || bookData}
                    onClose={() => {
                        setShowConfigModal(false);
                        setSelectedBook(null);
                    }}
                    onAddToCart={handleAddToCartFromModal}
                />
            )}
        </div>
    );
};

export default BookDetailPage;

