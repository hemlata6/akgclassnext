import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../constants/Icons';
import { SYLLABUS_DATA } from '../../constants/data';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import CourseConfigModal from '../Home/sections/CourseConfigModal';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { BASE_URL } from '../../config/endpoints';
import ProceedToCheckoutForm from '../Cart/ProceedToCheckoutForm';
import LoginModal from '@/components/Auth/LoginModal';
import AppDownloadModal from '@/components/Modals/AppDownloadModal';
import { Dialog, DialogContent, IconButton } from '@mui/material';

const CourseHeader = ({ courseData, onBack, onAddToCart }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [allEmployee, setAllEmployee] = useState([]);
  // Format duration from coursePricing
  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0 hr";

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const parts = [];

    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} sec${seconds > 1 ? 's' : ''}`);

    return parts.length ? parts.join(" ") : "0 hr";
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


  // Format validity from first pricing
  const getHeaderValidity = () => {
    const pricing = courseData?.coursePricing?.[0];
    if (!pricing) return 'N/A';
    if (pricing.validityType === 'expiry' && pricing.expiry) {
      return new Date(pricing.expiry).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (pricing.validityType === 'lifetime') {
      return 'Lifetime';
    } else if (pricing.validityType === 'validity' && pricing.duration) {
      const totalDays = Math.floor(pricing.duration / (1000 * 60 * 60 * 24));
      const yr = Math.floor(totalDays / 365);
      const mon = Math.floor((totalDays % 365) / 30);
      const days = (totalDays % 365) % 30;
      const parts = [];
      if (yr) parts.push(`${yr} Year${yr > 1 ? 's' : ''}`);
      if (mon) parts.push(`${mon} Month${mon > 1 ? 's' : ''}`);
      if (days) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
      return parts.length > 0 ? parts.join(' ') : 'N/A';
    }
    return 'N/A';
  };

  // Format watchTime
  const formatWatchTime = () => {
    const firstPricing = courseData?.coursePricing?.[0];
    if (!firstPricing?.watchTime) return "Unlimited";

    if (firstPricing.watchTime === "Unlimited") return "Unlimited";
    return `${firstPricing.watchTime}x`;
  };

  // Build carousel items
  const carouselItems = [];
  if (courseData?.logo) {
    carouselItems.push({
      type: 'logo',
      src: `${Endpoints?.mediaBaseUrl}${courseData.logo}`,
      title: 'Course Logo'
    });
  }
  if (courseData?.introVideo) {
    carouselItems.push({
      type: 'video',
      src: `${Endpoints?.mediaBaseUrl}${courseData.introVideo}`,
      title: 'Intro Video'
    });
  }
  // Add default video placeholder if no intro video
  if (!courseData?.introVideo) {
    carouselItems.push({
      type: 'video',
      title: 'Watch Demo Lecture'
    });
  }

  const handleCarouselPrev = () => {
    setCarouselIndex(prev => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleCarouselNext = () => {
    setCarouselIndex(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    const baseUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://lpacacma.netlify.app/';

    const shareUrl = `${baseUrl}/course/${courseData?.id}`;
    const shareData = {
      title: courseData?.title || 'Course',
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopyAlert(true);
        setTimeout(() => setShowCopyAlert(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="bg-slate-50 pt-8 pb-12 border-b border-slate-200">
      <div className={LAYOUT_PADDING}>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <button onClick={onBack} className="hover:text-slate-800">Home</button>
          <span>/</span>
          {/* <span className="text-slate-800 font-bold">CA Final</span>
          <span>/</span> */}
          <span className="text-slate-800 font-bold truncate max-w-[200px]">
            {courseData?.title || 'Financial Reporting'}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-7/12">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border-4 border-white">
              {carouselItems[carouselIndex]?.type === 'logo' ? (
                <img
                  src={carouselItems[carouselIndex]?.src}
                  className="w-full h-full object-cover"
                  alt="Course Logo"
                />
              ) : carouselItems[carouselIndex]?.type === 'video' ? (
                <video
                  src={carouselItems[carouselIndex]?.src || ""}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <>
                  <img
                    src="https://placehold.co/1280x720/164e33/FFF?text=Demo+Lecture+Thumb"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    alt="Demo"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Icons.Play />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-white text-xs font-bold backdrop-blur-sm">
                    Watch Demo Lecture (45 min)
                  </div>
                </>
              )}

              {carouselItems.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {carouselItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === carouselIndex
                        ? `${BRAND_GREEN_CLASS} w-8`
                        : 'bg-white/40 w-2 hover:bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-5/12 space-y-4">
            <div className="flex gap-2">
              {
                courseData?.tags && courseData?.tags?.length > 0 && courseData?.tags?.map((tag) => {
                  return <span key={tag} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{tag?.tag}</span>
                })
              }
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {courseData?.title || "CA Final Financial Reporting (FR)"}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {courseData?.shortDescription}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 border-y border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700"><Icons.Clock /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Duration</p>
                  <p className="text-sm font-bold text-slate-900">{formatDuration(courseData?.setting?.duration)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-700"><Icons.Eye /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Watch Time</p>
                  <p className="text-sm font-bold text-slate-900">{formatWatchTime()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700"><Icons.Clock /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Validity</p>
                  <p className="text-sm font-bold text-slate-900">{getHeaderValidity()}</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-700"><Icons.Book /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Material</p>
                  <p className="text-sm font-bold text-slate-900">Hard Copy</p>
                </div>
              </div> */}
            </div>
            <div className="flex items-center gap-3">
              {/* <img
                src="https://placehold.co/100x100/164e33/FFF?text=VD"
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                alt="Faculty"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">CA Rahul Jain</p>
                <p className="text-xs text-emerald-600 font-medium">Core Faculty</p>
              </div> */}
              <div>
                <div className='flex -space-x-2'>
                  {allEmployee
                    ?.filter((employee) =>
                      employee.courseIds?.includes(Number(courseData?.id))
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
              <button
                onClick={handleShare}
                className="ml-auto text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-xs font-bold border border-slate-200 px-3 py-1.5 rounded-full">
                <Icons.Share /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CourseContent = ({ courseData, onAddToCart }) => {
  const router = useRouter();
  const { authToken, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedValidity, setSelectedValidity] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResponse, setCheckoutResponse] = useState("");
  const [errorBarMessage, setErrorBarMessage] = useState('');
  const [showErrorBar, setShowErrorBar] = useState(false);
  const [showCheckoutFormModal, setShowCheckoutFormModal] = useState(false);
  const [showProceedCheckout, setShowProceedCheckout] = useState(false);
  const [checkoutCartItem, setCheckoutCartItem] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('form');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', contact: '' });
  const [checkoutFormError, setCheckoutFormError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showMobilePaymentModal, setShowMobilePaymentModal] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [tokenFromUrl, setTokenFromUrl] = useState(null);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [showSuccessBar, setShowSuccessBar] = useState(false);
  const [successBarMessage, setSuccessBarMessage] = useState('');
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  // console.log("CourseData", courseData)

  const LOGOUT_ERROR_CODES = new Set([100, 101, 102, 103, 104, 401]);

  const handleLogoutError = (errorCode, errorDescription) => {
    if (!LOGOUT_ERROR_CODES.has(errorCode)) return false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('studentAuth');
    localStorage.removeItem('studentData');
    const message = `You have been logged out. ${errorDescription || 'Session expired'}`;
    setErrorBarMessage(message);
    setShowErrorBar(true);
    setShowLoginModal(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return true;
  };

  // Load cart from localStorage
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

  // Get suggested courses based on checkout tag
  useEffect(() => {

    if (courseData?.setting?.checkoutTag && allCourses && allCourses.length > 0) {
      const filterCourseTags = allCourses.filter(item => {
        const tagslists = item.tags || [];
        return tagslists.some(tag => tag.id === courseData.setting.checkoutTag);
      });
      setSuggestedCourses(filterCourseTags);
    }
  }, [courseData, allCourses]);


  const getUniqueLearningModes = () => {
    const modeSet = new Set();

    courseData?.coursePricing?.forEach(course => {
      let modes = [];
      if (course.liveAccess) modes.push("Live Access");
      if (course.onlineContentAccess) modes.push("Recorded");
      if (course.offlineContentAccess) modes.push("Pendrive");
      if (course.faceToFaceAccess) modes.push("Face to Face");
      if (course.quizAccess) modes.push("Test-Series");
      if (modes.length) {
        modeSet.add(modes.join(" + "));
      }
    });

    return Array.from(modeSet);
  };

  const getUniqueVariants = () => {
    const variantSet = new Set();

    courseData?.coursePricing?.forEach(course => {
      if (course.variation) {
        variantSet.add(course.variation);
      } else if (course.variantName) {
        variantSet.add(course.variantName);
      } else if (course.tier) {
        variantSet.add(course.tier);
      } else if (course.packageName) {
        variantSet.add(course.packageName);
      }
    });

    return Array.from(variantSet);
  };

  const getValidityOptions = () => {
    if (!selectedMode) return [];

    const selectedModes = selectedMode.split(" + ");

    return courseData?.coursePricing?.filter(pricing => {
      const matchesSelection = (
        (selectedModes.includes("Live Access") ? pricing.liveAccess === true : pricing.liveAccess === null) &&
        (selectedModes.includes("Recorded") ? pricing.onlineContentAccess === true : pricing.onlineContentAccess === null) &&
        (selectedModes.includes("Pendrive") ? pricing.offlineContentAccess === true : pricing.offlineContentAccess === null) &&
        (selectedModes.includes("Face to Face") ? pricing.faceToFaceAccess === true : pricing.faceToFaceAccess === null) &&
        (selectedModes.includes("Test-Series") ? pricing.quizAccess === true : pricing.quizAccess === null)
      );

      return matchesSelection;
    }) || [];
  };

  const formatValidity = (pricing) => {
    if (pricing.validityType === "expiry" && pricing.expiry) {
      // expiry is in milliseconds timestamp
      const expiryDate = new Date(pricing.expiry);
      return expiryDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (pricing.validityType === "lifetime") {
      return "Lifetime";
    } else if (pricing.validityType === "validity" && pricing.duration) {
      // Check if duration is an object or milliseconds
      let yr, mon, days;

      if (typeof pricing.duration === 'object' && pricing.duration !== null) {
        // Duration is an object
        yr = pricing.duration.yr;
        mon = pricing.duration.mon;
        days = pricing.duration.days;
      } else if (typeof pricing.duration === 'number') {
        // Duration is in milliseconds - convert to years/months/days
        const totalDays = Math.floor(pricing.duration / (1000 * 60 * 60 * 24));
        yr = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        mon = Math.floor(remainingDays / 30);
        days = remainingDays % 30;
      }

      let parts = [];
      if (yr) parts.push(`${yr} Year${yr > 1 ? 's' : ''}`);
      if (mon) parts.push(`${mon} Month${mon > 1 ? 's' : ''}`);
      if (days) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
      return parts.length > 0 ? parts.join(' ') : 'N/A';
    }
    return "N/A";
  };

  const modes = getUniqueLearningModes();
  const variants = getUniqueVariants();
  const hasVariants = variants.length > 0;
  const validityOptions = getValidityOptions();
  const uniqueValidityLabels = Array.from(new Set(validityOptions.map((pricing) => formatValidity(pricing))));
  const shouldShowValidityChip = validityOptions.length > 0 && uniqueValidityLabels.length === 1;

  // Set default selections
  React.useEffect(() => {
    if (modes.length > 0 && !selectedMode) {
      setSelectedMode(modes[0]);
    }
  }, [modes]);

  React.useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    } else if (variants.length === 0 && selectedVariant !== null) {
      setSelectedVariant(null);
    }
  }, [variants, selectedVariant]);

  React.useEffect(() => {
    if (validityOptions.length > 0 && !selectedValidity) {
      setSelectedValidity(validityOptions[0]);
    }
  }, [validityOptions]);

  // Calculate price based on selected mode, variant and validity
  const getSelectedPrice = () => {
    if (!selectedMode || !selectedValidity || (hasVariants && !selectedVariant)) return null;

    const selectedModes = selectedMode.split(" + ");

    const selectedPricing = courseData?.coursePricing?.find(pricing => {
      // Match mode
      const modeMatch = (
        (selectedModes.includes("Live Access") ? pricing.liveAccess === true : pricing.liveAccess === null) &&
        (selectedModes.includes("Recorded") ? pricing.onlineContentAccess === true : pricing.onlineContentAccess === null) &&
        (selectedModes.includes("Pendrive") ? pricing.offlineContentAccess === true : pricing.offlineContentAccess === null) &&
        (selectedModes.includes("Face to Face") ? pricing.faceToFaceAccess === true : pricing.faceToFaceAccess === null) &&
        (selectedModes.includes("Test-Series") ? pricing.quizAccess === true : pricing.quizAccess === null)
      );

      // Match variant - check all possible variant field names
      const variantMatch = !hasVariants || (
        pricing.variation === selectedVariant ||
        pricing.variantName === selectedVariant ||
        pricing.tier === selectedVariant ||
        pricing.packageName === selectedVariant
      );

      // Match validity
      const validityMatch = formatValidity(pricing) === formatValidity(selectedValidity);

      return modeMatch && variantMatch && validityMatch;
    });

    if (selectedPricing) {
      const originalPrice = selectedPricing.price || 0;
      const discount = selectedPricing.discount || 0;
      const discountedPrice = originalPrice - (originalPrice * discount / 100);

      return {
        originalPrice,
        discountedPrice,
        discount,
        // Include additional pricing details from coursePricing
        pricingId: selectedPricing.id,
        validityType: selectedPricing.validityType,
        duration: selectedPricing.duration,
        expiry: selectedPricing.expiry,
        watchTime: selectedPricing.watchTime,
        liveAccess: selectedPricing.liveAccess,
        onlineContentAccess: selectedPricing.onlineContentAccess,
        offlineContentAccess: selectedPricing.offlineContentAccess,
        faceToFaceAccess: selectedPricing.faceToFaceAccess,
        quizAccess: selectedPricing.quizAccess
      };
    }

    return null;
  };

  const priceInfo = getSelectedPrice();

  // Debug logging for price calculation
  React.useEffect(() => {
    if (selectedMode && selectedValidity && (!hasVariants || selectedVariant)) {
      console.log('Price Calculation Debug:', {
        selectedMode,
        selectedVariant,
        selectedValidity: formatValidity(selectedValidity),
        priceInfo,
        totalCoursePricing: courseData?.coursePricing?.length
      });
    }
  }, [selectedMode, selectedVariant, selectedValidity, priceInfo, hasVariants, courseData?.coursePricing?.length]);

  const isPurchaseSelectionIncomplete = !selectedMode || (hasVariants && !selectedVariant) || !selectedValidity || !priceInfo;

  const handleSuggestedCourseAddToCart = (suggestedCourse) => {
    const isAlreadyInCart = cartCourses.some(item => item.id === suggestedCourse.id);

    if (isAlreadyInCart) {
      const updatedCart = cartCourses.filter(item => item.id !== suggestedCourse.id);
      setCartCourses(updatedCart);
      localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      setSelectedCourse(suggestedCourse);
      setShowConfigModal(true);
    }
  };

  // Build query string from route params to preserve across navigation
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (routeData) params.append('isMobile', routeData);
    if (tokenFromUrl) params.append('token', tokenFromUrl);
    const queryStr = params.toString();
    return queryStr ? `?${queryStr}` : '';
  };

  const splitName = (fullName = '') => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || 'Guest',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  const handleProceedToCheckoutDirect = async () => {
    if (!priceInfo) return;

    const cartItem = {
      ...courseData,
      pricingId: priceInfo.pricingId,
      coursePricingId: priceInfo.pricingId,
      selectedMode: selectedMode || '',
      selectedVariant: selectedVariant || '',
      selectedValidity: selectedValidity ? formatValidity(selectedValidity) : '',
      finalPrice: priceInfo.discountedPrice,
      originalPrice: priceInfo.originalPrice,
      discount: priceInfo.discount,
      validityType: priceInfo.validityType,
      watchTime: priceInfo.watchTime,
      type: 'Course'
    };

    if (queryString) {
      // Mobile mode (query params) - always call API with tokenParam
      setIsProcessing(true);
      try {
        const entityModals = [{
          purchaseType: "course",
          entityId: courseData.id,
          campusId: 0,
          courseId: 0,
          coursePricingId: priceInfo.pricingId
        }];

        const mobileBody = {
          "getCheckoutUrls": entityModals,
          "coupon": ""
        };

        const response = await axios.post(
          `${BASE_URL}payment/get-checkout-url`,
          mobileBody,
          { headers: { "X-Auth": tokenFromUrl } }
        );

        if (response?.data?.status === true && response?.data?.url) {
          setCheckoutResponse(response?.data);
          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            setPaymentUrl(response.data.url);
            setShowMobilePaymentModal(true);
            window.dispatchEvent(new Event('hideFooter'));
          } else {
            const width = 480;
            const height = 1080;
            const left = window.screenX + (window.outerWidth / 2) - (width / 2);
            const top = window.screenY + (window.outerHeight / 2) - (height / 2);

            window.open(
              response.data.url,
              'payment',
              `location=no,width=${width},height=${height},top=${top},left=${left}`
            );
          }
        } else {
          if (handleLogoutError(response?.data?.errorCode, response?.data?.errorDescription)) return;
          const errorMsg = response?.data?.errorDescription || response?.data?.message || 'Failed to generate checkout URL. Please try again.';
          setErrorBarMessage(errorMsg);
          setShowErrorBar(true);
        }
      } catch (error) {
        console.error('Mobile checkout error:', error);
        if (handleLogoutError(error?.response?.data?.errorCode, error?.response?.data?.errorDescription)) return;
        const errorMsg = error?.response?.data?.errorDescription || error?.response?.data?.message || 'Token expired or invalid. Please login again from the app.';
        setErrorBarMessage(errorMsg);
        setShowErrorBar(true);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (authToken) {
      // User is logged in - call API directly
      setIsProcessing(true);
      try {
        const entityModals = [{
          purchaseType: "course",
          entityId: courseData.id,
          campusId: 0,
          courseId: 0,
          coursePricingId: priceInfo.pricingId
        }];

        const mobileBody = {
          "getCheckoutUrls": entityModals,
          "coupon": ""
        };

        const response = await axios.post(
          `${BASE_URL}payment/get-checkout-url`,
          mobileBody,
          { headers: { "X-Auth": authToken } }
        );

        if (response?.data?.status === true && response?.data?.url) {
          setCheckoutResponse(response?.data);
          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            setPaymentUrl(response.data.url);
            setShowMobilePaymentModal(true);
            window.dispatchEvent(new Event('hideFooter'));
          } else {
            const width = 480;
            const height = 1080;
            const left = window.screenX + (window.outerWidth / 2) - (width / 2);
            const top = window.screenY + (window.outerHeight / 2) - (height / 2);

            window.open(
              response.data.url,
              'payment',
              `location=no,width=${width},height=${height},top=${top},left=${left}`
            );
          }
        } else {
          if (handleLogoutError(response?.data?.errorCode, response?.data?.errorDescription)) return;
          const errorMsg = response?.data?.errorDescription || response?.data?.message || 'Failed to generate checkout URL. Please try again.';
          setErrorBarMessage(errorMsg);
          setShowErrorBar(true);
        }
      } catch (error) {
        console.error('Checkout error:', error);
        if (handleLogoutError(error?.response?.data?.errorCode, error?.response?.data?.errorDescription)) return;
        const errorMsg = error?.response?.data?.errorDescription || error?.response?.data?.message || 'An error occurred during checkout. Please try again.';
        setErrorBarMessage(errorMsg);
        setShowErrorBar(true);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // User is not authenticated - show login modal
      setCheckoutCartItem(cartItem);
      setShowLoginModal(true);
    }
  };

  // Auto-trigger checkout after login
  useEffect(() => {
    if (authToken && checkoutCartItem && !showLoginModal) {
      handleProceedToCheckoutDirect();
      setCheckoutCartItem(null);
    }
  }, [authToken, showLoginModal, checkoutCartItem]);

  const validateCheckoutForm = () => {
    const { name, email, contact } = checkoutForm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) return 'Name is required.';
    if (!email.trim() || !emailRegex.test(email)) return 'Enter a valid email address.';
    if (!contact.trim() || contact.replace(/\D/g, '').length !== 10) return 'Contact number must be exactly 10 digits.';
    return '';
  };

  const queryString = getQueryString();

  // Check if we should hide global footer
  const shouldHideGlobalControls = !!(routeData || tokenFromUrl);

  // // Detect query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isMobileParam = params.get('isMobile');
      const tokenParam = params.get('token');

      if (isMobileParam) setRouteData(isMobileParam);
      if (tokenParam) setTokenFromUrl(tokenParam);
    }
  }, [router.asPath]);


  const handleProceedToCheckout = async (customerDetails = checkoutForm) => {
    if (!priceInfo?.pricingId || !courseData?.id) {
      const errorMsg = 'Please select a valid mode, variant and validity before checkout.';
      setErrorBarMessage(errorMsg);
      setShowErrorBar(true);
      return;
    }

    const urlToken = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token')
      : null;

    const checkoutToken = tokenFromUrl || urlToken || authToken;

    setIsProcessing(true);

    try {
      const entityModals = [{
        purchaseType: 'course',
        entityId: courseData.id,
        campusId: 0,
        courseId: 0,
        coursePricingId: priceInfo.pricingId
      }];

      const mobileBody = {
        getCheckoutUrls: entityModals,
        coupon: ''
      };

      const { firstName, lastName } = splitName(customerDetails?.name);

      const publicBody = {
        firstName,
        lastName,
        contact: customerDetails?.contact || '',
        email: customerDetails?.email || '',
        instId: instId,
        campaignId: null,
        coupon: '',
        coursePricingId: 0,
        entityModals
      };

      const endpoint = checkoutToken
        ? `${BASE_URL}payment/get-checkout-url`
        : `${BASE_URL}/admin/payment/fetch-public-checkout-url`;

      const payload = checkoutToken ? mobileBody : publicBody;

      const config = checkoutToken
        ? { headers: { 'X-Auth': checkoutToken } }
        : undefined;

      const response = await axios.post(
        endpoint,
        payload,
        config
      );

      if (response?.data?.status === true && response?.data?.url) {
        setCheckoutResponse(response.data);
        setShowCheckoutFormModal(false);

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          setPaymentUrl(response.data.url);
          setShowMobilePaymentModal(true);
          setPaymentDrawerOpen(true);
          window.dispatchEvent(new Event('hideFooter'));
        } else {
          const width = 480;
          const height = 1080;
          const left = window.screenX + (window.outerWidth / 2) - (width / 2);
          const top = window.screenY + (window.outerHeight / 2) - (height / 2);

          window.open(
            response.data.url,
            'payment',
            `location=no,width=${width},height=${height},top=${top},left=${left}`
          );
        }

        return;
      }

      const errorMsg = response?.data?.errorDescription || response?.data?.message || 'Failed to generate checkout URL. Please try again.';
      setErrorBarMessage(errorMsg);
      setShowErrorBar(true);
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMsg = error?.response?.data?.errorDescription || error?.response?.data?.message || 'Failed to start checkout. Please try again.';
      setErrorBarMessage(errorMsg);
      setShowErrorBar(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="py-12 bg-white relative">
      <div className={LAYOUT_PADDING}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className={`w-full min-w-0 ${suggestedCourses.length > 0 ? 'lg:col-span-7' : 'lg:col-span-8'}`}>
            {/* <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar sticky top-[108px] bg-white z-40">
              {['Overview', 'Syllabus', 'Books', 'Instructor', 'FAQ'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase() ? `border-emerald-700 ${TEXT_GREEN}` : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div> */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 overflow-hidden">
              <h3 className="font-bold text-lg text-emerald-900 mb-4">Course Description</h3>
              <style>{`
                .course-description,
                .course-description *,
                .course-description p,
                .course-description div,
                .course-description span,
                .course-description li,
                .course-description td,
                .course-description th {
                  max-width: 100% !important;
                  overflow-wrap: anywhere !important;
                  word-break: break-word !important;
                  word-wrap: break-word !important;
                  white-space: normal !important;
                }

                .course-description table,
                .course-description img,
                .course-description iframe,
                .course-description video,
                .course-description canvas,
                .course-description svg {
                  max-width: 100% !important;
                }
              `}</style>
              <div
                className="course-description display-none min-w-0 max-w-full overflow-x-auto text-sm text-emerald-800 leading-relaxed prose prose-sm max-w-none [&>*]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_iframe]:max-w-full [&_video]:h-auto [&_video]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_*]:break-words"
                style={{ wordWrap: 'break-word', overflowWrap: 'anywhere', wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}
                dangerouslySetInnerHTML={{
                  __html: courseData?.description || courseData?.longDescription || "No description available for this course."
                }}
              />
            </div>
          </div>
          <div className={`w-full min-w-0 ${suggestedCourses.length > 0 ? 'lg:col-span-5' : 'lg:col-span-4'} relative`}>
            <div className="sticky top-28">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
                <div className="mb-6">
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    Limited Time Offer
                  </span>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-bold text-slate-900">
                      ₹{priceInfo?.discountedPrice?.toLocaleString('en-IN') || courseData?.price?.toLocaleString('en-IN')}
                    </span>
                    {priceInfo?.originalPrice && priceInfo.originalPrice !== priceInfo.discountedPrice && (
                      <span className="text-sm text-slate-400 line-through mb-1.5">
                        ₹{priceInfo.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {priceInfo?.discount > 0 && (
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      You save ({priceInfo.discount}% OFF)
                    </p>
                  )}
                  {/* {showErrorBar && errorBarMessage && (
                    <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 border border-red-200">
                      {errorBarMessage}
                    </p>
                  )} */}
                </div>

                {/* Pricing Breakdown */}
                {/* {priceInfo && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs space-y-2 border border-slate-200">
                    <div className="font-bold text-slate-700 mb-3">Price Details</div>
                    <div className="flex justify-between text-slate-600">
                      <span>Base Price:</span>
                      <span>₹{priceInfo.originalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    {priceInfo.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({priceInfo.discount}%):</span>
                        <span>-₹{((priceInfo.originalPrice * priceInfo.discount) / 100)?.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-slate-900">
                      <span>Final Price:</span>
                      <span className={BRAND_GREEN_CLASS.replace('bg-', 'text-')}>₹{priceInfo.discountedPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    {priceInfo.validityType && (
                      <div className="mt-3 pt-3 border-t border-slate-300 text-slate-600">
                        <div>Validity: {formatValidity(selectedValidity)}</div>
                      </div>
                    )}
                  </div>
                )} */}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Mode</label>
                    <div className="flex flex-wrap gap-2">
                      {modes.map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSelectedMode(mode)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all max-w-full break-words text-center leading-tight ${selectedMode === mode
                            ? `border-2 ${BRAND_GREEN_CLASS} text-white`
                            : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasVariants && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Variant</label>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => (
                          <button
                            key={variant}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all max-w-full break-words text-center leading-tight ${selectedVariant === variant
                              ? `border-2 ${BRAND_GREEN_CLASS} text-white`
                              : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                              }`}
                          >
                            {variant}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {validityOptions.length > 1 && !shouldShowValidityChip && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Validity</label>
                      <select
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-sm font-semibold outline-none focus:border-emerald-600 bg-white"
                        value={selectedValidity ? JSON.stringify(selectedValidity) : ''}
                        onChange={(e) => setSelectedValidity(JSON.parse(e.target.value))}
                      >
                        {validityOptions.map((pricing, idx) => (
                          <option key={idx} value={JSON.stringify(pricing)}>
                            {formatValidity(pricing)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {shouldShowValidityChip && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Validity</label>
                      <div className={`inline-flex px-3 py-2 rounded-lg text-xs font-bold transition-all border-2 ${BRAND_GREEN_CLASS} text-white`}>
                        {uniqueValidityLabels[0]}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-3">
                  {cartCourses.some(item => item.id === courseData?.id) ? (
                    <div className="flex flex-1 gap-2">
                      {/* View Cart button */}
                      <button
                        onClick={() => router.push('/cart')}
                        className="flex-1 py-4 rounded-xl font-bold text-sm shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
                      >
                        View Cart
                      </button>
                      {/* Remove from cart X button */}
                      <button
                        onClick={() => {
                          const updatedCart = cartCourses.filter(item => item.id !== courseData?.id);
                          setCartCourses(updatedCart);
                          localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                          window.dispatchEvent(new Event('cartUpdated'));
                        }}
                        className="py-4 px-4 rounded-xl font-bold text-sm shadow-lg transform transition active:scale-95 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600"
                        title="Remove from cart"
                      >
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!courseData?.coursePricing || courseData.coursePricing.length === 0) return;
                        if (!priceInfo) return;

                        const cartItem = {
                          ...courseData,
                          pricingId: priceInfo.pricingId,
                          coursePricingId: priceInfo.pricingId,
                          selectedMode: selectedMode || '',
                          selectedVariant: selectedVariant || '',
                          selectedValidity: selectedValidity ? formatValidity(selectedValidity) : '',
                          finalPrice: priceInfo.discountedPrice,
                          originalPrice: priceInfo.originalPrice,
                          discount: priceInfo.discount,
                          validityType: priceInfo.validityType,
                          watchTime: priceInfo.watchTime,
                          type: "Course"
                        };

                        const updatedCart = [...cartCourses, cartItem];
                        setCartCourses(updatedCart);
                        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                      disabled={isPurchaseSelectionIncomplete}
                      className={`flex-1 py-4 rounded-xl font-bold text-sm shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${isPurchaseSelectionIncomplete
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : `${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white`
                        }`}
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={handleProceedToCheckoutDirect}
                    disabled={isPurchaseSelectionIncomplete || isProcessing}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${isPurchaseSelectionIncomplete || isProcessing
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : `${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white`
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                </div>
                {/* <p className="text-[10px] text-slate-400 text-center mt-3">
                  30-Day Money Back Guarantee • Secure Payment
                </p> */}
              </div>
              {/* <div className="mt-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-700">
                  <Icons.Phone />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Have queries?</p>
                  <p className="text-[10px] text-slate-600">Call us at +91 7703880232</p>
                </div>
              </div> */}
            </div>
          </div>

        </div>
      </div>
      <div className="bg-white py-12">
        {suggestedCourses.length > 0 && (
          <div className="w-full">
            <div className={LAYOUT_PADDING}>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Frequently Bought Together</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max w-fit">
                {suggestedCourses.map((suggestedCourse) => (
                  <div
                    key={suggestedCourse.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-indigo-400 overflow-hidden flex flex-col group max-w-sm"
                  >
                    {/* Green Header with Badge and Hours */}
                    <div className={`${BRAND_GREEN_CLASS} p-0 relative h-48 flex items-end justify-start overflow-hidden`}>
                      {suggestedCourse.logo && (
                        <img
                          src={`${Endpoints.mediaBaseUrl}${suggestedCourse.logo}`}
                          alt={suggestedCourse.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
                      {/* Badge */}
                      {suggestedCourse.badge && (
                        <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30 z-10">
                          {suggestedCourse.badge}
                        </span>
                      )}
                      {/* Hours Info */}
                      <div className="flex items-center gap-2 text-white text-xs font-bold relative z-10 p-4">
                        <Icons.Clock size={18} />
                        {suggestedCourse.hours || '0'} Hours
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">
                        {suggestedCourse.title}
                      </h3>
                      {/* <p className="text-xs text-slate-500 mb-3">
                        {suggestedCourse.logo ? 'Google Drive / Mobile App' : 'Online Course'}
                      </p> */}

                      {/* Price and Button */}
                      <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                          {(() => {
                            const pricing = suggestedCourse.coursePricing?.[0];
                            const price = pricing?.price || 0;
                            const discount = pricing?.discount || 0;
                            const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;
                            return (
                              <>
                                {discount > 0 && (
                                  <span className="text-sm text-slate-400 line-through">
                                    ₹{price.toLocaleString('en-IN')}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-slate-900">
                                  ₹{finalPrice.toLocaleString('en-IN')}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <button
                          onClick={() => handleSuggestedCourseAddToCart(suggestedCourse)}
                          className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${cartCourses.some(item => item.id === suggestedCourse.id)
                            ? `${BRAND_GREEN_CLASS} bg-opacity-80`
                            : BRAND_GREEN_CLASS
                            }`}
                        >
                          {cartCourses.some(item => item.id === suggestedCourse.id) ? (
                            <Icons.Check size={16} className="text-white" />
                          ) : (
                            <ShoppingCart size={16} className="text-white" />
                          )}
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

      {/* Config Modal */}
      {showConfigModal && (
        <CourseConfigModal
          course={selectedCourse || courseData}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedCourse(null);
          }}
          onAddToCart={(cartItem) => {
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
          }}
        />
      )}

      {showLoginModal && checkoutCartItem && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setCheckoutCartItem(null);
          }}
        />
      )}

      {/* Mobile Payment Dialog */}
      <Dialog
        open={showMobilePaymentModal}
        onClose={() => {
          setShowMobilePaymentModal(false);
          setPaymentUrl('');
          window.dispatchEvent(new Event('showFooter'));
        }}
        fullScreen
        PaperProps={{
          sx: {
            margin: 0,
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 bg-emerald-800 flex-shrink-0"
          style={{ minHeight: '56px' }}
        >
          <h2 className="text-white font-bold text-sm truncate flex-1">Complete Payment</h2>
          <IconButton
            onClick={() => {
              setShowMobilePaymentModal(false);
              setPaymentUrl('');
              setPaymentDrawerOpen(false);
              window.dispatchEvent(new Event('showFooter'));
            }}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              },
              width: 32,
              height: 32
            }}
          >
            ✕
          </IconButton>
        </div>

        {/* Content */}
        <DialogContent
          sx={{
            padding: 0,
            overflow: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            position: 'relative',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <iframe
            src={paymentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 20,
            }}
            title="Payment Gateway"
            allow="payment"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            scrolling="yes"
          />
        </DialogContent>
      </Dialog>

      {/* App Download Modal */}
      <AppDownloadModal
        open={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
      />

      {/* Error Notification Bar */}
      {showErrorBar && (
        <div className="fixed bottom-4 left-4 z-[60] animate-slide-up max-w-md">
          <div className="bg-red-600 text-white px-4 py-4 shadow-2xl rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">{errorBarMessage}</p>
              </div>
              <button
                onClick={() => setShowErrorBar(false)}
                className="flex-shrink-0 text-white hover:text-red-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Bar */}
      {showSuccessBar && (
        <div className="fixed bottom-4 left-4 z-[60] animate-slide-up max-w-md">
          <div className="bg-green-600 text-white px-4 py-4 shadow-2xl rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">{successBarMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccessBar(false)}
                className="flex-shrink-0 text-white hover:text-green-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckoutFormModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className={`${BRAND_GREEN_CLASS} px-5 py-4 flex items-center justify-between`}>
              <h3 className="text-white font-bold text-lg">
                {checkoutStep === 'form' ? 'Checkout Details' : 'Confirm Order'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCheckoutFormModal(false)}
                className="text-white/90 hover:text-white"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-5">
              {checkoutStep === 'form' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Name</label>
                    <input
                      type="text"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-600"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-600"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Contact</label>
                    <input
                      type="tel"
                      value={checkoutForm.contact}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setCheckoutForm(prev => ({ ...prev, contact: onlyDigits }));
                      }}
                      maxLength={10}
                      inputMode="numeric"
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-600"
                      placeholder="Enter contact number"
                    />
                  </div>
                  {checkoutFormError && (
                    <p className="text-xs text-red-600 font-medium">{checkoutFormError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const formError = validateCheckoutForm();
                      if (formError) {
                        setCheckoutFormError(formError);
                        return;
                      }
                      setCheckoutFormError('');
                      setCheckoutStep('confirm');
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-sm text-white ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS}`}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <p className="text-xs text-slate-500 uppercase font-bold">Final Price</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{priceInfo?.discountedPrice?.toLocaleString('en-IN') || 0}
                    </p>
                    {priceInfo?.originalPrice && priceInfo.originalPrice !== priceInfo.discountedPrice && (
                      <p className="text-sm text-slate-400 line-through">
                        ₹{priceInfo.originalPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 space-y-1">
                    <p><span className="font-semibold">Name:</span> {checkoutForm.name}</p>
                    <p><span className="font-semibold">Email:</span> {checkoutForm.email}</p>
                    <p><span className="font-semibold">Contact:</span> {checkoutForm.contact}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('form')}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProceedToCheckout(checkoutForm)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm text-white ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : `${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS}`}`}
                    >
                      {isProcessing ? 'Processing...' : 'ssss'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function CourseDetailPage({ courseData, onBack, onCourseClick, onAddToCart }) {
  // console.log('courseData', courseData);

  const { isAuthenticated, user } = useAuth();
  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      <CourseHeader courseData={courseData} onBack={onBack} onAddToCart={onAddToCart} />
      <CourseContent courseData={courseData} onAddToCart={onAddToCart} />
    </div>
  );
}

