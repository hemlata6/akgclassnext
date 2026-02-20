import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../config/AuthContext';
import { SuccessNotification, Loader } from '../../components/Shared/SharedComponents';
import CourseDetailPage from './CourseDetailPage';
import Network from '../../config/Network';
import instId from '../../config/instituteId';

function CourseDetailWrapper() {
  const router = useRouter();
  const { courseId } = router.query;
  const { authToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [tokenFromUrl, setTokenFromUrl] = useState(null);

  // Detect query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isMobileParam = params.get('isMobile');
      const tokenParam = params.get('token');

      if (isMobileParam) setRouteData(isMobileParam);
      if (tokenParam) setTokenFromUrl(tokenParam);
    }
  }, []);

  const shouldHideGlobalControls = !!(routeData || tokenFromUrl);

  useEffect(() => {
    if (!courseId) return;

    // Fetch course detail from API
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await Network.getFreeCourseList(instId);

        const courses = response?.courses || response || [];
        // Convert courseId to number for comparison
        const course = courses.find(c => c.id === parseInt(courseId));
        setCourseData(course || null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setCourseData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading) return <Loader />;

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <button onClick={() => router.push('/')} className="bg-brandGreen text-white px-6 py-3 rounded-lg font-bold">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <>
      <SuccessNotification show={showNotification} />
      <CourseDetailPage
        courseData={courseData}
        onBack={() => router.push('/')}
        onAddToCart={addToCart}
      />
    </>
  );
}

export default CourseDetailWrapper;

