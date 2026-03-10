/**
 * Test Series Utilities
 * Common patterns and helper functions for the modernized test series flow
 */

/**
 * UTILITY 1: Type-Safe Cart Item Creation
 * ========================================
 * Ensures cart items have consistent structure
 */
export const createCartItem = (plan, group = 'both', subject = []) => {
  return {
    group: group,
    subject: Array.isArray(subject) ? subject : [],
    plan: {
      ...plan,
      // Ensure plan has required fields
      id: plan.id,
      title: plan.title,
      price: plan.price || 0,
      discount: plan.discount || 0,
    },
  };
};

/**
 * UTILITY 2: Calculate Purchase Array from Cart
 * =============================================
 * Converts cart items to purchase entities for API
 */
export const generatePurchaseArray = (cartArray) => {
  const purchaseArray = [];

  cartArray?.forEach((item) => {
    if (item.plan?.entityId) {
      purchaseArray.push({
        purchaseType: 'courseContent',
        entityId: item.plan.entityId,
      });
    }

    if (Array.isArray(item.subject)) {
      item.subject.forEach((subject) => {
        if (subject?.entityId) {
          purchaseArray.push({
            purchaseType: 'courseContent',
            entityId: subject.entityId,
          });
        }
      });
    }
  });

  return purchaseArray;
};

/**
 * UTILITY 3: Calculate Total Price
 * ================================
 * Computes total with discounts
 */
export const calculateTotalPrice = (cartArray, couponDiscount = 0) => {
  let totalPrice = 0;

  cartArray?.forEach((item) => {
    const plan = item.plan;
    if (plan?.price) {
      const discountAmount = (plan.price / 100) * (plan.discount || 0);
      const priceAfterDiscount = plan.price - discountAmount;
      totalPrice += priceAfterDiscount;
    }
  });

  return totalPrice - couponDiscount;
};

/**
 * UTILITY 4: Session Data Saver
 * ============================
 * Safely save data to sessionStorage with error handling
 */
export const saveTestSeriesSession = (data, key = 'foundationTestData') => {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
    return false;
  }
};

/**
 * UTILITY 5: Session Data Retriever
 * =================================
 * Safely retrieve and parse sessionStorage data
 */
export const getTestSeriesSession = (key = 'foundationTestData') => {
  try {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return null;
  }
};

/**
 * UTILITY 6: Session Data Cleaner
 * ===============================
 * Remove specific or all test series session data
 */
export const clearTestSeriesSession = (key = null) => {
  try {
    if (typeof window !== 'undefined') {
      if (key) {
        sessionStorage.removeItem(key);
      } else {
        // Clear all test series related keys
        sessionStorage.removeItem('foundationTestData');
        sessionStorage.removeItem('testSeriesData');
        sessionStorage.removeItem('testSeriesState');
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * UTILITY 7: Form Validator
 * ========================
 * Validates checkout form before submission
 */
export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Full name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.number?.trim()) {
    errors.number = 'Phone number is required';
  } else if (formData.number.length !== 10) {
    errors.number = 'Phone number must be 10 digits';
  }

  if (!Array.isArray(formData.purchaseArray) || formData.purchaseArray.length === 0) {
    errors.purchaseArray = 'No items in cart';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * UTILITY 8: Price Formatter
 * =========================
 * Format price for display
 */
export const formatPrice = (price, currency = '₹') => {
  if (!price) return `${currency}0`;
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * UTILITY 9: Discount Calculator
 * ==============================
 * Calculate discount percentage and amount
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice === 0) return 0;
  const discountAmount = originalPrice - discountedPrice;
  return Math.round((discountAmount / originalPrice) * 100);
};

/**
 * UTILITY 10: Data Serialization for Storage
 * ==========================================
 * Handle circular references and complex objects
 */
export const serializeTestData = (data) => {
  try {
    // Remove functions and undefined values
    return JSON.stringify(data, (key, value) => {
      if (typeof value === 'function') return undefined;
      if (typeof value === 'undefined') return null;
      return value;
    });
  } catch (error) {
    console.error('Error serializing test data:', error);
    return null;
  }
};

/**
 * UTILITY 11: Course Filter Helper
 * ===============================
 * Filter courses based on criteria
 */
export const filterCourses = (courses, tag = null, isActive = true) => {
  return courses.filter((course) => {
    let match = true;

    if (isActive !== null && course.active !== isActive) {
      match = false;
    }

    if (tag && !course.tags?.some((t) => t.id === tag.id)) {
      match = false;
    }

    return match;
  });
};

/**
 * UTILITY 12: Chart Data Aggregator
 * =================================
 * Aggregate data for analytics/reporting
 */
export const aggregateCartData = (cartArray) => {
  return {
    totalItems: cartArray.length,
    uniquePlans: [...new Set(cartArray.map((item) => item.plan?.id))].length,
    totalAmount: cartArray.reduce((sum, item) => sum + (item.plan?.price || 0), 0),
    averagePrice: cartArray.length > 0
      ? cartArray.reduce((sum, item) => sum + (item.plan?.price || 0), 0) / cartArray.length
      : 0,
  };
};

/**
 * USAGE EXAMPLES
 * ==============
 */

/**
 * Example 1: Adding item to cart
 * 
 * const handleAddToCart = (plan) => {
 *   const cartItem = createCartItem(plan, 'both', selectedSubjects);
 *   setCartArray([...cartArray, cartItem]);
 * };
 */

/**
 * Example 2: Calculating total before checkout
 * 
 * const handleCheckout = () => {
 *   const validation = validateCheckoutForm({
 *     title, email, number, purchaseArray
 *   });
 *   
 *   if (!validation.isValid) {
 *     setErrors(validation.errors);
 *     return;
 *   }
 *   
 *   const total = calculateTotalPrice(cartArray, couponDiscount);
 *   console.log('Total to charge:', formatPrice(total));
 * };
 */

/**
 * Example 3: Saving session during navigation
 * 
 * const handleNavigation = () => {
 *   const sessionData = {
 *     cartArray,
 *     activeStep,
 *     formData: { title, email, number }
 *   };
 *   
 *   if (saveTestSeriesSession(sessionData, 'testSeriesState')) {
 *     router.push('/next-page');
 *   }
 * };
 */

/**
 * Example 4: Retrieving and restoring session
 * 
 * useEffect(() => {
 *   const savedSession = getTestSeriesSession('testSeriesState');
 *   if (savedSession) {
 *     setCartArray(savedSession.cartArray);
 *     setActiveStep(savedSession.activeStep);
 *   }
 * }, []);
 */

export default {
  createCartItem,
  generatePurchaseArray,
  calculateTotalPrice,
  saveTestSeriesSession,
  getTestSeriesSession,
  clearTestSeriesSession,
  validateCheckoutForm,
  formatPrice,
  calculateDiscount,
  serializeTestData,
  filterCourses,
  aggregateCartData,
};
