import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { Base64 } from 'js-base64';
import Layout from '../components/Layout';
import { useAuth } from '../config/AuthContext';
import { useTheme } from '../config/ThemeContext';
import Network from '../config/Network';
import Endpoints from '../config/endpoints';

export default function CAInterTestSeries() {
  const router = useRouter();
  const { courseId, parentId: queryParentId, courseTitle: queryCourseTitle } = router.query;
  const parentId = queryParentId ? parseInt(queryParentId) : 0;

  const { authToken } = useAuth();
  const { theme } = useTheme();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseTitle, setCourseTitle] = useState('CA Inter Test Series');

  useEffect(() => {
    if (queryCourseTitle) setCourseTitle(decodeURIComponent(queryCourseTitle));
  }, [queryCourseTitle]);

  useEffect(() => {
    if (!courseId) return;
    fetchSchedules();
  }, [courseId, parentId, authToken]);

  const loadSchedules = async (targetCourseId, targetParentId) => {
    if (authToken) {
      return Network.fetchScheduleApi(authToken, targetCourseId, targetParentId);
    }

    return Network.fetchFreePublicScheduleApi(targetCourseId, targetParentId);
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await loadSchedules(courseId, parentId);
      const rootContent = response?.contentList || [];

      if (parentId === 0) {
        const firstFolder = rootContent.find(
          (item) => item?.entityType?.toLowerCase() === 'folder' && item?.id && item?.course?.id
        );

        if (firstFolder) {
          const nestedResponse = await loadSchedules(firstFolder.course.id, firstFolder.id);
          setSchedules(nestedResponse?.contentList || []);

          if (!queryCourseTitle && firstFolder?.course?.title) {
            setCourseTitle(firstFolder.course.title);
          }

          return;
        }
      }

      setSchedules(rootContent);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load test series data. Please try again.');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (item) => {
    const payload = {
      courseObj: item?.course || null,
      selectedSchedule: item,
      selectScheduleContent: item,
      selectedItem: item,
      activeStep: 0,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedTestSeriesItem', JSON.stringify(item));
    }

    router.push({
      pathname: '/test_series_details',
      query: {
        courseId: item?.course?.id || courseId,
        parentId: item?.id || 0,
        courseTitle: encodeURIComponent(courseTitle),
        data: Base64.encode(JSON.stringify(payload), true),
      },
    });
  };

  const cardGradients = [
    'from-indigo-600 to-purple-700',
    'from-purple-600 to-pink-600',
    'from-blue-600 to-indigo-700',
    'from-violet-600 to-purple-700',
    'from-indigo-500 to-blue-700',
    'from-fuchsia-600 to-purple-700',
  ];

  return (
    <>
      <Head>
        <title>{courseTitle} - Test Series</title>
        <meta name="description" content={`Explore ${courseTitle} test series options`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50/30">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white py-12 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-3">
                Test Series
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Personalize Your{' '}
                <span className="text-yellow-300">{courseTitle}</span>
              </h1>
              <p className="text-indigo-100 text-base md:text-lg max-w-2xl mx-auto">
                Select your test series portion type, choose your plan, and set your preferred level.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold shrink-0">
                1
              </span>
              <ChevronRight className="text-gray-400" size={18} />
              <span className="text-gray-800 font-semibold text-lg">
                Select Test Series Portion Type
              </span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-indigo-600">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-gray-500">Loading test series...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchSchedules}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* No results */}
            {!loading && !error && schedules.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No test series available at the moment.</p>
              </div>
            )}

            {/* Cards Grid */}
            {!loading && !error && schedules.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((item, index) => {
                  const itemName = typeof item.title === 'string'
                    ? item.title
                    : typeof item.name === 'string'
                      ? item.name
                      : item.name?.name || item.name?.title || `Series ${index + 1}`;
                  const itemDesc = typeof item.description === 'string'
                    ? item.description
                    : typeof item.description?.description === 'string'
                      ? item.description.description
                      : null;
                  const itemLogo = typeof item.logo === 'string'
                    ? item.logo
                    : typeof item.course?.logo === 'string'
                      ? item.course.logo
                      : null;

                  return (
                  <div
                    key={item.id}
                    className={`group bg-gradient-to-br ${cardGradients[index % cardGradients.length]} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
                  >
                    {/* Card logo */}
                    {itemLogo && (
                      <div className="w-full aspect-video rounded-t-2xl overflow-hidden bg-black/20">
                        <img
                          src={`${Endpoints.mediaBaseUrl}${itemLogo}`}
                          alt={itemName}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold mb-3 leading-snug">{itemName}</h3>

                      {itemDesc ? (
                        <p className="text-white/80 text-sm leading-relaxed text-justify mb-6 flex-1 line-clamp-4">
                          {itemDesc}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}

                      <button
                        onClick={() => handleExplore(item)}
                        className="mt-auto flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-sm font-semibold transition-all duration-200 group-hover:bg-white/25"
                      >
                        <span>Explore more</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
