import React, { useState, useEffect } from 'react';
import { LogIn, Phone, MessageCircle, Timer, Sparkles, X, MapPin } from 'lucide-react';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { useAuth } from '../../config/AuthContext';
import { useStudent } from '../../config/StudentContext';
import { useTheme } from '../../config/ThemeContext';
import SignupModal from './SignupModal';

const LoginModal = ({ isOpen, onClose, onSignupClick, afterCheckout }) => {
  const { login, stateList} = useAuth();
  const { setStudentAuth, studentData, updateStudentData, authToken} = useStudent();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [openSignUpModel, setOpenSignUpModal] = useState(false);

  // Address form state
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    zipCode: '',
    address: '',
    stateName: '',
    cityId: '',
    cityName: ''
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  // const [stateList, setStateList] = useState([]);

  const handleNavigate = () => {
    if (afterCheckout) {
      window.location.href = '/my-purchases';
    } else {
      // window.location.href = '/';
    }
  };

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fetch states list
  // useEffect(() => {
  //   const fetchStates = async () => {
  //     try {
  //       const response = await Network.getStates();
  //       if (response?.data) {
  //         setStateList(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch states:', error);
  //     }
  //   };
  //   fetchStates();
  // }, []);

  if (!isOpen) return null;

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateAddressForm = () => {
    const newErrors = {};

    if (!addressForm.houseNumber.trim()) {
      newErrors.houseNumber = 'House Number is required';
    }

    if (!addressForm.zipCode.trim()) {
      newErrors.zipCode = 'Zip Code is required';
    }

    if (!addressForm.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!addressForm.stateName) {
      newErrors.stateName = 'State is required';
    }

    if (!addressForm.cityId) {
      newErrors.cityName = 'City is required';
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressInputChange = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressDialogClose = () => {
    setAddressForm({
      houseNumber: '',
      zipCode: '',
      address: '',
      stateName: '',
      cityId: '',
      cityName: ''
    });
    setAddressErrors({});
    setShowAddressDialog(false);
    // onClose();
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm() || !authToken || !studentData) {
      return;
    }

    setIsSavingAddress(true);

    try {
      const fullAddress = `${addressForm.houseNumber.trim()}, ${addressForm.zipCode.trim()}, ${addressForm.address.trim()}`;
      
      const body = {
        firstName: studentData?.firstName || '',
        lastName: studentData?.lastName || studentData?.firstName,
        userName: studentData?.userName || studentData?.contact || '',
        email: studentData?.email || '',
        dob: studentData?.dob ? new Date(studentData.dob).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        address: fullAddress,
        cityId: Number(addressForm.cityId),
        bio: studentData?.bio || studentData?.firstName,
        gender: (studentData?.gender || 'male').toLowerCase(),
        zipCode: addressForm.zipCode.trim(),
      };

      const response = await Network.editStudentProfile(authToken, body);

      if (response?.errorCode === 0 || response?.status) {
        updateStudentData({
          address: body.address,
          cityId: Number(addressForm.cityId),
        });
        setAddressErrors({});
        setShowAddressDialog(false);
        // Navigate after address is saved
        handleNavigate();
        onClose();
        return;
      }

      setAddressErrors({
        submit: response?.message || response?.errorDescription || 'Unable to save delivery address.'
      });
    } catch (error) {
      setAddressErrors({
        submit: error?.response?.data?.message || 'Unable to save delivery address.'
      });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      const limited = cleaned.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: limited }));
    } else if (name === 'otp') {
      const cleaned = value.replace(/\D/g, '');
      const limited = cleaned.slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: limited }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await Network.sendLoginOtp(formData.phone);

      //  console.log("Signup OTP verification response:", response);

      if (response.status === true || response.errorCode === 0) {
        setIsNewUser(false);
        setOtpSent(true);
        setCountdown(60);
      } else {
        setIsNewUser(true);

        const body = {
          contact: formData.phone,
          instId: instId,
        };

        const signUpOtpResponse = await Network.signUpSendOtp(body);

        if (signUpOtpResponse.status === false || signUpOtpResponse.errorCode === 10) {
          setOtpSent(true);
          setCountdown(60);
        } else if (signUpOtpResponse.status === true) {
          setOtpSent(true);
          setCountdown(60);
        } else {
          setErrors({ submit: signUpOtpResponse.message || 'Failed to send OTP. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      handleSendOTP();
      return;
    }

    setIsLoading(true);
    setErrors({});

    const newErrors = {};

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (isNewUser) {
        const body = {
          contact: Number(formData.phone),
          otp: formData.otp,
          instId: instId
        };

        const verifyResponse = await Network.signUpVerifyOtp(body);
        // console.log("Signup OTP verification response:", verifyResponse);
        if (verifyResponse.status === true) {
          localStorage.setItem('tempSignup', JSON.stringify({
            phone: formData.phone,
            otp: formData.otp
          }));
          // handleClose();
          // onSignupClick();

           // Check if address is empty
            // if (studentData?.address || studentData?.address.trim() === '') {
            //   setShowAddressDialog(true);
            // }

          setOpenSignUpModal(true);
        } else {
          
          setErrors({ submit: verifyResponse.message || 'OTP verification failed. Please try again.' });
        }
      } else {
        const body = {
          contact: formData.phone,
          otp: formData.otp,
          instId: instId,
          deviceId: "1",
          deviceOS: "windows",
        };

        const loginVerifyResponse = await Network.verifyLoginOtp(body);

        // console.log("Login successful, auth token:", loginVerifyResponse.data);
        if (loginVerifyResponse.status === true) {
          const success = setStudentAuth(loginVerifyResponse);
          if (success) {
            login(formData.phone, formData.otp);
            setFormData({ phone: '', otp: '' });
            setOtpSent(false);
            setErrors({});

            // console.log("Login successful, loginVerifyResponse data:", loginVerifyResponse?.student);

            // Check if student has address
            if (!loginVerifyResponse?.student?.address || loginVerifyResponse?.student?.address.trim() === '') {
              // Show address dialog if address is empty
              setShowAddressDialog(true);
            } else {
              // Proceed with navigation if address exists
              handleNavigate();
              onClose();
            }
          }
        } else {
          setErrors({ submit: loginVerifyResponse.message || 'OTP verification failed. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.message || 'Verification failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;

    setFormData(prev => ({ ...prev, otp: '' }));
    setErrors({});
    handleSendOTP();
  };

  const handleClose = () => {
    setFormData({ phone: '', otp: '' });
    setErrors({});
    setOtpSent(false);
    setCountdown(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: theme?.primary || '#2196F3', opacity: 0.3 }}></div>
            <div className="relative h-full w-full rounded-2xl flex items-center justify-center transform rotate-3" style={{ backgroundColor: theme?.primary || '#2196F3' }}>
              <LogIn className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              {!otpSent ? 'Enter your phone number to receive OTP' : 'Enter the OTP sent to your phone'}
            </p>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => {
                handleClose();
                onSignupClick();
              }}
              className="font-semibold hover:opacity-80 transition-all duration-200"
              style={{ color: theme?.primary || '#2196F3' }}
            >
              Create one here
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Phone Field */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-700">
                <Phone className="h-5 w-5" />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+91</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={`block w-full pl-20 pr-4 py-3 border-2 ${errors.phone
                  ? 'border-red-300 focus:border-red-500'
                  : `border-gray-300 focus:border-indigo-700`
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                placeholder="Enter your 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                disabled={otpSent && countdown > 0}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.phone}
              </p>
            )}
          </div>

          {/* OTP Field */}
          {otpSent && (
            <div className="space-y-1 animate-in fade-in">
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                Enter OTP
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.otp
                    ? 'border-red-300 focus:border-red-500'
                    : `border-gray-300 focus:border-indigo-700`
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-lg font-mono tracking-widest`}
                  placeholder="------"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                />
              </div>
              {errors.otp && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.otp}
                </p>
              )}

              {/* Resend OTP */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  OTP sent to +91 {formData.phone}
                </span>
                {countdown > 0 ? (
                  <span className={`${theme.textClass} flex items-center gap-1`}>
                    <Timer className="h-4 w-4" />
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className={`${theme.textClass} hover:opacity-80 font-medium transition-colors duration-200 hover:underline`}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-in fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white ${theme.primaryClass} hover:opacity-90 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {!otpSent ? 'Sending OTP...' : 'Verifying...'}
                </>
              ) : (
                <>
                  {!otpSent ? (
                    <>
                      <MessageCircle className="h-5 w-5 opacity-80" />
                      Send OTP
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 opacity-80" />
                      Verify & Sign In
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className={`${theme.textClass} hover:opacity-80 font-medium`}>Terms</a>
            {' '}and{' '}
            <a href="#" className={`${theme.textClass} hover:opacity-80 font-medium`}>Privacy Policy</a>
          </p>
        </div>
      </div>

      <SignupModal 
        isOpen={openSignUpModel}
        onClose={() => setOpenSignUpModal(false)}
        handleLoginClose={handleClose}
      />

      {showAddressDialog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-emerald-100" />
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-emerald-100">Dispatch Address Required</p>
              </div>
              <h3 className="text-2xl font-bold mb-2">Add your delivery address</h3>
              <p className="text-sm text-emerald-50 leading-relaxed">
                Note: Kindly enter your correct dispatch address, including all necessary details such as house number, street, city, and PIN code. Your books will be delivered to this address, so please double-check before submitting.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">House Number</label>
                  <input
                    type="text"
                    value={addressForm.houseNumber}
                    onChange={(e) => handleAddressInputChange('houseNumber', e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter house number"
                  />
                  {addressErrors.houseNumber && <p className="mt-2 text-xs text-red-600">{addressErrors.houseNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                  <input
                    type="number"
                    value={addressForm.zipCode}
                    onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter zip code"
                  />
                  {addressErrors.zipCode && <p className="mt-2 text-xs text-red-600">{addressErrors.zipCode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                <textarea
                  value={addressForm.address}
                  onChange={(e) => handleAddressInputChange('address', e.target.value)}
                  rows={3}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-none"
                  placeholder="Enter your full delivery address"
                />
                {addressErrors.address && <p className="mt-2 text-xs text-red-600">{addressErrors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                <select
                  value={addressForm.stateName}
                  onChange={(e) => {
                    handleAddressInputChange('stateName', e.target.value);
                    handleAddressInputChange('cityName', '');
                    handleAddressInputChange('cityId', '');
                  }}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white"
                >
                  <option value="">Select your state</option>
                  {stateList.map((state) => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                {addressErrors.stateName && <p className="mt-2 text-xs text-red-600">{addressErrors.stateName}</p>}
              </div>

              {addressForm.stateName && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <select
                    value={addressForm.cityId}
                    onChange={(e) => {
                      const selectedCityName = e.target.options[e.target.selectedIndex]?.text || '';
                      handleAddressInputChange('cityId', e.target.value);
                      handleAddressInputChange('cityName', e.target.value ? selectedCityName : '');
                    }}
                    required
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white"
                  >
                    <option value="">Select your city</option>
                    {(stateList.find((s) => s.name === addressForm.stateName)?.city || []).map((city) => (
                      <option key={city.id} value={city.id}>{city.city}</option>
                    ))}
                  </select>
                  {addressErrors.cityName && <p className="mt-2 text-xs text-red-600">{addressErrors.cityName}</p>}
                </div>
              )}

              {addressErrors.submit && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {addressErrors.submit}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddressDialogClose}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={isSavingAddress}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSavingAddress || !addressForm.houseNumber.trim() || !addressForm.zipCode.trim() || !addressForm.address.trim() || !addressForm.stateName || !addressForm.cityId}
                >
                  {isSavingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;

