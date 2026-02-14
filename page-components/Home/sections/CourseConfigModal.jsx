import React, { useState, useEffect } from 'react';
import { Icons, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../../constants/Icons';
import { useTheme } from '../../../config/ThemeContext';

const CourseConfigModal = ({ course, onClose, onAddToCart }) => {
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedVariation, setSelectedVariation] = useState('');
  const [selectedValidity, setSelectedValidity] = useState(null);
  const [modes, setModes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [validityOptions, setValidityOptions] = useState([]);

  // Get unique learning modes from course pricing
  useEffect(() => {
    if (!course?.coursePricing) return;

    const modeSet = new Set();
    course.coursePricing.forEach(pricing => {
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
  }, [course]);

  // Get variations based on selected mode
  useEffect(() => {
    if (!selectedMode || !course?.coursePricing) return;

    const selectedModes = selectedMode.split(" + ");
    const filtered = course.coursePricing.filter(pricing => {
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
  }, [selectedMode, course]);

  // Get validity options based on selected mode and variation
  useEffect(() => {
    if (!selectedMode || !course?.coursePricing) return;

    const selectedModes = selectedMode.split(" + ");
    const filtered = course.coursePricing.filter(pricing => {
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
  }, [selectedMode, selectedVariation, course]);

  const formatValidity = (pricing) => {
    if (pricing.validityType === "validity" && pricing.duration) {
      if (typeof pricing.duration === 'number') {
        const totalDays = Math.floor(pricing.duration / (1000 * 60 * 60 * 24));
        const yr = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const mon = Math.floor(remainingDays / 30);
        const days = remainingDays % 30;

        let parts = [];
        if (yr) parts.push(`${yr} Year${yr > 1 ? 's' : ''}`);
        if (mon) parts.push(`${mon} Month${mon > 1 ? 's' : ''}`);
        if (days) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
        return parts.length > 0 ? parts.join(' ') : 'N/A';
      }
    } else if (pricing.validityType === "expiry" && pricing.expiry) {
      return new Date(pricing.expiry).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (pricing.validityType === "lifetime") {
      return "Lifetime";
    }
    return "N/A";
  };

  const handleAddToCart = () => {
    // Use selectedValidity if available, otherwise use first pricing from course
    const pricingToUse = selectedValidity || (course?.coursePricing && course.coursePricing.length > 0 ? course.coursePricing[0] : null);

    if (!pricingToUse) return;

    const cartItem = {
      ...course,
      pricingId: pricingToUse.id,
      coursePricingId: pricingToUse.id,
      selectedMode: selectedMode || '',
      selectedVariation: selectedVariation || '',
      selectedValidity: selectedValidity ? formatValidity(selectedValidity) : '',
      finalPrice: pricingToUse.price - (pricingToUse.price * (pricingToUse.discount || 0) / 100),
      originalPrice: pricingToUse.price,
      discount: pricingToUse.discount || 0,
      type: "Course"
    };

    onAddToCart(cartItem);
    onClose();
  };

  // Use selectedValidity or fallback to first pricing
  const pricingToDisplay = selectedValidity || (course?.coursePricing && course.coursePricing.length > 0 ? course.coursePricing[0] : null);
  const originalPrice = pricingToDisplay?.price || 0;
  const discount = pricingToDisplay?.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * discount / 100);
  const hasPricing = originalPrice > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${BRAND_GREEN_CLASS} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <Icons.X />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">{course?.title}</h2>
          <p className="text-white/90 text-sm">Configure your course preferences</p>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Select Mode</label>
            <div className="flex flex-wrap gap-2">
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedMode === mode
                      ? `${BRAND_GREEN_CLASS} text-white`
                      : 'border border-slate-200 text-slate-600'
                    }`}
                  onMouseEnter={(e) => {
                    if (selectedMode !== mode) {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                      e.currentTarget.style.color = theme.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMode !== mode) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Variation Selection */}
          {variations.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Variation</label>
              <div className="flex flex-wrap gap-2">
                {variations.map((variation) => (
                  <button
                    key={variation}
                    type="button"
                    onClick={() => setSelectedVariation(variation)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedVariation === variation
                        ? `${BRAND_GREEN_CLASS} text-white`
                        : 'border border-slate-200 text-slate-600'
                      }`}
                    onMouseEnter={(e) => {
                      if (selectedVariation !== variation) {
                        e.currentTarget.style.borderColor = theme.primary;
                        e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                        e.currentTarget.style.color = theme.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedVariation !== variation) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                  >
                    {variation}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validity Selection */}
          {validityOptions.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Validity</label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                style={{
                  borderColor: theme.primary,
                  '--tw-border-opacity': '0.3',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
                  e.currentTarget.style.borderColor = theme.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `${theme.primary}4D`;
                }}
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

          {/* Pricing Summary */}
          {hasPricing && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6">
              <div className="space-y-2">
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-emerald-600">{discount}% OFF</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Total Price</span>
                  <span className="text-2xl font-bold text-emerald-700">₹{discountedPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasPricing}
            className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${!hasPricing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Add to Cart <Icons.Cart />
          </button>

          <p className="text-xs text-center text-slate-400 mt-3">30-Day Money Back Guarantee</p>
        </form>
      </div>
    </div>
  );
};

export default CourseConfigModal;

