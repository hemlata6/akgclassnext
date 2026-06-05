import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import CourseDetailWrapper from '../../page-components/Course/CourseDetailWrapper';

export async function getServerSideProps() {
  return { props: {} };
}

export default function CourseDetail() {
  const router = useRouter();
  const { courseId } = router.query;
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

  const getQueryString = () => {
    const params = new URLSearchParams();
    if (routeData) params.append('isMobile', routeData);
    if (tokenFromUrl) params.append('token', tokenFromUrl);
    const queryStr = params.toString();
    return queryStr ? `?${queryStr}` : '';
  };

  const handleBackToStore = () => {
    router.push(`/store${getQueryString()}`);
  };

  return (
    <>
      <Head>
        <title>Course Details - VG STUDY HUB</title>
        <meta name="description" content="View course details and enroll" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {shouldHideGlobalControls ? (
        <div>
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <button
                onClick={handleBackToStore}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Store
              </button>
            </div>
          </div>
          <CourseDetailWrapper />
        </div>
      ) : (
        <Layout>
          <CourseDetailWrapper />
        </Layout>
      )}
    </>
  );
}
