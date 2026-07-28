import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Star, Clock, Users, CheckCircle } from 'lucide-react';
import Network from '../context/Network';
import instId from '../context/instituteId';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import parse from "html-react-parser";
import SuggestedCourseDialog from './SuggestedCourseDialog';
import DripCourses from './DripCourses';
import Endpoints from '../context/endpoints';

const Store = ({ onQuizNavigation }) => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery("(min-width:600px)");
  const { addPurchase } = useAuth();
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(false);
  const [loading, setLoading] = useState(false)
  const [fullDes, setFullDes] = useState('');
  const [cartCourses, setCartCourses] = useState([]);
  const [addedSuggestCourse, setAddedSuggestCourse] = useState({});
  const [suggestedCourseId, setSuggestedCourseId] = useState(null);
  const [suggestedCourseDialog, setSuggestedCourseDialog] = useState(false);
  const [finalAmounts, setFinalAmounts] = useState(0);
  const [finalAmountsss, setFinalAmountsss] = useState(0);
  const [selectedSceduleList, setSelectedSceduleList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [dripCourseList, setDripCourseList] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllDripCourses, setShowAllDripCourses] = useState(false);

  useEffect(() => {
    getAllCourses();
  }, [])

  // Load cart from localStorage on mount and listen for updates
  useEffect(() => {
    const loadCart = () => {
      const cartData = localStorage.getItem('cartCourses');
      if (cartData) {
        try {
          const cart = JSON.parse(cartData);
          // Filter for regular courses only (items without plan property)
          const regularCartItems = Array.isArray(cart) ? cart.filter(item => !item.plan) : [];
          setCartCourses(regularCartItems);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartCourses([]);
        }
      }
    };

    // Load cart on mount
    loadCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [])

  const getAllCourses = async () => {
    try {
      setLoading(true);
      const response = await Network.getFreeCourseList(instId);
      const activeCourses = (response?.courses || []).filter(c => c.active === true);

      const dripCourses = [];
      const normalCourses = [];

      const schedulePromises = activeCourses.map(async (course) => {
        const scheduleResponse = await getMergedSchedules(course.id, 0);
        const hasDrip = Array.isArray(scheduleResponse?.contentList)
          ? scheduleResponse.contentList.some(item => item.drip === true)
          : false;

        return { course, hasDrip };
      });

      const results = await Promise.allSettled(schedulePromises);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          if (result.value.hasDrip) dripCourses.push(result.value.course);
          else normalCourses.push(result.value.course);
        }
      });

      setDripCourseList(dripCourses);
      setCourseList(normalCourses);
    } catch (error) {
      console.error("Error in getAllCourses:", error);
    } finally {
      setLoading(false);
    }
  };


  const handlePurchase = (item) => {
    addPurchase(item);
    setPurchaseSuccess(item.title);
    setTimeout(() => {
      setPurchaseSuccess(null);
    }, 3000);
  };

  const truncateDescription = (description) => {
    // Replace &nbsp; and other HTML entities with plain text equivalents
    const decodedDescription = description
      ?.replace(/&nbsp;/g, ' ')
      ?.replace(/&amp;/g, '&') // Example for handling other entities, can add more if needed
      ?.replace(/&lt;/g, '<')
      ?.replace(/&gt;/g, '>')
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");

    // Strip any remaining HTML tags
    const strippedDescription = decodedDescription
      ?.replace(/<[^>]*>/g, ' ') // Remove HTML tags
      ?.split(/\s+/)
      ?.slice(0, 10) // Get first 10 words
      ?.join(' ');

    return strippedDescription;
  };
  const toggleExpandDescription = (des) => {
    setFullDes(des)
    setCourseExpandedDescriptions(true);
  };

  const getMergedSchedules = async (courseId, folderId = 0) => {
    try {

      let response = await Network.fetchFreePublicScheduleApi(courseId, folderId);
      return response
    } catch (error) {
      console.log(error);

    }
  };

  const handlePurchaseCourse = (course) => {
    onQuizNavigation && onQuizNavigation('test-series', course);
  }

  const handleAddtoCart = async (course) => {
    try {
      setCartCourses((prevCart) => {
        const isAlreadyAdded = prevCart.some(item => item.id === course.id);
        let updatedCart;

        if (isAlreadyAdded) {
          updatedCart = prevCart.filter(item => item.id !== course.id);

          // Update localStorage and dispatch event
          localStorage.setItem("cartCourses", JSON.stringify(updatedCart));
          window.dispatchEvent(new Event('cartUpdated'));

          return updatedCart;
        } else {
          setAddedSuggestCourse(course);
          setSuggestedCourseId(course.id);
          setSuggestedCourseDialog(true);
          return prevCart;
        }
      });
    } catch (error) {
      console.error("Error in handleAddtoCart:", error);
    }
  };


  const handleCloseSuggestedCourseDialog = () => {
    setSuggestedCourseDialog(false);
  };

  const handleFinalAmountUpdate = (amount) => {
    setFinalAmountsss(amount);
  };

  const handleShowCart = () => {
    onQuizNavigation && onQuizNavigation('cart');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
                Course Store
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl">
                Discover premium courses designed to accelerate your learning journey
              </p>
            </div> */}

          {/* Cart Button - Modern Design */}
          {cartCourses?.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleShowCart}
                variant="contained"
                startIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: { xs: '12px', sm: '14px' },
                  padding: { xs: '10px 16px', sm: '12px 24px' },
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                View Cart ({cartCourses.length})
              </Button>
            </div>
          )}
        </div>

        {/* Regular Courses Section */}
        {courseList?.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full"></div>
                <h2 className="text-2xl md:text-1xl font-bold tracking-tight text-slate-900">Featured Courses</h2>
              </div>
              {courseList.length > 6 && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {showAllCourses ? courseList.length : 6} of {courseList.length} courses
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
              {(showAllCourses ? courseList : courseList.slice(0, 6)).map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1"
                >
                  {/* Course Image with Overlay */}
                  <div className="relative h-32 md:h-36 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                    <img
                      src={Endpoints?.mediaBaseUrl + item.logo}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Course Content */}
                  <div className="p-3">
                    <h3 className="text-sm md:text-base font-bold tracking-tight text-slate-900 mb-1.5 line-clamp-2 min-h-[2rem] group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                      {truncateDescription(item?.description)}
                      {item?.description.length > 100 && (
                        <button
                          onClick={() => toggleExpandDescription(item?.description)}
                          className="text-orange-600 hover:text-orange-700 font-medium ml-1 underline"
                        >
                          more
                        </button>
                      )}
                    </p>

                    {/* Pricing Section */}
                    <div className="mb-2">
                      {(() => {
                        const cartItem = cartCourses.find(c => c.id === item.id);

                        // Calculate minimum price from coursePricing
                        const getMinPrice = () => {
                          if (item?.coursePricing && item.coursePricing.length > 0) {
                            const minPrice = Math.min(...item.coursePricing.map(pricing => {
                              const finalPrice = pricing.discount && pricing.discount > 0
                                ? pricing.price - (pricing.price * (pricing.discount / 100))
                                : pricing.price;
                              return finalPrice;
                            }));
                            return minPrice;
                          }
                          return 0;
                        };

                        const minPrice = getMinPrice();

                        if (cartItem && cartItem.finalPrice !== undefined && cartItem.finalPrice !== null) {
                          return (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                ₹{parseFloat(cartItem.finalPrice).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{(parseFloat(cartItem.finalPrice) * 1.5).toFixed(2)}
                              </span>
                            </div>
                          );
                        } else {
                          // Display minimum price by default
                          return (
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div className={`px-1.5 py-0.5 rounded text-xs font-semibold ${minPrice === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                  }`}>
                                  {minPrice === 0 ? '🆓 FREE' : '🏷️ PAID'}
                                </div>
                                <span className={`text-sm font-bold ${minPrice === 0 ? 'text-green-600' : 'text-orange-600'
                                  }`}>
                                  {minPrice === 0 ? 'Free' : `₹${minPrice.toFixed(2)}`}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 italic">
                                Starting price
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAddtoCart(item)}
                      className={`w-full font-semibold py-1.5 px-2 text-xs rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${cartCourses.some(a => a.id === item?.id)
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-red-500/50'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-orange-500/50'
                        } transform hover:scale-105`}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button for Regular Courses */}
            {courseList.length > 6 && (
              <div className="flex justify-center mt-8 md:mt-12">
                <button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-orange-500/50 transform hover:scale-105"
                >
                  {showAllCourses ? (
                    <>
                      <span>Show Less</span>
                      <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>View More Courses ({courseList.length - 6} more)</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Drip Courses Section */}
        {dripCourseList?.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <h2 className="text-2xl md:text-1xl font-bold tracking-tight text-slate-900">Test Series & Programs</h2>
              </div>
              {dripCourseList.length > 6 && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {showAllDripCourses ? dripCourseList.length : 6} of {dripCourseList.length} courses
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
              {(showAllDripCourses ? dripCourseList : dripCourseList.slice(0, 6)).map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
                >
                  {/* Course Image with Overlay */}
                  <div className="relative h-32 md:h-36 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    <img
                      src={Endpoints?.mediaBaseUrl + item.logo}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Course Content */}
                  <div className="p-3">
                    <h3 className="text-sm md:text-base font-bold tracking-tight text-slate-900 mb-1.5 line-clamp-2 min-h-[2rem] group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                      {truncateDescription(item?.description)}
                      {item?.description.length > 100 && (
                        <button
                          onClick={() => toggleExpandDescription(item?.description)}
                          className="text-purple-600 hover:text-purple-700 font-medium ml-1 underline"
                        >
                          more
                        </button>
                      )}
                    </p>

                    {/* Pricing Section */}
                    <div className="mb-2">
                      {(() => {
                        const cartItem = cartCourses.find(c => c.id === item.id);

                        // Calculate minimum price from coursePricing
                        const getMinPrice = () => {
                          if (item?.coursePricing && item.coursePricing.length > 0) {
                            const minPrice = Math.min(...item.coursePricing.map(pricing => {
                              const finalPrice = pricing.discount && pricing.discount > 0
                                ? pricing.price - (pricing.price * (pricing.discount / 100))
                                : pricing.price;
                              return finalPrice;
                            }));
                            return minPrice;
                          }
                          return 0;
                        };

                        const minPrice = getMinPrice();

                        if (cartItem && cartItem.finalPrice !== undefined && cartItem.finalPrice !== null) {
                          return (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                ₹{parseFloat(cartItem.finalPrice).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{(parseFloat(cartItem.finalPrice) * 1.5).toFixed(2)}
                              </span>
                            </div>
                          );
                        } else {
                          // Display minimum price by default
                          return (
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div className={`px-1.5 py-0.5 rounded text-xs font-semibold ${minPrice === 0 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                  {minPrice === 0 ? '🆓 FREE' : '🏷️ PAID'}
                                </div>
                                <span className={`text-sm font-bold ${minPrice === 0 ? 'text-green-600' : 'text-purple-600'
                                  }`}>
                                  {minPrice === 0 ? 'Free' : `₹${minPrice.toFixed(2)}`}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 italic">
                                Starting price
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Explore Button */}
                    <button
                      onClick={() => handlePurchaseCourse(item)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-1.5 px-2 text-xs rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button for Drip Courses */}
            {dripCourseList.length > 6 && (
              <div className="flex justify-center mt-8 md:mt-12">
                <button
                  onClick={() => setShowAllDripCourses(!showAllDripCourses)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                >
                  {showAllDripCourses ? (
                    <>
                      <span>Show Less</span>
                      <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>View More Courses ({dripCourseList.length - 6} more)</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {courseList?.length === 0 && dripCourseList?.length === 0 && !loading && (
          <div className="text-center py-16 md:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">No Courses Available</h3>
              <p className="text-gray-600">Check back soon for exciting new courses!</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Dialog
        open={suggestedCourseDialog}
        onClose={() => setSuggestedCourseDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
          }
        }}
      >
        <SuggestedCourseDialog
          addedSuggestCourse={addedSuggestCourse}
          suggestedCourseId={suggestedCourseId}
          handleClose={handleCloseSuggestedCourseDialog}
          onFinalAmountUpdate={handleFinalAmountUpdate}
          setCartCourses={setCartCourses}
          setFinalAmounts={setFinalAmounts}
        />
      </Dialog>

      <Dialog
        open={courseExpandedDescriptions}
        onClose={() => setCourseExpandedDescriptions(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
          }
        }}
      >
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
            {parse(fullDes)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setCourseExpandedDescriptions(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Store;

