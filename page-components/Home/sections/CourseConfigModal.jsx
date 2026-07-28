import React, { useState, useEffect } from 'react';
import { Icons, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../../constants/Icons';

const formatMilliseconds = (ms) => {
  if (!ms) return "N/A";
  const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
  const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const years = Math.floor(ms / millisecondsInYear);
  let remainder = ms % millisecondsInYear;
  const months = Math.floor(remainder / millisecondsInMonth);
  remainder %= millisecondsInMonth;
  const days = Math.floor(remainder / millisecondsInDay);
  let result = [];
  if (years > 0) result.push(`${years} Year${years > 1 ? 's' : ''}`);
  if (months > 0) result.push(`${months} Month${months > 1 ? 's' : ''}`);
  if (days > 0) result.push(`${days} Day${days > 1 ? 's' : ''}`);
  return result.length > 0 ? result.join(" ") : "N/A";
};

const CourseConfigModal = ({ course, onClose, onAddToCart }) => {
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
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{course?.title}</h2>
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
                      : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
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
                        : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                  >
                    {variation}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deduplicate validity labels - show each unique period only once */}
          {(() => {
            const uniqueLabels = [...new Set(validityOptions.map(p => formatValidity(p)))];
            if (uniqueLabels.length > 1) {
              return (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Select Validity</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-emerald-600"
                    value={selectedValidity ? formatValidity(selectedValidity) : ''}
                    onChange={(e) => {
                      const match = validityOptions.find(p => formatValidity(p) === e.target.value);
                      if (match) setSelectedValidity(match);
                    }}
                  >
                    {uniqueLabels.map((label, idx) => (
                      <option key={idx} value={label}>{label}</option>
                    ))}
                  </select>
                </div>
              );
            } else if (uniqueLabels.length === 1) {
              return (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Validity</label>
                  <div className={`inline-flex px-3 py-2 rounded-lg text-xs font-bold transition-all ${BRAND_GREEN_CLASS} text-white`}>
                    {uniqueLabels[0]}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Watch Time Selection - standalone section like Mode/Variation */}
          {validityOptions.length > 0 && [...new Set(validityOptions.map(p => String(p.watchTime)))].length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Watch Time</label>
              <div className="flex flex-wrap gap-2">
                {[...new Set(validityOptions.map(p => String(p.watchTime)))].map((wt) => {
                  const currentWatchTime = pricingToDisplay?.watchTime !== undefined && pricingToDisplay?.watchTime !== null ? String(pricingToDisplay.watchTime) : '';
                  const isActive = currentWatchTime === wt || (!currentWatchTime && wt === '');
                  return (
                    <button
                      key={wt || 'unlimited'}
                      type="button"
                      onClick={() => {
                        const match = validityOptions.find(p => String(p.watchTime) === wt);
                        if (match) setSelectedValidity(match);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? `${BRAND_GREEN_CLASS} text-white`
                          : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      {!wt || wt === 'Unlimited' || wt === 'undefined' || wt === 'null' ? 'Unlimited' : `${wt}x`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Course Details - Duration only */}
          {course?.duration > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Course Details</h4>
              <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Duration</span>
                <span className="text-xs font-bold text-slate-800">{formatMilliseconds(course.duration)}</span>
              </div>
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

          {/* <p className="text-xs text-center text-slate-400 mt-3">30-Day Money Back Guarantee</p> */}
        </form>
      </div>
    </div>
  );
};

export default CourseConfigModal;

