import React, { useState, useEffect } from 'react';
import { useAuth } from '../../config/AuthContext';
import { User, Mail, UserPlus, Sparkles, X } from 'lucide-react';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { useTheme } from '../../config/ThemeContext';
import { useStudent } from '@/config/StudentContext';

/**
 * Convert a legacy combined address string back into separate fields.
 *
 * Two legacy formats are seen in the wild:
 *   A) `${houseNo}, ${zipCode}, ${address}`
 *      e.g. "C 86, 110015, C 86, 3rd Floor, C-86, Block C Kirti Nagar Rd C Block, Kirti Nagar"
 *   B) `${houseNo}, ${address}, ${zipCode}`  (zipcode at the end)
 *      e.g. "12ABC, Vijay Nagar, 500001"
 *
 * The separate `zipCode` is matched against the comma-separated tokens to
 * locate the split point, rather than guessing which token is the zipcode.
 *
 * @param {string} address Combined address returned by the API
 * @param {string} zipCode Separate zipcode returned by the API
 * @returns {{houseNo: string, zipCode: string, address: string}}
 */
function parseCombinedAddress(address, zipCode) {
  const combined = typeof address === 'string' ? address.trim() : '';
  const zip = typeof zipCode === 'string' ? zipCode.trim() : '';

  const result = {
    houseNo: '',
    zipCode: zip,
    address: '',
  };

  if (!combined) {
    return result;
  }

  // No zipcode anchor — keep the whole value as the address. We can't reliably
  // separate houseNo from address without it, and fabricating a split would
  // risk duplicating or losing data on the next submit.
  if (!zip) {
    result.address = combined;
    return result;
  }

  const parts = combined.split(',').map(p => p.trim()).filter(Boolean);
  const zipIndex = parts.indexOf(zip);

  if (zipIndex === -1) {
    // Zipcode isn't present as its own comma-separated token. This is an old
    // record that doesn't follow an expected format — don't mutate it.
    result.address = combined;
    return result;
  }

  const beforeZip = parts.slice(0, zipIndex);
  const afterZip = parts.slice(zipIndex + 1);

  if (afterZip.length > 0) {
    // Format A: `houseNo, zipCode, address`
    result.houseNo = beforeZip[0] || '';  
    result.address = beforeZip.slice(1).concat(afterZip).join(', ');
    return result;
  }

  // Zipcode is the last token. It could be:
  //   - `houseNo, address..., zipCode`  (house number first, then address)
  //   - `houseNo, zipCode`              (no address)
  //   - `address..., zipCode`           (no house number)
  if (beforeZip.length === 0) {
    return result;
  }

  const first = beforeZip[0];
  if (/\d/.test(first)) {
    // First token contains digits → treat it as the house number.
    result.houseNo = first;
    result.address = beforeZip.slice(1).join(', ');
  } else {
    // First token doesn't look like a house number → keep everything before
    // the zipcode as the address.
    result.address = beforeZip.join(', ');
  }

  return result;
}

