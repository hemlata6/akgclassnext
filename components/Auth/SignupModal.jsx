import React, { useState, useEffect } from 'react';
import { useAuth } from '../../config/AuthContext';
import { User, Mail, UserPlus, Sparkles, X, MapPin } from 'lucide-react';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { useTheme } from '../../config/ThemeContext';
import { useStudent } from '@/config/StudentContext';

const SignupModal = ({ isOpen, onClose, onLoginClick, handleLoginClose, onAddressSaved }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    zipCode: '',
    address: '',
    stateName: '',
    // cityId: '',
    cityName: '',
  });

  // console.log('Address Form State:', addressForm);
  const [errors, setErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tempSignupData, setTempSignupData] = useState(null);
  const { login, auth, stateList } = useAuth();
  const { theme } = useTheme();
  const { setStudentAuth, authToken, updateStudentData, studentData } = useStudent();

  // Check for temporary signup data on component mount
  useEffect(() => {
    const tempData = localStorage.getItem('tempSignup');
    if (tempData) {
      const parsedData = JSON.parse(tempData);
      setTempSignupData(parsedData);

      // If this is an existing user, pre-fill their name and email
      if (parsedData.isExistingUser && parsedData.existingStudent) {
        const existing = parsedData.existingStudent;
        setFormData({
          firstname: existing.firstName || existing.first_name || '',
          lastname: existing.lastName || existing.last_name || '',
          email: existing.email || '',
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressInputChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (addressErrors[field]) {
      setAddressErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const newErrors = {};
    const newAddressErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!addressForm.houseNumber.trim()) {
      newAddressErrors.houseNumber = 'House number is required';
    }

    if (!addressForm.zipCode.trim()) {
      newAddressErrors.zipCode = 'Zip code is required';
    }

    if (!addressForm.address.trim()) {
      newAddressErrors.address = 'Address is required';
    }

    if (!addressForm.stateName) {
      newAddressErrors.stateName = 'State is required';
    }

    if (!addressForm.cityName.trim()) {
      newAddressErrors.cityName = 'City is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    if (Object.keys(newAddressErrors).length > 0) {
      setAddressErrors(newAddressErrors);
      setIsLoading(false);
      return;
    }

    try {
      const fullAddress = `${addressForm.houseNumber}, ${addressForm.address}, ${addressForm.cityName}, ${addressForm.stateName}, ${addressForm.zipCode}`;

      // Handle existing user: just update their profile with the address
      if (tempSignupData?.isExistingUser) {
        const token = authToken || localStorage.getItem('authToken');
        const existingStudent = tempSignupData.existingStudent || studentData;

        if (!token) {
          setErrors({ submit: 'Session expired. Please login again.' });
          setIsLoading(false);
          return;
        }

        const body = {
          firstName: formData.firstname,
          lastName: formData.lastname,
          userName: existingStudent?.userName || existingStudent?.contact || tempSignupData?.phone,
          email: formData.email,
          dob: existingStudent?.dob ? new Date(existingStudent.dob).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          address: fullAddress,
          cityId: null,
          bio: existingStudent?.bio || formData.firstname,
          gender: (existingStudent?.gender || 'male').toLowerCase(),
          zipCode: addressForm.zipCode.trim(),
        };

        const response = await Network.editStudentProfile(token, body);

        if (response?.errorCode === 0 || response?.status) {
          // Update student data in context
          updateStudentData({ address: fullAddress, zipCode: addressForm.zipCode.trim() });
          // Clear temporary signup data
          localStorage.removeItem('tempSignup');
          // Close the signup form
          handleClose();
          handleLoginClose();
          // Navigate after address is saved
          if (onAddressSaved) {
            onAddressSaved();
          }
        } else {
          setErrors({ submit: response?.message || response?.errorDescription || 'Failed to save address. Please try again.' });
        }
      } else {
        // New user: proceed with registration
        const registrationBody = {
          contact: tempSignupData?.phone,
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          instId: instId,
          password: 123456,
          gender: "male",
          cityId: null,
          address: fullAddress,
          userName: `${formData.firstname} ${formData.lastname}`,
        };

        const registrationResponse = await Network.studentRegister(registrationBody);

        if (registrationResponse.status === true) {
          // Registration successful - now call student login API
          const loginBody = {
            contact: tempSignupData?.phone,
            otp: tempSignupData?.otp,
            instId: instId,
            deviceId: "1",
            deviceOS: "windows",
          };

          const loginResponse = await Network.verifyLoginOtp(loginBody);

          if (loginResponse.status === true) {
            // Set student data in context
            const success = setStudentAuth(loginResponse);

            if (success) {
              // Login the user automatically
              login(tempSignupData?.phone, tempSignupData?.otp);
              // Clear temporary signup data
              localStorage.removeItem('tempSignup');
              // Close the signup form on successful signup/login
              handleClose();
              handleLoginClose();
            } else {
              setErrors({ submit: 'Registration successful but failed to set user data.' });
            }
          } else {
            setErrors({ submit: loginResponse.message || 'Registration successful but login failed.' });
          }
        } else {
          setErrors({ submit: registrationResponse.message || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        submit: error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
    });
    setAddressForm({
      houseNumber: '',
      zipCode: '',
      address: '',
      stateName: '',
      cityId: '',
      cityName: '',
    });
    setErrors({});
    setAddressErrors({});
    setTempSignupData(null);
    localStorage.removeItem('tempSignup');
    sessionStorage.removeItem('addressPromptShown');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-4 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto h-14 w-14 mb-2">
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: theme?.primary || '#2196F3', opacity: 0.3 }}></div>
            <div className="relative h-full w-full rounded-2xl flex items-center justify-center transform rotate-3" style={{ backgroundColor: theme?.primary || '#2196F3' }}>
              {tempSignupData?.isExistingUser ? (
                <MapPin className="h-7 w-7 text-white" />
              ) : (
                <UserPlus className="h-7 w-7 text-white" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {tempSignupData?.isExistingUser ? 'Complete Your Profile' : 'Create Account'}
            </h2>
            <p className="text-gray-600 text-xs">
              {tempSignupData?.isExistingUser
                ? 'Please provide your delivery address to proceed'
                : 'Join our community and start your learning journey'}
            </p>
          </div>

          {tempSignupData && (
            <div className={`mt-2 p-2 ${theme.primaryClass} bg-opacity-5 border rounded-lg`} style={{ borderColor: `var(--theme-primary, #2196F3)` }}>
              <p className="text-xs" style={{ color: 'white' || '#2196F3' }}>
                Phone number verified for +91 {tempSignupData.phone}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Address Information Note */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-xs text-emerald-700 leading-relaxed">
              <span className="font-semibold">Note:</span> Kindly enter your correct dispatch address, including all necessary details such as house number, street, city, and PIN code. Your books will be delivered to this address, so please double-check before submitting.
            </p>
          </div>
          {/* First Name & Last Name - 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700">
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-700">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="given-name"
                  className={`block w-full pl-12 pr-4 py-2 border-2 ${errors.firstname
                    ? 'border-red-300 focus:border-red-500'
                    : `border-gray-300 focus:border-indigo-700`
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                  placeholder="First name"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              {errors.firstname && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.firstname}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-700">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  autoComplete="family-name"
                  className={`block w-full pl-12 pr-4 py-2 border-2 ${errors.lastname
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-700'
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                  placeholder="Last name"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              {errors.lastname && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.lastname}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-700">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`block w-full pl-12 pr-4 py-2 border-2 ${errors.email
                  ? 'border-red-300 focus:border-red-500'
                  : `border-gray-300 focus:border-indigo-700`
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* House Number & Zip Code - 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* House Number */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">House Number</label>
              <input
                type="text"
                value={addressForm.houseNumber}
                onChange={(e) => handleAddressInputChange('houseNumber', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter house number"
              />
              {addressErrors.houseNumber && <p className="mt-2 text-xs text-red-600">{addressErrors.houseNumber}</p>}
            </div>

            {/* Zip Code */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Zip Code</label>
              <input
                type="number"
                value={addressForm.zipCode}
                onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter zip code"
              />
              {addressErrors.zipCode && <p className="mt-2 text-xs text-red-600">{addressErrors.zipCode}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Address</label>
            <textarea
              value={addressForm.address}
              onChange={(e) => handleAddressInputChange('address', e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-none"
              placeholder="Enter your full delivery address"
            />
            {addressErrors.address && <p className="mt-2 text-xs text-red-600">{addressErrors.address}</p>}
          </div>

          {/* State & City - 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* State */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">
                State
              </label>
              <input
                type="text"
                value={addressForm.stateName}
                onChange={(e) =>
                  handleAddressInputChange('stateName', e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter state"
              />
              {addressErrors.stateName && (
                <p className="mt-2 text-xs text-red-600">
                  {addressErrors.stateName}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">
                City
              </label>
              <input
                type="text"
                value={addressForm.cityName}
                onChange={(e) =>
                  handleAddressInputChange('cityName', e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter city"
              />
              {addressErrors.cityName && (
                <p className="mt-2 text-xs text-red-600">
                  {addressErrors.cityName}
                </p>
              )}
            </div>
          </div>

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
          <div className="pt-1">
            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.firstname.trim() ||
                !formData.lastname.trim() ||
                !formData.email.trim() ||
                !addressForm.houseNumber.trim() ||
                !addressForm.zipCode.trim() ||
                !addressForm.address.trim() ||
                !addressForm.stateName.trim() ||
                !addressForm.cityName.trim()
              }
              className={`group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-semibold rounded-xl text-white ${theme.primaryClass} hover:opacity-90 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {tempSignupData?.isExistingUser ? 'Saving Address...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {tempSignupData?.isExistingUser ? (
                    <MapPin className="h-5 w-5 opacity-80" />
                  ) : (
                    <Sparkles className="h-5 w-5 opacity-80" />
                  )}
                  {tempSignupData?.isExistingUser ? 'Save Address' : 'Create Account'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="hover:opacity-80 font-medium" style={{ color: theme?.primary || '#2196F3' }}>Terms</a>
            {' '}and{' '}
            <a href="#" className="hover:opacity-80 font-medium" style={{ color: theme?.primary || '#2196F3' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

