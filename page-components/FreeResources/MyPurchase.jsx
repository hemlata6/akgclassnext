import React, { useEffect, useState } from 'react'
import {
    PlayCircle,
    FileText,
    Clock,
    Download,
    X,
    BookOpen,
    ChevronDown,
    Folder,
    FolderOpen,
    Lock,
    Eye,
    Music
} from 'lucide-react';
import Network from '../../config/Network';
import { useAuth } from '../../config/AuthContext';
import { useStudent } from '../../config/StudentContext';
import instId from '../../config/instituteId';
import Endpoints from '../../config/endpoints';
import YouTubePlayer from './YouTubePlayer';
import { useRouter } from 'next/router';
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../constants/Icons';
import LoginModal from '../../components/Auth/LoginModal';
import SignupModal from '../../components/Auth/SignupModal';
import { Footer } from '../../components/Shared/SharedComponents';

const FreeResourcesPage = ({ onPageChange, onQuizNavigation, onAuthAction }) => {

    const router = useRouter();
    const { authToken } = useAuth();
    const { isAuthenticated } = useStudent();
    const [coursesList, setCoursesList] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [activeCoursesList, setActiveCoursesList] = useState([]);
    const [selectedSceduleList, setSelectedSceduleList] = useState([]);
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [selectCourse, setSelectCourse] = useState("");
    const [selectedItem, setSelectedItem] = useState({});
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [selectedQuizItem, setSelectedQuizItem] = useState(null);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollingCourse, setEnrollingCourse] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [openDialog, setopenDialog] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [showAudioModal, setShowAudioModal] = useState(false);

    console.log(';coursesList', coursesList);


    const handleCloseVideo = () => {
        setopenDialog(false)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setIsVisible(true);

        // Call appropriate API based on authentication
        if (authToken && isAuthenticated) {
            fetchEnrolledCourses();
            loadEnrolledCourses(); // Load enrolled courses from accessList
        } else {
            getAllCourses();
        }
    }, [authToken, isAuthenticated]);

    useEffect(() => {
        if (coursesList?.length > 0) {
            setSelectedSceduleList(coursesList);
            setCourseId(null);
            setParentId(null);
        }
    }, [coursesList]);

    const getAccessCourse = async (contentId, contentType = 'course') => {
        try {
            const response = await Network.getAccessCourseApi(authToken, contentId?.id || contentId, contentType);

            return response;
        } catch (error) {
            console.log(error);
            return null;
        };
    }

    // Load enrolled courses from accessList API
    const loadEnrolledCourses = async () => {
        try {
            // Call without contentId to get all user's enrolled courses
            const response = await Network.getAccessCourseApi(authToken, '', 'course');

            if (response?.accessList && Array.isArray(response.accessList)) {
                // Extract course IDs from accessList
                const courseIds = response.accessList
                    .filter(item => item?.course?.id)
                    .map(item => item.course.id);

                setEnrolledCourses(new Set(courseIds));
                console.log('Loaded enrolled courses:', courseIds);
            }
        } catch (error) {
            console.log('Error loading enrolled courses:', error);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await Network.getStudentAuthCourse(authToken);

            if (response?.courses) {
                const course = response.courses || [];
                const ActivefilteredCourses = course.filter(course =>
                    course?.active === true
                );
                setActiveCoursesList(ActivefilteredCourses);

                const filteredCourses = course.filter(course =>
                    course.paid === false &&
                    course?.active === true &&
                    course?.tags?.some(tagObj => tagObj?.tag?.toLowerCase() === "Free Resources".toLowerCase())
                );
                console.log('filteredCourses', filteredCourses);

                setCoursesList(filteredCourses);
            }
        } catch (error) {
            console.log(error);
        };

    }

    const fetchAuthCourseContent = async (courseId, folderId = 0, authToken) => {
        try {

            let response = await Network.fetchAuthStudentContent(courseId, folderId, authToken);

            if (response?.contentList) {
                setSelectedSceduleList(response.contentList);
            } else {
                setSelectedSceduleList([]);
            }
        } catch (error) {
            setSelectedSceduleList([]);
        }
    };

    const getAllCourses = async () => {
        try {
            const response = await Network.getFreeCourseList(instId);
            const course = response?.courses || [];
            const ActivefilteredCourses = course.filter(course =>
                course?.active === true
            );
            setActiveCoursesList(ActivefilteredCourses);

            const filteredCourses = course.filter(course =>
                course.paid === false &&
                course?.active === true &&
                course?.tags?.some(tagObj => tagObj?.tag?.toLowerCase() === "Free Resources".toLowerCase())
            );

            setCoursesList(filteredCourses);
        } catch (error) {
            console.log(error);
        };
    };

    const getMergedSchedules = async (courseId, folderId = 0) => {
        try {

            let response = await Network.fetchFreePublicScheduleApi(courseId, folderId);

            if (response?.contentList) {
                setSelectedSceduleList(response.contentList);
            } else {
                setSelectedSceduleList([]);
            }
        } catch (error) {
            setSelectedSceduleList([]);
        }
    };

    const slugify = (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleCardClick = (item) => {

        if (!courseId && !item?.entityType) {
            // Check if this is a restricted free course that requires enrollment
            if (item?.setting?.restrictFreeContent === true && !enrolledCourses.has(item?.id)) {
                // Check if user is logged in
                const authToken = localStorage.getItem('authToken');
                const studentData = localStorage.getItem('studentData');

                if (!authToken || !studentData) {
                    setSelectedQuizItem(item);
                    setShowLoginWarning(true);
                    return;
                }

                // Show enrollment modal
                setEnrollingCourse(item);
                setShowEnrollModal(true);
                return;
            }

            setCourseId(item?.id);
            setParentId(null);

            // Use authenticated or public API based on login status
            if (authToken && isAuthenticated) {
                fetchAuthCourseContent(item?.id, 0, authToken);
            } else {
                getMergedSchedules(item?.id, 0);
            }
            return;
        }

        if (item?.entityType) {
            if (item?.entityType?.toLowerCase() === "folder") {
                setParentId(item?.id);

                // Use authenticated or public API based on login status
                if (authToken && isAuthenticated) {
                    fetchAuthCourseContent(courseId, item?.id, authToken);
                } else {
                    getMergedSchedules(courseId, item?.id);
                }
                return;
            }

            if ((item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") && item?.quiz?.id) {
                // Check if user is logged in by checking localStorage for auth token
                const authToken = localStorage.getItem('authToken');
                const studentData = localStorage.getItem('studentData');

                if (!authToken || !studentData) {
                    setSelectedQuizItem(item);
                    setShowLoginWarning(true);
                    return;
                }

                // Store quiz data in localStorage for the test page
                if (typeof window !== 'undefined') {
                    localStorage.setItem('quizData', JSON.stringify(item));
                }

                // Check if quiz has already been attempted
                if (item?.quiz?.attempt === true) {
                    // Navigate to result page for already attempted quiz
                    router.push('/quiz-result');
                } else {
                    // Navigate to test page for new quiz
                    router.push('/mcq-test');
                }
                return;
            }

            if (item?.entityType === 'blog') {
                // Create URL-friendly slug from title
                const titleSlug = slugify(item.title || '');
                router.push(`/blog/${item?.id}/${titleSlug}`);
                return;
            } else {
                if (!authToken && !isAuthenticated) {
                    setShowLoginWarning(true)
                }
            }
            if (item?.entityType === "note" && authToken && isAuthenticated) {
                if (item?.note?.note) {
                    window.open(Endpoints.mediaBaseUrl + item?.note?.note, "_blank");
                }
                return;
            } else {
                if (!authToken && !isAuthenticated) {
                    setShowLoginWarning(true)
                }
            }

            if (item?.entityType === "video" && authToken && isAuthenticated) {
                if (item?.video?.youtubeUrl) {
                    setSelectedQuizItem(item);
                    setopenDialog(true)
                }
                return;
            } else {
                if (!authToken && !isAuthenticated) {
                    setShowLoginWarning(true)
                }
            }

            if (item?.entityType === "audio" && authToken && isAuthenticated) {
                if (item?.audio?.audio) {
                    setSelectedAudio(item);
                    setShowAudioModal(true);
                }
                return;
            } else {
                if (!authToken && !isAuthenticated) {
                    setShowLoginWarning(true)
                }
            }

            // For other content types, open the form modal
            setSelectedItem(item);
            // setFormModalOpen(true);
            return;
        }

        if (item?.id && !item?.entityType) {
            setCourseId(item?.id);
            setParentId(null);

            // Use authenticated or public API based on login status
            if (authToken && isAuthenticated) {
                fetchAuthCourseContent(item?.id, 0, authToken);
            } else {
                getMergedSchedules(item?.id, 0);
            }
        }
    };

    const handleClose = () => {
        setFormModalOpen(false);
        setSelectedItem({});
        setName('');
        setNumber('');
        setSelectCourse('');
    };

    const handleChangeCourse = (course) => {
        setSelectCourse(course);
        setIsDropdownOpen(false);
    };

    const handleLoginWarningConfirm = () => {
        if (!authToken && !isAuthenticated) {
            setShowLoginModal(true);
        }
        setShowLoginWarning(false);
        setSelectedQuizItem(null);

    };

    const handleLoginWarningCancel = () => {
        setShowLoginWarning(false);
        setSelectedQuizItem(null);
    };

    const handleEnrollNow = async () => {
        if (!enrollingCourse) return;

        setIsEnrolling(true);
        try {
            // First check if user already has access
            const accessResponse = await getAccessCourse(enrollingCourse);

            // Check if course already exists in accessList
            const hasAccess = accessResponse?.accessList?.some(
                (item) => item?.course?.id === enrollingCourse.id
            );

            if (hasAccess) {
                console.log('User already has access to this course');
                // User already has access, just proceed to open the course
                setEnrolledCourses(prev => new Set([...prev, enrollingCourse.id]));
                setShowEnrollModal(false);

                // Open the course
                setCourseId(enrollingCourse.id);
                setParentId(null);

                if (authToken && isAuthenticated) {
                    fetchAuthCourseContent(enrollingCourse.id, 0, authToken);
                } else {
                    getMergedSchedules(enrollingCourse.id, 0);
                }
                setEnrollingCourse(null);
            } else {
                // User doesn't have access, call assignFreeAccess API
                const body = {
                    contentId: enrollingCourse.id,
                    contentPurchaseType: "course"
                };

                const response = await Network.assignFreeAccess(authToken, body);

                if (response?.errorCode === 0) {
                    // Add course to enrolled courses
                    setEnrolledCourses(prev => new Set([...prev, enrollingCourse.id]));
                    setShowEnrollModal(false);

                    // Now open the course
                    setCourseId(enrollingCourse.id);
                    setParentId(null);

                    // Use authenticated API since user is enrolled
                    if (authToken && isAuthenticated) {
                        fetchAuthCourseContent(enrollingCourse.id, 0, authToken);
                    } else {
                        getMergedSchedules(enrollingCourse.id, 0);
                    }
                    setEnrollingCourse(null);
                } else {
                    alert(response?.message || 'Failed to enroll. Please try again.');
                }
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert('An error occurred during enrollment. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleCancelEnroll = () => {
        setShowEnrollModal(false);
        setEnrollingCourse(null);
    };

    const handleSubmit = async () => {
        try {
            const body = {
                instId: instId,
                firstName: name,
                lastName: name,
                contact: number,
                campaignId: null,
                contentId: selectCourse?.id,
                enquiryType: "course"
            }
            let response = await Network.createLeadFormAPI(body, instId);
            if (response?.errorCode !== 0) {
            } else if (response?.errorCode === 0) {

                handleClose();

                setTimeout(() => {
                    if (selectedItem?.entityType === "video" && selectedItem?.video?.video) {
                        window.open(Endpoints.mediaBaseUrl + selectedItem?.video?.video, "_blank");
                    } else if (selectedItem?.entityType === "note" && selectedItem?.note?.note) {
                        window.open(Endpoints.mediaBaseUrl + selectedItem?.note?.note, "_blank");
                    } else if (selectedItem?.entityType === "blog" && selectedItem?.blog?.blog) {
                        window.open(Endpoints.mediaBaseUrl + selectedItem?.blog?.blog, "_blank");
                    } else if (selectedItem?.entityType === "pdf" && selectedItem?.pdf?.pdf) {
                        window.open(Endpoints.mediaBaseUrl + selectedItem?.pdf?.pdf, "_blank");
                    } else if (selectedItem?.entityType === "document" && selectedItem?.document?.document) {
                        window.open(Endpoints.mediaBaseUrl + selectedItem?.document?.document, "_blank");
                    } else {
                        const fallbackUrl = selectedItem?.url || selectedItem?.link || selectedItem?.contentUrl;
                        if (fallbackUrl) {
                            window.open(fallbackUrl.startsWith('http') ? fallbackUrl : Endpoints.mediaBaseUrl + fallbackUrl, "_blank");
                        }
                    }
                }, 300);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        🎁 Free Educational Resources
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Access premium educational content at no cost. Unlock valuable resources to boost your learning journey.
                    </p>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex gap-2">
                    {/* Back to Courses button - show when we're inside a course */}
                    {courseId && (
                        <button
                            onClick={() => {
                                setCourseId(null);
                                setParentId(null);
                                setSelectedSceduleList(coursesList);
                            }}
                            className={`${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}
                        >
                            ← Back to Courses
                        </button>
                    )}

                    {/* Back to Course Root button - show when we're inside a folder */}
                    {parentId && courseId && (
                        <button
                            onClick={() => {
                                setParentId(null);
                                // Use authenticated or public API based on login status
                                if (authToken && isAuthenticated) {
                                    fetchAuthCourseContent(courseId, 0, authToken);
                                } else {
                                    getMergedSchedules(courseId, 0);
                                }
                            }}
                            className={`${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}
                        >
                            ← Back to Course Root
                        </button>
                    )}
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {selectedSceduleList?.length > 0 && selectedSceduleList?.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                style={{ transitionDelay: `${100 + (i * 100)}ms` }}
                            >
                                <div
                                    onClick={() => handleCardClick(item)}
                                    className="group bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/10 flex flex-col relative"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                        {item?.logo || item?.thumb ? (
                                            <img
                                                src={Endpoints.mediaBaseUrl + (item?.logo || item?.thumb)}
                                                alt={item?.title}
                                                className="w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-yellow-50">
                                                {!courseId && !item?.entityType ? (
                                                    <div className="flex flex-col items-center">
                                                        <BookOpen className="w-16 h-16 text-blue-500 opacity-70" />
                                                        <span className="text-blue-600 font-semibold text-sm mt-1">COURSE</span>
                                                    </div>
                                                ) : item?.entityType?.toLowerCase() === "folder" ? (
                                                    <div className="flex flex-col items-center">
                                                        <FolderOpen className="w-16 h-16 text-yellow-500 opacity-70" />
                                                        <span className="text-yellow-600 font-semibold text-sm mt-1">FOLDER</span>
                                                    </div>
                                                ) : item?.entityType === "video" ? (
                                                    <PlayCircle className="w-15 h-15 text-blue-500 opacity-70" size={60} />
                                                ) : item?.entityType === "audio" ? (
                                                    <Music className="w-15 h-15 text-indigo-500 opacity-70" size={60} />
                                                ) : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                                                            <span className="text-white font-bold text-2xl">?</span>
                                                        </div>
                                                        <span className="text-purple-600 font-semibold text-sm">QUIZ</span>
                                                    </div>
                                                ) : (
                                                    <FileText className="w-15 h-15 text-red-500 opacity-70" size={60} />
                                                )}
                                            </div>
                                        )}

                                        {/* Content Type Icon */}
                                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl p-2">
                                            {!courseId && !item?.entityType ? (
                                                <BookOpen className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                                            ) : item?.entityType?.toLowerCase() === "folder" ? (
                                                <Folder className="w-5 h-5 text-yellow-300 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                                            ) : item?.entityType === "video" ? (
                                                <PlayCircle className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                                            ) : item?.entityType === "audio" ? (
                                                <Music className="w-5 h-5 text-indigo-400 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                                            ) : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ? (
                                                <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
                                                    ?
                                                </div>
                                            ) : (
                                                <FileText className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        {/* Title */}
                                        {/* <h3 className="text-gray-800 font-bold text-base mb-4 line-clamp-2 leading-tight">
                                            {item?.title || 'Resource Title'}
                                        </h3> */}

                                        {/* Footer */}
                                        <div className="mt-auto">
                                            {/* Date */}
                                            {/* <div className="flex items-center mb-4">
                                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                                <span className="text-gray-500 text-xs">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : "Recently Added"}
                                                </span>
                                            </div> */}

                                            {/* Action Button */}
                                            <button onClick={() => handleCardClick(item)} className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white`}>
                                                {!courseId && !item?.entityType ? (
                                                    <>
                                                        <BookOpen className="w-4 h-4" />
                                                        {item?.setting?.restrictFreeContent === true && !enrolledCourses.has(item?.id) ? 'Enroll Now' : 'View Course'}
                                                    </>
                                                ) : item?.entityType?.toLowerCase() === "folder" ? (
                                                    <>
                                                        <FolderOpen className="w-4 h-4" />
                                                        Open Folder
                                                    </>
                                                ) : item?.entityType === "video" ? (
                                                    <>
                                                        <PlayCircle className="w-4 h-4" />
                                                        Watch Video
                                                    </>
                                                ) : item?.entityType === "audio" ? (
                                                    <>
                                                        <Music className="w-4 h-4" />
                                                        Listen Audio
                                                    </>
                                                ) : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ? (
                                                    <>
                                                        {isAuthenticated ? (
                                                            item?.quiz?.attempt === true ? (
                                                                <Eye className="w-4 h-4" />
                                                            ) : (
                                                                <div className="w-4 h-4 bg-white text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">?</div>
                                                            )
                                                        ) : (
                                                            <Lock className="w-4 h-4" />
                                                        )}
                                                        {isAuthenticated ? (item?.quiz?.attempt === true ? "View Result" : "Start Quiz") : "Login to Start Quiz"}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4" />
                                                        Access Now
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Resources Found */}
                {selectedSceduleList?.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Free Resources Available</h3>
                        <p className="text-gray-500">Check back later for new free educational content.</p>
                    </div>
                )}

                {/* Enrollment Modal */}
                {showEnrollModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className={`${BRAND_GREEN_CLASS} p-6 text-white`}>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">🎓</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Enroll in Free Course</h2>
                                    <p className="text-white/90 text-sm">
                                        Get instant access to this premium content
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {enrollingCourse?.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        This course requires enrollment. Click "Enroll Now" to get free access and start learning immediately.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">What you'll get:</h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-indigo-600 mr-2">✓</span>
                                            <span>Lifetime access to course content</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-600 mr-2">✓</span>
                                            <span>Track your learning progress</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-600 mr-2">✓</span>
                                            <span>Access to quizzes and assignments</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-600 mr-2">✓</span>
                                            <span>100% FREE - No hidden charges</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelEnroll}
                                        disabled={isEnrolling}
                                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEnrollNow}
                                        disabled={isEnrolling}
                                        className={`flex-1 py-3 px-4 ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                                    >
                                        {isEnrolling ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Enrolling...</span>
                                            </>
                                        ) : (
                                            <>
                                                <BookOpen className="w-4 h-4" />
                                                <span>Enroll Now</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showLoginWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className={`${BRAND_GREEN_CLASS} p-6 text-white`}>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">🔐</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                                    <p className="text-white/90 text-sm">
                                        You need to be logged in to start the access
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    {/* <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Quiz: {selectedQuizItem?.title}
                                </h3> */}
                                    <p className="text-gray-600 text-sm">
                                        Please login or create an account to access this and track your progress.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleLoginWarningCancel}
                                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLoginWarningConfirm}
                                        className={`flex-1 py-3 px-4 ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                    >
                                        Login Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Video Dialog */}
                {openDialog && (
                    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseVideo}
                            className="absolute top-6 right-6 z-[1300] w-12 h-12 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 font-bold text-2xl"
                        >
                            ✕
                        </button>

                        {/* Video Container */}
                        <div className="w-full h-screen max-w-6xl flex items-center justify-center pt-8 px-4">
                            <div className="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden">
                                <YouTubePlayer videoUrl={selectedQuizItem?.video?.youtubeUrl} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Audio Modal */}
                {showAudioModal && (
                    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAudioModal(false)}
                            className="absolute top-6 right-6 z-[1300] w-12 h-12 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 font-bold text-2xl"
                        >
                            ✕
                        </button>

                        {/* Audio Container */}
                        <div className="w-full max-w-2xl">

                            {/* Audio Player */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <div className="flex items-center justify-center mb-6">
                                    <Music className="w-16 h-16 text-indigo-500 opacity-80" />
                                </div>
                                <audio
                                    controls
                                    className="w-full"
                                    style={{
                                        backgroundColor: '#1f2937',
                                        borderRadius: '12px',
                                        outline: 'none'
                                    }}
                                >
                                    <source src={Endpoints.mediaBaseUrl + selectedAudio?.audio?.audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <p className="text-gray-400 text-sm text-center mt-4">
                                    {selectedAudio?.audio?.duration && `Duration: ${selectedAudio.audio.duration}`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Modal */}
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onSignupClick={() => setShowSignupModal(true)}
                />
                <SignupModal
                    isOpen={showSignupModal}
                    onClose={() => setShowSignupModal(false)}
                    onLoginClick={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}
                />
            </div>
            <Footer />
        </>
    )
}

export default FreeResourcesPage