const SignupModal = ({ isOpen, onClose, onLoginClick, handleLoginClose }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [addressForm, setAddressForm] = useState({
    houseNo: '',
    zipCode: '',
    address: '',
    stateName: '',
    cityId: '',
    cityName: '',
  });
  const [errors, setErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tempSignupData, setTempSignupData] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  const { login, auth } = useAuth();
  const { theme } = useTheme();
  const { setStudentAuth, authToken: studentToken } = useStudent();

  // Fetch states on mount
  useEffect(() => {
    if (isOpen) {
      const fetchStates = async () => {
        try {
          const response = await Network.getStateAPI();
          const statesData = response?.states || response?.data || response || [];
          if (Array.isArray(statesData)) {
            setStates(statesData);
          }
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      };
      fetchStates();
    }
  }, [isOpen]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedStateId && states.length > 0) {
      const state = states.find(s => String(s.id) === String(selectedStateId));
      setCities(state?.city || []);
    } else {
      setCities([]);
    }
  }, [selectedStateId, states]);

  // Pre-fill state & city from student data once states are loaded
  useEffect(() => {
    if (tempSignupData?.cityId && states.length > 0) {
      // Find which state contains this city
      for (const state of states) {
        if (state.city) {
          const city = state.city.find(c => String(c.id) === String(tempSignupData.cityId));
          if (city) {
            setSelectedStateId(String(state.id));
            setAddressForm(prev => ({
              ...prev,
              cityId: String(city.id),
              cityName: city.city,
              stateName: state.name,
            }));
            break;
          }
        }
      }
    }
  }, [tempSignupData, states]);

  // Check for temporary signup data on component mount
  useEffect(() => {
    const tempData = localStorage.getItem('tempSignup');
    if (tempData) {
      const parsedData = JSON.parse(tempData);
      setTempSignupData(parsedData);
      // Pre-fill form fields if student data is available from login
      if (parsedData.firstName || parsedData.lastName || parsedData.email) {
        setFormData(prev => ({
          ...prev,
          firstname: parsedData.firstName || prev.firstname,
          lastname: parsedData.lastName || prev.lastname,
          email: parsedData.email || prev.email,
        }));
      }
      // Pre-fill address fields if address data is available.
      // The API stores a single combined `address` string plus a separate
      // `zipCode`. Normalize it back into the three form fields so that
      // re-submitting never appends the old combined value again.
      if (parsedData.address || parsedData.zipCode) {
        const parsedAddress = parseCombinedAddress(parsedData.address, parsedData.zipCode);
        setAddressForm(prev => ({
          ...prev,
          houseNo: parsedAddress.houseNo,
          zipCode: parsedAddress.zipCode,
          address: parsedAddress.address,
        }));
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

    if (!addressForm.address.trim()) {
      newAddressErrors.address = 'Address is required';
    }

    if (!addressForm.houseNo.trim()) {
      newAddressErrors.houseNo = 'House No is required';
    }

    if (!addressForm.zipCode.trim()) {
      newAddressErrors.zipCode = 'Zipcode is required';
    }

    if (!selectedStateId) {
      newAddressErrors.stateName = 'State is required';
    }

    if (!addressForm.cityId) {
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
      const fullAddress = [
        addressForm.houseNo.trim(),
        addressForm.address.trim(),
        addressForm.zipCode.trim()
      ].filter(Boolean).join(', ');

      // Guard: tempSignupData is required
      if (!tempSignupData) {
        setErrors({ submit: 'Phone verification required. Please go back and verify your phone number first.' });
        setIsLoading(false);
        return;
      }

      // Existing student (logged in successfully) vs New student (from "User Not Found")
      const isExistingStudent = !!(tempSignupData.firstName || tempSignupData.lastName);

      if (isExistingStudent) {
        // Existing student — edit profile
        const editProfileBody = {
          firstName: formData.firstname,
          lastName: formData.lastname,
          userName: tempSignupData.phone,
          email: formData.email,
          dob: null,
          cityId: addressForm.cityId ? Number(addressForm.cityId) : null,
          address: fullAddress,
          zipCode: addressForm.zipCode.trim(),
          bio: "",
          gender: "male",
          sourceInstituteName: "",
        };

        const authToken = auth || studentToken;
        const editResponse = await Network.studentEditProfileAPI(authToken, editProfileBody);

        if (editResponse.status === true) {
          localStorage.removeItem('tempSignup');
          handleClose();
          handleLoginClose();
        } else {
          setErrors({ submit: editResponse.message || 'Failed to update profile. Please try again.' });
        }
      } else {
        // New student (from "User Not Found") — register + auto-login
        const registrationBody = {
          contact: tempSignupData.phone,
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          instId: instId,
          password: 123456,
          gender: "male",
          cityId: addressForm.cityId ? Number(addressForm.cityId) : null,
          address: fullAddress,
          zipCode: addressForm.zipCode.trim(),
          userName: `${formData.firstname}${formData.lastname}`,
        };

        const registrationResponse = await Network.studentRegister(registrationBody);

        if (registrationResponse.status === true) {
          const loginBody = {
            contact: tempSignupData.phone,
            otp: tempSignupData.otp,
            instId: instId,
            deviceId: "1",
            deviceOS: "windows",
          };

          const loginResponse = await Network.verifyLoginOtp(loginBody);

          if (loginResponse.status === true) {
            const success = setStudentAuth(loginResponse);

            if (success) {
              login(tempSignupData.phone, tempSignupData.otp);
              localStorage.removeItem('tempSignup');
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
    setAddressForm({
      houseNo: '',
      zipCode: '',
      address: '',
      stateName: '',
      cityId: '',
      cityName: '',
    });
    setErrors({});
    setAddressErrors({});
    setSelectedStateId('');
    setCities([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-4 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        {
          !tempSignupData && (
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>

          )
        }

        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto h-14 w-14 mb-2">
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: theme?.primary || '#2196F3', opacity: 0.3 }}></div>
            <div className="relative h-full w-full rounded-2xl flex items-center justify-center transform rotate-3" style={{ backgroundColor: theme?.primary || '#2196F3' }}>
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 text-xs">
              Join our community and start your learning journey
            </p>
          </div>

          {tempSignupData && (
            <div className={`mt-2 p-2 ${theme.primaryClass} bg-opacity-5 border rounded-lg`} style={{ borderColor: `var(--theme-primary, #2196F3)` }}>
              <p className="text-xs" style={{ color: 'white' || '#2196F3' }}>
                Phone number verified for +91 {tempSignupData.phone}
              </p>
            </div>
          )}

          {/* <p className="mt-2 text-center text-xs text-gray-500">
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
          </p> */}
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-800 leading-relaxed">
              Note: Kindly enter your correct dispatch address, including all necessary details such as house number, street, city, and PIN code. Your books will be delivered to this address, so please double-check before submitting.
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

          {/* House No & Zipcode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">House No.</label>
              <input
                type="text"
                value={addressForm.houseNo}
                onChange={(e) => handleAddressInputChange('houseNo', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="e.g. 12A"
              />
              {addressErrors.houseNo && <p className="mt-2 text-xs text-red-600">{addressErrors.houseNo}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Zipcode</label>
              <input
                type="number"
                value={addressForm.zipCode}
                onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="e.g. 500001"
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
              <label className="block text-sm font-semibold text-slate-700">State</label>
              <select
                value={selectedStateId}
                onChange={(e) => {
                  const stateId = e.target.value;
                  setSelectedStateId(stateId);
                  handleAddressInputChange('stateName', e.target.options[e.target.selectedIndex].text);
                  handleAddressInputChange('cityId', '');
                  handleAddressInputChange('cityName', '');
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
              {addressErrors.stateName && (
                <p className="mt-2 text-xs text-red-600">{addressErrors.stateName}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">City</label>
              <select
                value={addressForm.cityId}
                onChange={(e) => {
                  handleAddressInputChange('cityId', e.target.value);
                  handleAddressInputChange('cityName', e.target.options[e.target.selectedIndex].text);
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                disabled={!selectedStateId}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.city}</option>
                ))}
              </select>
              {addressErrors.cityName && (
                <p className="mt-2 text-xs text-red-600">{addressErrors.cityName}</p>
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
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-semibold rounded-xl text-white ${theme.primaryClass} hover:opacity-90 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {tempSignupData ? 'Submitting...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 opacity-80" />
                  {tempSignupData ? 'Submit' : 'Create Account'}
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