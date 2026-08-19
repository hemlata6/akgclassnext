import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';
import { useAuth } from '../../config/AuthContext';
import ProceedToCheckoutForm from './ProceedToCheckoutForm';
import LoginModal from '../../components/Auth/LoginModal';
import AppDownloadModal from '../../components/Modals/AppDownloadModal';
import axios from 'axios';
import instId from '../../config/instituteId';
import Endpoints, { BASE_URL } from '../../config/endpoints';
import { useStudent } from '../../config/StudentContext';
import { Dialog, DialogContent, IconButton } from '@mui/material';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user, authToken } = useAuth();
  const { studentData } = useStudent();
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResponse, setCheckoutResponse] = useState("");
  const [checkCoupon, setCheckCoupon] = useState([]);
  const [finalAmounts, setFinalAmounts] = useState(0);
  const [reedemCode, setReedemCode] = useState(false);
  const [couponNumber, setCouponNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [showErrorBar, setShowErrorBar] = useState(false);
  const [errorBarMessage, setErrorBarMessage] = useState('');
  const [showSuccessBar, setShowSuccessBar] = useState(false);
  const [successBarMessage, setSuccessBarMessage] = useState('');
  const [showMobilePaymentModal, setShowMobilePaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [mobileStudentData, setMobileStudentData] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [tokenFromUrl, setTokenFromUrl] = useState(null);

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
    // setShowCheckoutModal(false);
    setShowLoginModal(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return true;
  };

  // Build query string from route params to preserve across navigation
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (routeData) params.append('isMobile', routeData);
    if (tokenFromUrl) params.append('token', tokenFromUrl);
    const queryStr = params.toString();
    return queryStr ? `?${queryStr}` : '';
  };

  const queryString = getQueryString();

  // Check if we should hide global footer
  const shouldHideGlobalControls = !!(routeData || tokenFromUrl);

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

  // Fetch student details when mobile parameters are present
  useEffect(() => {
    fetchMobileStudentData();
  }, [routeData, tokenFromUrl]);

  const fetchMobileStudentData = async () => {
    if (routeData && tokenFromUrl) {
      try {
        const response = await axios.get(
          `${Endpoints.baseURL}student/fetch-details`,
          { headers: { "X-Auth": tokenFromUrl } }
        );

        if (response.data?.student) {
          const student = response.data.student;
          setMobileStudentData({
            firstName: student.firstName,
            lastName: student.lastName,
            fullName: student.firstName + ' ' + student.lastName,
            contact: student.contact || student.phone,
            email: student.email
          });
        }
      } catch (error) {
        console.error('Error fetching mobile student data:', error);
      }
    }
  };

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cartCourses');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartItems(Array.isArray(cart) ? cart : []);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartItems([]);
        }
      }
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Auto-dismiss error bar after 5 seconds
  useEffect(() => {
    if (!showErrorBar) return;
    const timer = setTimeout(() => setShowErrorBar(false), 5000);
    return () => clearTimeout(timer);
  }, [showErrorBar]);

  // Auto-dismiss success bar after 5 seconds
  useEffect(() => {
    if (!showSuccessBar) return;
    const timer = setTimeout(() => setShowSuccessBar(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccessBar]);

  // Prevent body scroll when mobile payment modal is open
  useEffect(() => {
    if (showMobilePaymentModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showMobilePaymentModal]);

  const parsePrice = (priceValue) => {
    if (typeof priceValue === 'number') return priceValue;
    if (typeof priceValue === 'string') return parseInt(priceValue.replace(/[^0-9]/g, ''), 10);
    return 0;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.finalPrice || item.price), 0);
  const total = subtotal - discountAmount;

  // Update checkCoupon array when cart changes
  useEffect(() => {
    if (cartItems?.length > 0) {
      const updatedTotal = cartItems.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0);
      const checkCouponArray = cartItems.map(item => ({
        purchaseType: item.isDripCourse ? "courseContent" : "course",
        entityId: item?.id
      }));
      setCheckCoupon(checkCouponArray);
      setFinalAmounts(updatedTotal);
    } else {
      setFinalAmounts(0);
      setCheckCoupon([]);
    }
  }, [cartItems]);

  // Payment polling - check payment status every 5 seconds
  useEffect(() => {
    if (!checkoutResponse?.transactionId) {
      // console.log('Payment polling stopped - Drawer/Modal closed or no transaction ID');
      return;
    }

    const intervalApi = setInterval(() => {
      FetchBillPayment();
    }, 5000);

    return () => {
      clearInterval(intervalApi);
      // console.log('Payment polling interval cleared');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutResponse?.transactionId]);

  const getColor = () => {
    if (isCouponValid === null) return '#1e40af';
    return isCouponValid ? '#16a34a' : '#dc2626';
  };

  const handleReedemCode = () => {
    setReedemCode(!reedemCode);
  };

  const handleCoupon = (e) => {
    setCouponNumber(e.target.value);
    setErrorMessage('');
    setIsCouponValid(null);
  };

  const handleCheckCoupon = async (e) => {
    e.preventDefault();
    const body = {
      getCheckoutUrls: checkCoupon,
      coupon: couponNumber,
      contact: Number(studentData?.contact || studentData?.phone),
      instId: instId,
      amount: finalAmounts
    };
    try {
      const response = await axios.post(`${BASE_URL}student/coupon/verify`, body);
      if (response.data.errorCode === 0) {
        setIsCouponValid(response.data?.valid);
        if (response.data?.valid) {
          setShowSuccessBar(true);
          setSuccessBarMessage("✓ Coupon applied successfully!");
          if (response.data?.discount) {
            setDiscountAmount(response.data.discount);
          }
        } else {
          setShowErrorBar(true);
          setErrorBarMessage("Invalid coupon code");
          setDiscountAmount(0);
        }
        setErrorMessage("");
      } else {
        if (handleLogoutError(response.data?.errorCode, response.data?.errorDescription)) return;
        setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
        const msg = response.data?.message ? response.data?.message : "Invalid Coupon Code";
        setErrorMessage(msg);
        setShowErrorBar(true);
        setErrorBarMessage(msg);
        setDiscountAmount(0);
      }
    } catch (err) {
      console.log(err);
      if (handleLogoutError(err?.response?.data?.errorCode, err?.response?.data?.errorDescription)) return;
      setIsCouponValid(false);
      setErrorMessage("Failed to verify coupon");
      setShowErrorBar(true);
      setErrorBarMessage("Failed to verify coupon");
      setDiscountAmount(0);
    }
  };

  const FetchBillPayment = async () => {
    try {
      const response = await axios.get(
        `${Endpoints.baseURL}payment/check-payment-status/${checkoutResponse?.transactionId}`,
        { headers: { "Authorization": `Bearer ${authToken}` } }
      );

      if (response?.data?.paymentStatus === "successful") {

        if (isAuthenticated && authToken) {
          setTimeout(() => {
            router.push('/my-purchases');
          }, 1000);
        } else {
          setTimeout(() => {
            setShowAppDownloadModal(true);
          }, 1000);
        }

        // setShowMobilePaymentModal(false);
        // setPaymentDrawerOpen(false);
        setPaymentUrl('');
        window.dispatchEvent(new Event('showFooter'));
        handleClearCart();
        setSuccessBarMessage('Payment successful! Thank you for your purchase.');
        setShowSuccessBar(true);

      } else if (response?.data?.paymentStatus === 'pending') {
        // console.log('⏳ Payment still pending...');
      } else if (response?.data?.paymentStatus === 'failed') {
        // console.error('✗ PAYMENT FAILED');
        // setPaymentDrawerOpen(false);
        // alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  const handleClearCart = () => {
    localStorage.removeItem('cartCourses');
    localStorage.removeItem('purchaseArray');
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // const handlePublicCheckout = async (checkoutData) => {
  //   try {
  //     const body = {
  //       firstName: checkoutData.firstName,
  //       lastName: checkoutData.lastName,
  //       contact: checkoutData.contact,
  //       email: checkoutData.email,
  //       instId: instId,
  //       campaignId: null,
  //       coupon: checkoutData.coupon,
  //       coursePricingId: 0,
  //       entityModals: checkoutData.entityModals
  //     };

  //     // Call public checkout API
  //     const response = await axios.post(
  //       `${BASE_URL}/admin/payment/fetch-public-checkout-url`,
  //       body
  //     );

  //     if (response?.data?.status === true && response?.data?.url) {
  //       // Close checkout modal
  //       setShowCheckoutModal(false);

  //       // Store checkout response for payment polling
  //       setCheckoutResponse(response?.data);

  //       const isMobile = window.innerWidth <= 768;

  //       if (isMobile) {
  //         setPaymentUrl(response.data.url);
  //         setShowMobilePaymentModal(true);
  //         setPaymentDrawerOpen(true);
  //         window.dispatchEvent(new Event('hideFooter'));
  //       } else {
  //         // Open payment URL in popup for desktop
  //         const width = 480;
  //         const height = 1080;
  //         const left = window.screenX + (window.outerWidth / 2) - (width / 2);
  //         const top = window.screenY + (window.outerHeight / 2) - (height / 2);

  //         window.open(
  //           response.data.url,
  //           'payment',
  //           `location=no,width=${width},height=${height},top=${top},left=${left}`
  //         );

  //         // Start payment polling
  //         setPaymentDrawerOpen(true);
  //       }

  //       // Check if should show login modal after checkout
  //       if (!isAuthenticated && !authToken) {
  //         setTimeout(() => {
  //           setShowLoginModal(true);
  //         }, 500);
  //       } else {
  //         setTimeout(() => {
  //           router.push('/my-purchases');
  //         }, 1000);
  //       }
  //       // Post-payment: redirect authenticated users, show app download for guests
  //       // if (isAuthenticated && authToken) {
  //       //   setTimeout(() => {
  //       //     router.push('/my-purchases');
  //       //   }, 1000);
  //       // } else {
  //       //   setTimeout(() => {
  //       //     setShowAppDownloadModal(true);
  //       //   }, 1000);
  //       // }
  //     } else {
  //       if (handleLogoutError(response?.data?.errorCode, response?.data?.errorDescription)) return;
  //       const errorMsg = response?.data?.errorDescription || response?.data?.message || 'Failed to generate checkout URL. Please try again.';
  //       setErrorBarMessage(errorMsg);
  //       setShowErrorBar(true);
  //       setShowCheckoutModal(false);
  //     }
  //   } catch (error) {
  //     console.error('Public checkout error:', error);
  //     if (handleLogoutError(error?.response?.data?.errorCode, error?.response?.data?.errorDescription)) return;
  //     const errorMsg = error?.response?.data?.errorDescription || error?.response?.data?.message || 'An error occurred during checkout. Please try again.';
  //     setErrorBarMessage(errorMsg);
  //     setShowErrorBar(true);
  //     setShowCheckoutModal(false);
  //   }
  // };

  // console.log('checkoutResponse', checkoutResponse);
  // console.log('checkoutResponse', checkoutResponse);

  const handleProceedToCheckout = async () => {

    // console.log('Proceeding to checkout with params - isAuthenticated:', isAuthenticated, 'authToken:', authToken, 'tokenFromUrl:', tokenFromUrl);

    if (queryString) {
      // Mobile mode (query params) - always call API with tokenParam
      setIsProcessing(true);
      try {
        const entityModals = cartItems.map(item => ({
          purchaseType: item.isDripCourse ? "courseContent" : "course",
          entityId: item.id,
          campusId: 0,
          courseId: 0,
          coursePricingId: item.coursePricingId || item.pricingId || 0
        }));

        const mobileBody = {
          "getCheckoutUrls": entityModals,
          "coupon": isCouponValid ? couponNumber : ""
        };

        const response = await axios.post(
          `${BASE_URL}payment/get-checkout-url`,
          mobileBody,
          { headers: { "X-Auth": tokenFromUrl } }
        );

        // console.log('Mobile checkout response:', response);


        if (response?.data?.status === true && response?.data?.url) {
          setCheckoutResponse(response?.data);
          // Post-payment: redirect authenticated users, show app download for guests
          // if (isAuthenticated && authToken) {
          //   setTimeout(() => {
          //     router.push('/my-purchases');
          //   }, 1000);
          // } else {
          //   setTimeout(() => {
          //     setShowAppDownloadModal(true);
          //   }, 1000);
          // }
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

            // Post-payment: redirect authenticated users, show app download for guests
            // if (isAuthenticated && authToken) {
            //   setTimeout(() => {
            //     router.push('/my-purchases');
            //   }, 1000);
            // } else {
            //   setTimeout(() => {
            //     setShowAppDownloadModal(true);
            //   }, 1000);
            // }

            // setPaymentDrawerOpen(true);
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

    if (isAuthenticated && authToken) {
      // User is logged in - call API directly
      setIsProcessing(true);
      try {
        const entityModals = cartItems.map(item => ({
          purchaseType: item.isDripCourse ? "courseContent" : "course",
          entityId: item.id,
          campusId: 0,
          courseId: 0,
          coursePricingId: item.coursePricingId || item.pricingId || 0
        }));

        // const body = {
        //   firstName: studentData?.firstName || studentData?.name?.split(' ')[0] || 'User',
        //   lastName: studentData?.lastName || studentData?.name?.split(' ').slice(1).join(' ') || '',
        //   contact: studentData?.contact || studentData?.phone || '',
        //   email: studentData?.email || '',
        //   instId: instId,
        //   campaignId: null,
        //   coupon: isCouponValid ? couponNumber : "",
        //   coursePricingId: 0,
        //   entityModals
        // };

        const mobileBody = {
          "getCheckoutUrls": entityModals,
          "coupon": ""
        }

        // Call authenticated checkout API
        const response = await axios.post(
          `${BASE_URL}payment/get-checkout-url`,
          mobileBody,
          { headers: { "X-Auth": authToken } }
        );

        if (response?.data?.status === true && response?.data?.url) {
          // Store checkout response for payment polling
          setCheckoutResponse(response?.data);

          // console.log('✓ PAYMENT SUCCESSFUL - Clearing cart 99');
          // Post-payment: redirect authenticated users, show app download for guests
          // if (isAuthenticated && authToken) {
          //   setTimeout(() => {
          //     router.push('/my-purchases');
          //   }, 1000);
          // } else {
          //   setTimeout(() => {
          //     setShowAppDownloadModal(true);
          //   }, 1000);
          // }

          // Check if mobile device
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

            // console.log('✓ PAYMENT SUCCESSFUL - Clearing cart 99999');
            // Post-payment: redirect authenticated users, show app download for guests
            // if (isAuthenticated && authToken) {
            //   setTimeout(() => {
            //     router.push('/my-purchases');
            //   }, 1000);
            // } else {
            //   setTimeout(() => {
            //     setShowAppDownloadModal(true);
            //   }, 1000);
            // }

            window.open(
              response.data.url,
              'payment',
              `location=no,width=${width},height=${height},top=${top},left=${left}`
            );

            // Start payment polling for desktop
            // setPaymentDrawerOpen(true);
          }

          // Don't clear cart here - will be cleared after successful payment
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
      // User is not authenticated - show checkout modal
      // setShowCheckoutModal(true);
      setShowLoginModal(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {shouldHideGlobalControls && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => router.push(`/store${getQueryString()}`)}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Store
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added any courses or books yet.</p>
          <button
            onClick={() => {
              const destination = routeData ? '/store' : '/';
              router.push(destination + getQueryString());
            }}
            className={`${BRAND_GREEN_CLASS} text-white px-8 py-3 rounded-xl font-bold hover:-translate-y-1 transition-all shadow-lg`}
          >
            {routeData ? 'Back to Store' : 'Start Shopping'}
          </button>
        </div>
        {!shouldHideGlobalControls && <Footer />}
      </div>
    );
  }

  // console.log('cartItems', cartItems);


  return (
    <div className="bg-slate-50 min-h-screen md:pb-0">
      {shouldHideGlobalControls && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => router.push(`/store${getQueryString()}`)}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Store
            </button>
          </div>
        </div>
      )}
      <div className={`py-12 ${LAYOUT_PADDING}`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Cart ({cartItems.length})</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-center shadow-sm">
                <div className="h-20 w-20 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={item?.logo ? `${Endpoints?.mediaBaseUrl}${item.logo}` : item.type === 'Book' ? "https://placehold.co/100x100/164e33/FFF?text=Book" : "https://placehold.co/100x100/164e33/FFF?text=Course"}
                    className="w-full h-full object-contain"
                    alt="Product"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        {item.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    {
                      item?.type === 'Course' ?
                        <div className="text-xs text-slate-500">
                          {item.selectedMode && <div>Mode: {item.selectedMode}</div>}
                          {item.selectedVariation && <div>Variation: {item.selectedVariation}</div>}
                          {item.selectedValidity && <div>Validity: {item.selectedValidity}</div>}
                          {(() => {
                            const watchTime = item.watchTime || item.coursePricing?.[0]?.watchTime;
                            return <div>Watch Time: {watchTime && watchTime !== "Unlimited" ? `${watchTime}` : "Unlimited"}</div>;
                          })()}
                        </div> : <></>
                    }

                    <div className="font-bold text-lg text-slate-900">₹{(item.finalPrice || parsePrice(item.price)).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-4/12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                {
                  user && (
                    <button
                      onClick={handleReedemCode}
                      className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 mb-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {reedemCode ? 'Hide' : 'Have a'} Coupon Code
                    </button>
                  )
                }
                {reedemCode && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponNumber}
                        onChange={handleCoupon}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={handleCheckCoupon}
                        disabled={!couponNumber || !studentData?.contact}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isCouponValid === true
                          ? 'bg-indigo-600 text-white hover:bg-indigo-800'
                          : 'bg-indigo-700 text-white hover:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed'
                          }`}
                      >
                        {isCouponValid === true ? (
                          <span className="flex items-center gap-1">
                            <Icons.Check /> Applied
                          </span>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {errorMessage && (
                      <p className="text-xs text-red-600">{errorMessage}</p>
                    )}
                    {isCouponValid === true && discountAmount > 0 && (
                      <p className="text-xs text-green-600 font-semibold">
                        ✓ Coupon applied! You saved ₹{discountAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>


              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="font-bold text-2xl text-emerald-700">₹{total.toLocaleString()}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                disabled={isProcessing}
                className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Pay <Icons.ChevronRight />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-3">Secure Payment via Razorpay</p>
            </div>
          </div>
        </div>
      </div>
      {!shouldHideGlobalControls && <Footer />}

      {/* Checkout Modal */}
      <Dialog
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            margin: 2
          }
        }}
      >
        <ProceedToCheckoutForm
          cartCourses={cartItems}
          onClose={() => setShowCheckoutModal(false)}
          totalAmount={total}
        />
      </Dialog>

      {/* <Dialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            margin: 2
          }
        }}
      ></Dialog> */}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        isAuthenticated={isAuthenticated}
      />

      {/* App Download Modal */}
      <AppDownloadModal
        open={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
      />

      {/* Mobile Payment Dialog */}
      <Dialog
        open={showMobilePaymentModal}
        onClose={() => {
          setShowMobilePaymentModal(false);
          setPaymentUrl('');
          // setPaymentDrawerOpen(false);
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
    </div>
  );
}
