import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';
import { useAuth } from '../../config/AuthContext';
import ProceedToCheckoutForm from './ProceedToCheckoutForm';
import LoginModal from '../../components/Auth/LoginModal';
import axios from 'axios';
import instId from '../../config/instituteId';
import Endpoints, { BASE_URL } from '../../config/endpoints';
import { useStudent } from '../../config/StudentContext';

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
        setErrorMessage("");
        if (response.data?.valid && response.data?.discountAmount) {
          setDiscountAmount(response.data.discountAmount);
        } else {
          setDiscountAmount(0);
        }
      } else {
        setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
        setErrorMessage(response.data?.message ? response.data?.message : "Invalid Coupon Code");
        setDiscountAmount(0);
      }
    } catch (err) {
      console.log(err);
      setIsCouponValid(false);
      setErrorMessage("Failed to verify coupon");
      setDiscountAmount(0);
    }
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
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
    console.log('Cart cleared');
  };

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleProceedToCheckout = async () => {
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

        const body = {
          firstName: studentData?.firstName || studentData?.name?.split(' ')[0] || 'User',
          lastName: studentData?.lastName || studentData?.name?.split(' ').slice(1).join(' ') || '',
          contact: studentData?.contact || studentData?.phone || '',
          email: studentData?.email || '',
          instId: instId,
          campaignId: null,
          coupon: isCouponValid ? couponNumber : "",
          coursePricingId: 0,
          entityModals
        };

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

          // Don't clear cart here - will be cleared after successful payment
        } else {
          // alert('Failed to generate checkout URL. Please try again.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        // alert('An error occurred during checkout. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // User is not logged in - show modal
      setShowCheckoutModal(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added any courses or books yet.</p>
          <button
            onClick={() => router.push('/')}
            className={`${BRAND_GREEN_CLASS} text-white px-8 py-3 rounded-xl font-bold hover:-translate-y-1 transition-all shadow-lg`}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen md:pb-0">
      <div className={`py-12 ${LAYOUT_PADDING}`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart ({cartItems.length})</h1>
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
                    <div className="text-xs text-slate-500">
                      {item.selectedMode && <div>Mode: {item.selectedMode}</div>}
                      {item.selectedValidity && <div>Validity: {item.selectedValidity}</div>}
                      {(() => {
                        const watchTime = item.watchTime || item.coursePricing?.[0]?.watchTime;
                        return <div>Watch Time: {watchTime && watchTime !== "Unlimited" ? `${watchTime}` : "Unlimited"}</div>;
                      })()}
                    </div>
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
                <button
                  onClick={handleReedemCode}
                  className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1 mb-2"
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
                        onClick={handleCheckCoupon}
                        disabled={!couponNumber || !studentData?.contact}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isCouponValid === true
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed'
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
      <Footer />

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <ProceedToCheckoutForm
        setCartItems={setCartItems}
          cartCourses={cartItems}
          onClose={() => setShowCheckoutModal(false)}
          totalAmount={total}
          onShowLogin={() => {
            setShowCheckoutModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
