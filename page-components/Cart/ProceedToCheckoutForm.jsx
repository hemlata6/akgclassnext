import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../config/AuthContext';
import { useStudent } from '../../config/StudentContext';
import { Icons, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../constants/Icons';
import axios from 'axios';
import instId from '../../config/instituteId';
import Endpoints, { BASE_URL } from '../../config/endpoints';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import AppDownloadModal from '../../components/Modals/AppDownloadModal';
import LoginModal from '@/components/Auth/LoginModal';

const ProceedToCheckoutForm = ({ cartCourses, onClose, totalAmount }) => {
    const router = useRouter();

    const { isAuthenticated, user, authToken } = useAuth();
    const { studentData } = useStudent();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payloadCart, setPayloadCart] = useState([]);
    const [checkCoupon, setCheckCoupon] = useState([]);
    const [finalAmounts, setFinalAmounts] = useState(0);
    const [reedemCode, setReedemCode] = useState(false);
    const [couponNumber, setCouponNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCouponValid, setIsCouponValid] = useState(null);
    const [urlParams, setUrlParams] = useState({ studentName: null, contact: null, email: null });
    const [checkoutResponse, setCheckoutResponse] = useState(null);
    const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [showErrorBar, setShowErrorBar] = useState(false);
    const [errorBarMessage, setErrorBarMessage] = useState('');
    const [showSuccessBar, setShowSuccessBar] = useState(false);
    const [successBarMessage, setSuccessBarMessage] = useState('');
    const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Extract URL parameters
        const urlStudentName = new URLSearchParams(window.location.search).get('studentname');
        const urlContact = new URLSearchParams(window.location.search).get('contact');
        const urlEmail = new URLSearchParams(window.location.search).get('email');

        // Store URL parameters
        setUrlParams({
            studentName: urlStudentName,
            contact: urlContact,
            email: urlEmail
        });

        // Auto-populate form from URL params, authenticated user, or studentData
        if (urlStudentName) {
            setFormData(prev => ({ ...prev, fullName: urlStudentName }));
        } else if (isAuthenticated) {
            setFormData(prev => ({
                ...prev,
                fullName: (studentData?.firstName && studentData?.lastName)
                    ? `${studentData.firstName} ${studentData.lastName}`
                    : user?.name || ''
            }));
        }

        if (urlEmail) {
            setFormData(prev => ({ ...prev, email: urlEmail }));
        } else if (isAuthenticated) {
            setFormData(prev => ({ ...prev, email: studentData?.email || user?.email || '' }));
        }

        if (urlContact) {
            setFormData(prev => ({ ...prev, phone: urlContact }));
        } else if (isAuthenticated) {
            setFormData(prev => ({ ...prev, phone: studentData?.contact || user?.phone || '' }));
        }
    }, [isAuthenticated, user, studentData]);

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

    // Prevent body scroll when payment drawer is open
    // useEffect(() => {
    //     if (paymentDrawerOpen) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'unset';
    //     }
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [paymentDrawerOpen]);

    useEffect(() => {
        if (cartCourses?.length > 0) {
            const updatedTotal = cartCourses.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0);

            const updatedPurchaseArray = [];
            const checkCouponArray = [];

            // Separate regular courses and test series courses
            cartCourses.forEach(item => {
                if (item.isDripCourse) {
                    checkCouponArray.push({
                        "purchaseType": "courseContent",
                        "entityId": item?.id
                    });
                } else {
                    updatedPurchaseArray.push({
                        "purchaseType": "course",
                        "entityId": item?.id,
                        "campusId": 0,
                        "courseId": 0,
                        "coursePricingId": item.coursePricingId || item.pricingId || 0
                    });
                    checkCouponArray.push({
                        "purchaseType": "course",
                        "entityId": item?.id
                    });
                }
            });

            // Add test series courses from purchaseArray in localStorage
            const purchaseArray = localStorage.getItem('purchaseArray');
            if (purchaseArray) {
                try {
                    const parsedArray = JSON.parse(purchaseArray);
                    if (Array.isArray(parsedArray)) {
                        parsedArray.forEach(item => {
                            updatedPurchaseArray.push({
                                "purchaseType": item.purchaseType || "courseContent",
                                "entityId": item.entityId || 0
                            });
                        });
                    }
                } catch (error) {
                    console.error('Error parsing purchaseArray:', error);
                }
            }

            setCheckCoupon(checkCouponArray);
            setPayloadCart(updatedPurchaseArray);
            setFinalAmounts(updatedTotal);
        } else {
            setFinalAmounts(0);
            setPayloadCart([]);
        }
    }, [cartCourses]);

    // console.log('isAuthenticated', isAuthenticated , 'authToken', authToken);

    // Payment polling - check payment status every 5 seconds
    useEffect(() => {
        // console.log('======', checkoutResponse);
        if (!checkoutResponse?.transactionId) {
            // console.log('Payment polling stopped - Drawer closed or no transaction ID');
            return;
        }

        const intervalApi = setInterval(() => {
            FetchBillPayment();
        }, 5000);

        return () => {
            clearInterval(intervalApi);
            // console.log('Payment polling interval cleared');
        };
    }, [checkoutResponse?.transactionId, isAuthenticated, authToken]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const FetchBillPayment = async () => {
        try {
            const response = await axios.get(
                `${Endpoints.baseURL}payment/check-payment-status/${checkoutResponse?.transactionId}`,
                { headers: { "Authorization": `Bearer ${authToken}` } }
            );
            // console.log('💳 Payment Status Response:', response?.data?.paymentStatus);

            if (response?.data?.paymentStatus === "successful") {
                // console.log('✓ PAYMENT SUCCESSFUL - Clearing cart');
                setShowSuccessBar(true);
                setSuccessBarMessage('Payment successful! Thank you for your purchase.');
                handleClearCart();
                setTimeout(() => {
                    // onClose();
                    // setPaymentDrawerOpen(false);
                    // console.log('Auth check - isAuthenticated:', isAuthenticated, 'authToken:', !!authToken);
                    if (isAuthenticated && authToken) {
                        // console.log('✓ User authenticated, redirecting to my-purchases');
                        router.push('/my-purchases');
                        // onClose();
                    } else {
                        // console.log('✓ User not authenticated, showing login modal');
                        setShowLoginModal(true);
                        // onClose();
                    }
                }, 2000);
            } else if (response?.data?.paymentStatus === 'pending') {
                // console.log('⏳ Payment still pending...');
            } else if (response?.data?.paymentStatus === 'failed') {
                // console.error('✗ PAYMENT FAILED');
                setShowErrorBar(true);
                setErrorBarMessage('Payment failed. Please try again.');
                // setPaymentDrawerOpen(false);
            }
        } catch (err) {
            // console.error('Error checking payment status:', err);
        }
    };

    const handleClearCart = () => {
        localStorage.removeItem('cartCourses');
        localStorage.removeItem('purchaseArray');
        window.dispatchEvent(new Event('cartUpdated'));
        // setCartItems([]);
        console.log('Cart cleared');
    };

    const handleCheckCoupon = async (e) => {
        e.preventDefault();
        const body = {
            "getCheckoutUrls": checkCoupon,
            "coupon": couponNumber,
            "contact": Number(formData.phone),
            "instId": instId,
            "amount": finalAmounts
        };
        try {
            const response = await axios.post(`${BASE_URL}/student/coupon/verify`, body);
            if (response.data.errorCode === 0) {
                setIsCouponValid(response.data?.valid);
                if (response.data?.valid) {
                    setShowSuccessBar(true);
                    setSuccessBarMessage("✓ Coupon applied successfully!");
                } else {
                    setShowErrorBar(true);
                    setErrorBarMessage("Invalid coupon code");
                }
                setErrorMessage("");
            } else {
                setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
                const msg = response.data?.message ? response.data?.message : "Invalid Coupon Code";
                setErrorMessage(msg);
                setShowErrorBar(true);
                setErrorBarMessage(msg);
            }
        } catch (err) {
            console.log(err);
            setIsCouponValid(false);
            setErrorMessage("Failed to verify coupon");
            setShowErrorBar(true);
            setErrorBarMessage("Failed to verify coupon");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For phone, only allow digits and max 10
        if (name === 'phone') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: value }));
                if (errors[name]) {
                    setErrors(prev => ({ ...prev, [name]: '' }));
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };


    // console.log('payloadCart', payloadCart, cartCourses);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const nameParts = formData.fullName.split(' ');
            const body = {
                firstName: nameParts[0] || 'User',
                lastName: nameParts.slice(1).join(' ') || '',
                contact: formData.phone,
                email: formData.email,
                instId: instId,
                campaignId: null,
                coupon: isCouponValid ? couponNumber : "",
                coursePricingId: 0,
                entityModals: payloadCart
            };

            const response = await axios.post(
                `${BASE_URL}/admin/payment/fetch-public-checkout-url`,
                body
            );

            if (response?.data?.status === true && response?.data?.url) {
                setCheckoutResponse(response.data);

                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    setPaymentUrl(response.data.url);
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
                    // setPaymentDrawerOpen(true);
                }
            } else {
                const errorMsg = response?.data?.errorDescription || response?.data?.message || 'Failed to generate checkout URL. Please try again.';
                setErrorBarMessage(errorMsg);
                setShowErrorBar(true);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMsg = error?.response?.data?.errorDescription || error?.response?.data?.message || 'An error occurred during checkout. Please try again.';
            setErrorBarMessage(errorMsg);
            setShowErrorBar(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {!showAppDownloadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className={`${BRAND_GREEN_CLASS} p-6 rounded-t-2xl relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
                    >
                        <Icons.X className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-4">
                            <Icons.CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Checkout Details</h2>
                        <p className="text-white/90 text-sm">Complete your payment to unlock your courses</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Full Name *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full p-3 pl-10 bg-slate-50 border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} rounded-lg text-sm outline-none focus:border-emerald-500 focus:bg-white transition`}
                            />
                            <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Email Address *
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full p-3 pl-10 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg text-sm outline-none focus:border-emerald-500 focus:bg-white transition`}
                            />
                            <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Phone Number *
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                                className={`w-full p-3 pl-10 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg text-sm outline-none focus:border-emerald-500 focus:bg-white transition`}
                            />
                            <Icons.Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Coupon Section */}
                    {
                        user && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleReedemCode}
                                    className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 mb-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {reedemCode ? 'Hide' : 'Have a'} Coupon Code
                                </button>
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
                                                type="button"
                                                onClick={handleCheckCoupon}
                                                disabled={!couponNumber || !formData.phone}
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
                                        {isCouponValid === true && (
                                            <p className="text-xs text-green-600 font-semibold">
                                                ✓ Coupon applied successfully!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* Total Amount */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700">Total Amount</span>
                            <span className="text-2xl font-bold text-emerald-700">₹{(finalAmounts || totalAmount).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
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

                    <p className="text-xs text-center text-slate-400 mt-3">
                        Secure Payment via Razorpay • 256-bit SSL Encrypted
                    </p>
                </form>
            </div>

            {/* Payment Dialog */}
            <Dialog
                open={paymentDrawerOpen}
                onClose={() => setPaymentDrawerOpen(false)}
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
                            setPaymentDrawerOpen(false);
                            setPaymentUrl('');
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
            )}

            {/* <AppDownloadModal
                open={showAppDownloadModal}
                onClose={handleAppDownloadModalClose}
            /> */}

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                afterCheckout={true}
            />
        </>
    );
};

export default ProceedToCheckoutForm;

