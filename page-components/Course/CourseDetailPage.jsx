import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart } from 'lucide-react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../constants/Icons';
import { SYLLABUS_DATA } from '../../constants/data';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import CourseConfigModal from '../Home/sections/CourseConfigModal';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { ChevronLeft, ChevronRight } from "lucide-react";



const CourseHeader = ({ courseData, onBack, onAddToCart }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [allEmployee, setAllEmployee] = useState([]);
  // console.log('coursesData', courseData);
  // console.log('employeeList', allEmployee);

  // const Icons = {
  //   ChevronLeft,
  //   ChevronRight,
  // };
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
      : 'https://myeduneedsclass.netlify.app/';

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
              {carouselItems.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={handleCarouselPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={handleCarouselNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  >

                    <ChevronRight size={20} />
                  </button>
                </>
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
            <div className="flex items-center gap-6 py-4 border-y border-slate-200">
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
                src="https://placehold.co/100x100/164e33/FFF?text=MyEduNeeds"
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                alt="Faculty"
              /> */}
              <div>
                <div>
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

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [selectedValidity, setSelectedValidity] = useState(null);
  const [modes, setModes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [validityOptions, setValidityOptions] = useState([]);
  const [cartCourses, setCartCourses] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);


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
  // useEffect(() => {
  //   const fetchAllCourses = async () => {
  //     try {
  //       const response = await Network.getFreeCourseList(instId);
  //       setAllCourses(response.courses || []);
  //     } catch (error) {
  //       console.error('Error fetching courses:', error);
  //     }
  //   };

  // }, []);

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

  // Set modes from coursePricing
  useEffect(() => {
    if (!courseData?.coursePricing) return;

    const modeSet = new Set();
    courseData.coursePricing.forEach(pricing => {
      let modes = [];
      if (pricing.liveAccess) modes.push("Live Access");
      if (pricing.onlineContentAccess) modes.push("Recorded");
      if (pricing.offlineContentAccess) modes.push("Pendrive");
      if (pricing.faceToFaceAccess) modes.push("Face to Face");
      if (pricing.quizAccess) modes.push("Test-Series");
      if (modes.length) {
        modeSet.add(modes.join(" + "));
      }
    });

    const uniqueModes = Array.from(modeSet);
    setModes(uniqueModes);
    if (uniqueModes.length > 0) {
      setSelectedMode(uniqueModes[0]);
    }
  }, [courseData]);

  // Get variations based on selected mode - with useEffect to set state
  useEffect(() => {
    if (!selectedMode || !courseData?.coursePricing) return;

    const selectedModes = selectedMode.split(" + ");
    const filtered = courseData.coursePricing.filter(pricing => {
      const matchesSelection = (
        (selectedModes.includes("Live Access") ? pricing.liveAccess === true : pricing.liveAccess === null) &&
        (selectedModes.includes("Recorded") ? pricing.onlineContentAccess === true : pricing.onlineContentAccess === null) &&
        (selectedModes.includes("Pendrive") ? pricing.offlineContentAccess === true : pricing.offlineContentAccess === null) &&
        (selectedModes.includes("Face to Face") ? pricing.faceToFaceAccess === true : pricing.faceToFaceAccess === null) &&
        (selectedModes.includes("Test-Series") ? pricing.quizAccess === true : pricing.quizAccess === null)
      );
      return matchesSelection;
    });

    const variationSet = new Set();
    filtered.forEach(pricing => {
      if (pricing.variation) {
        variationSet.add(pricing.variation);
      }
    });

    const uniqueVariations = Array.from(variationSet);
    setVariations(uniqueVariations);
    if (uniqueVariations.length > 0) {
      setSelectedVariation(uniqueVariations[0]);
    } else {
      setSelectedVariation('');
    }
  }, [selectedMode, courseData]);

  // Get validity options based on selected mode and variation
  useEffect(() => {
    if (!selectedMode || !courseData?.coursePricing) return;

    const selectedModes = selectedMode.split(" + ");
    const filtered = courseData.coursePricing.filter(pricing => {
      const matchesSelection = (
        (selectedModes.includes("Live Access") ? pricing.liveAccess === true : pricing.liveAccess === null) &&
        (selectedModes.includes("Recorded") ? pricing.onlineContentAccess === true : pricing.onlineContentAccess === null) &&
        (selectedModes.includes("Pendrive") ? pricing.offlineContentAccess === true : pricing.offlineContentAccess === null) &&
        (selectedModes.includes("Face to Face") ? pricing.faceToFaceAccess === true : pricing.faceToFaceAccess === null) &&
        (selectedModes.includes("Test-Series") ? pricing.quizAccess === true : pricing.quizAccess === null)
      );
      const matchesVariation = selectedVariation ? pricing.variation === selectedVariation : true;
      return matchesSelection && matchesVariation;
    });

    setValidityOptions(filtered);
    if (filtered.length > 0) {
      setSelectedValidity(filtered[0]);
    }
  }, [selectedMode, selectedVariation, courseData]);

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

  // Calculate price based on selected validity (aligned with CourseConfigModal)
  const getSelectedPrice = () => {
    const pricingToUse = selectedValidity || (courseData?.coursePricing && courseData.coursePricing.length > 0
      ? courseData.coursePricing[0]
      : null);

    if (!pricingToUse) return null;

    const originalPrice = pricingToUse.price || 0;
    const discount = pricingToUse.discount || 0;
    const discountedPrice = Math.round(originalPrice - (originalPrice * discount / 100));

    return {
      originalPrice,
      discountedPrice,
      discount
    };
  };

  const priceInfo = getSelectedPrice();

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


  return (
    <section className="py-12 bg-white relative">
      <div className={LAYOUT_PADDING}>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className={`w-full ${suggestedCourses.length > 0 ? 'lg:w-7/12' : 'lg:w-8/12'}`}>
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
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-lg text-emerald-900 mb-4">Course Description</h3>
              <div
                className="display-none text-sm text-emerald-800 leading-relaxed break-words prose prose-sm max-w-none [&>*]:max-w-full [&_img]:max-w-full [&_table]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_*]:break-words"
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{
                  __html: courseData?.description || courseData?.longDescription || "No description available for this course."
                }}
              />
            </div>
          </div>
          <div className={`w-full ${suggestedCourses.length > 0 ? 'lg:w-5/12' : 'lg:w-4/12'} relative`}>
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
                </div>
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
                            : 'border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  {variations.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Variation</label>
                      <div className="flex flex-wrap gap-2">
                        {variations.map((variation) => (
                          <button
                            key={variation}
                            onClick={() => setSelectedVariation(variation)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all max-w-full break-words text-center leading-tight ${selectedVariation === variation
                              ? `border-2 ${BRAND_GREEN_CLASS} text-white`
                              : 'border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
                              }`}
                          >
                            {variation}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
                </div>
                {/* Pricing Summary - Same as CourseConfigModal */}
                {priceInfo && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                    <div className="space-y-2">
                      {priceInfo.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 line-through">₹{priceInfo.originalPrice.toLocaleString('en-IN')}</span>
                          <span className="text-xs font-bold text-emerald-600">{priceInfo.discount}% OFF</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Total Price</span>
                        <span className="text-2xl font-bold text-emerald-700">₹{priceInfo.discountedPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    const isInCart = cartCourses.some(item => item.id === courseData?.id);

                    if (isInCart) {
                      // Remove from cart
                      const updatedCart = cartCourses.filter(item => item.id !== courseData?.id);
                      setCartCourses(updatedCart);
                      localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
                      window.dispatchEvent(new Event('cartUpdated'));
                    } else {
                      // Add to cart directly with selected options (no modal)
                      const pricingToUse = selectedValidity || (courseData?.coursePricing && courseData.coursePricing.length > 0 ? courseData.coursePricing[0] : null);

                      if (!pricingToUse) return;

                      const cartItem = {
                        ...courseData,
                        pricingId: pricingToUse.id,
                        coursePricingId: pricingToUse.id,
                        selectedMode: selectedMode || '',
                        selectedVariation: selectedVariation || '',
                        selectedValidity: selectedValidity ? formatValidity(selectedValidity) : '',
                        finalPrice: Math.round(pricingToUse.price - (pricingToUse.price * (pricingToUse.discount || 0) / 100)),
                        originalPrice: pricingToUse.price,
                        discount: pricingToUse.discount || 0,
                        type: "Course"
                      };

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
                    }
                  }}
                  disabled={!selectedMode || !selectedValidity || !priceInfo}
                  className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${!selectedMode || !selectedValidity || !priceInfo
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : cartCourses.some(item => item.id === courseData?.id)
                      ? 'bg-slate-700 hover:bg-slate-800 text-white'
                      : `${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white`
                    }`}
                >
                  {cartCourses.some(item => item.id === courseData?.id) ? (
                    <>Remove from Cart <Icons.X /></>
                  ) : (
                    <>Enroll Now <Icons.Cart /></>
                  )}
                </button>
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
                  <p className="text-[10px] text-slate-600">Call us at +91 98765 43210</p>
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
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-emerald-400 overflow-hidden flex flex-col group max-w-sm"
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

