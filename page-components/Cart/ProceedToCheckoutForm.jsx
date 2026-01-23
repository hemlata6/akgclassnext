import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../config/AuthContext';
import { useStudent } from '../../config/StudentContext';
import { Icons, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../constants/Icons';
import axios from 'axios';
import instId from '../../config/instituteId';
import Endpoints, { BASE_URL } from '../../config/endpoints';

const ProceedToCheckoutForm = ({ cartCourses, onClose, totalAmount, onShowLogin, setCartItems }) => {
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

    // Payment polling - check payment status every 5 seconds
    useEffect(() => {
        if (!paymentDrawerOpen || !checkoutResponse?.transactionId) {
            console.log('Payment polling stopped - Drawer closed or no transaction ID');
            return;
        }

        const intervalApi = setInterval(() => {
            FetchBillPayment();
        }, 5000);

        return () => {
            clearInterval(intervalApi);
            console.log('Payment polling interval cleared');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentDrawerOpen, checkoutResponse?.transactionId]);

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
            console.log('💳 Payment Status Response:', response);

            if (response?.data?.paymentStatus === "successful") {
                console.log('✓ PAYMENT SUCCESSFUL - Clearing cart');
                handleClearCart();
                setPaymentDrawerOpen(false);
                onClose();
                // alert('Payment successful! Thank you for your purchase.');
            } else if (response?.data?.paymentStatus === 'pending') {
                console.log('⏳ Payment still pending...');
            } else if (response?.data?.paymentStatus === 'failed') {
                console.error('✗ PAYMENT FAILED');
                setPaymentDrawerOpen(false);
                // alert('Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
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
                setErrorMessage("");
            } else {
                setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
                setErrorMessage(response.data?.message ? response.data?.message : "Invalid Coupon Code");
            }
        } catch (err) {
            console.log(err);
            setIsCouponValid(false);
            setErrorMessage("Failed to verify coupon");
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

    console.log('payloadCart', payloadCart, cartCourses);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare payload
            const nameParts = formData.fullName.split(' ');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts.slice(1).join(' ') || '';

            const body = {
                firstName,
                lastName,
                contact: formData.phone,
                email: formData.email,
                instId: instId,
                campaignId: null,
                coupon: isCouponValid ? couponNumber : "",
                coursePricingId: 0,
                entityModals: payloadCart
            };

            // Call checkout API
            const response = await axios.post(
                `${BASE_URL}/admin/payment/fetch-public-checkout-url`,
                body
            );

            if (response?.data?.status === true && response?.data?.url) {
                // Store checkout response for payment polling
                setCheckoutResponse(response?.data);

                // Open payment URL in popup
                const width = 480;
                const height = 1080;
                const left = window.screenX + (window.outerWidth / 2) - (width / 2);
                const top = window.screenY + (window.outerHeight / 2) - (height / 2);

                window.open(
                    response.data.url,
                    'payment',
                    `location=no,width=${width},height=${height},top=${top},left=${left}`
                );

                // Start payment polling
                setPaymentDrawerOpen(true);

                // Clear form
                setFormData({ fullName: '', email: '', phone: '' });
                // Don't close modal or clear cart here - will be handled after successful payment

                // Redirect back with URL parameters if they exist
                const routeData = new URLSearchParams(window.location.search).get('isMobile');
                if (urlParams.studentName || urlParams.contact || urlParams.email) {
                    let queryParams = [];
                    if (routeData) queryParams.push(`isMobile=${routeData}`);
                    if (urlParams.studentName) queryParams.push(`studentname=${encodeURIComponent(urlParams.studentName)}`);
                    if (urlParams.contact) queryParams.push(`contact=${urlParams.contact}`);
                    if (urlParams.email) queryParams.push(`email=${encodeURIComponent(urlParams.email)}`);
                    router.push(`/?${queryParams.join('&')}`);
                } else if (!authToken && !isAuthenticated) {
                    if (onShowLogin) {
                        onShowLogin();
                        handleClearCart();
                    }
                }
            } else {
                alert('Failed to generate checkout URL. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
        </div>
    );
};

export default ProceedToCheckoutForm;

