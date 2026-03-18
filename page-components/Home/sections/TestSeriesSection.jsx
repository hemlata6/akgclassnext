import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BookOpen, ArrowRight } from 'lucide-react';
import Endpoints from '../../../config/endpoints';
import { useAuth } from '../../../config/AuthContext';
import { useTheme } from '../../../config/ThemeContext';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';

export const TestSeriesSection = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const [coursesData, setCoursesData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const { authToken } = useAuth();

    const handleExploreNow = (card) => {
        router.push({
            pathname: '/ca_inter_test_series',
            query: {
                courseId: card.id,
                courseTitle: encodeURIComponent(card.title || 'CA Inter Test Series'),
            },
        });
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);

            const response = authToken
                ? await Network.getStudentAuthCourse(authToken)
                : await Network.getFreeCourseList(instId);

            const courses = response?.courses || response || [];

            // ✅ Only filter by title
            const finalCourses = Array.isArray(courses)
                ? courses.filter(
                    (course) => course?.title === "CA Inter May 2026 Test Series"
                )
                : [];

            setCoursesData(finalCourses);
            setError(null);

        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses');
            setCoursesData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Heading */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Test Series
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Practice with our comprehensive test series and assess your preparation level
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {coursesData.map((card) => (
                        <div
                            key={card.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                {card.logo ? (
                                    <img
                                        src={`${Endpoints?.mediaBaseUrl}${card.logo}`}
                                        alt={card.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                        <BookOpen size={40} className="text-indigo-300" />
                                    </div>
                                )}
                            </div>

                            {/* Title + Button */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-3 line-clamp-2">
                                    {card.title}
                                </h3>
                                <button
                                    onClick={() => handleExploreNow(card)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Explore Now
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestSeriesSection;
