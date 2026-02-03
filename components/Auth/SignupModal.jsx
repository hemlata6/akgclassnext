import React, { useState, useEffect } from 'react';
import { useAuth } from '../../config/AuthContext';
import { User, Mail, UserPlus, Sparkles, X } from 'lucide-react';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { useTheme } from '../../config/ThemeContext';
import { useStudent } from '@/config/StudentContext';

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tempSignupData, setTempSignupData] = useState(null);
  const { login } = useAuth();
  const { theme } = useTheme();
  const { setStudentAuth } = useStudent();

  // Check for temporary signup data on component mount
  useEffect(() => {
    const tempData = localStorage.getItem('tempSignup');
    if (tempData) {
      const parsedData = JSON.parse(tempData);
      setTempSignupData(parsedData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const newErrors = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const registrationBody = {
        contact: tempSignupData?.phone,
        firstName: formData.firstname,
        lastName: formData.lastname,
        email: formData.email,
        instId: instId,
        password: 123456,
        gender: "male",
        cityId: 1,
        address: 'India',
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
          } else {
            setErrors({ submit: 'Registration successful but failed to set user data.' });
          }
        } else {
          setErrors({ submit: loginResponse.message || 'Registration successful but login failed.' });
        }
      } else {
        setErrors({ submit: registrationResponse.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
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
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
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
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm">
              Join our community and start your learning journey
            </p>
          </div>

          {tempSignupData && (
            <div className={`mt-4 p-3 ${theme.primaryClass} bg-opacity-5 border rounded-lg`} style={{ borderColor: `var(--theme-primary, #2196F3)` }}>
              <p className="text-sm" style={{ color: theme?.primary || '#2196F3' }}>
                Phone number verified for +91 {tempSignupData.phone}
              </p>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => {
                handleClose();
                onLoginClick();
              }}
              className="font-semibold hover:opacity-80 transition-all duration-200"
              style={{ color: theme?.primary || '#2196F3' }}
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
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
                className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.firstname
                  ? 'border-red-300 focus:border-red-500'
                  : `border-gray-300 focus:border-indigo-700`
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                placeholder="Enter your first name"
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
                className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.lastname
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-700'
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-700/10 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70`}
                placeholder="Enter your last name"
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
                className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.email
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
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 opacity-80" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
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

