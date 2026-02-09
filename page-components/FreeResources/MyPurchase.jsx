import React, { useEffect, useState } from 'react';
import { useAuth } from '../../config/AuthContext';
import { Calendar, Clock, Star, Play, Download, BookOpen, Folder, FolderOpen, FileText, PlayCircle, X, ChevronDown, Music, Eye } from 'lucide-react';
import Network from '../../config/Network';
import Endpoints from '../../config/endpoints';
import instId from '../../config/instituteId';
import YouTubePlayer from './YouTubePlayer';
import { useStudent } from '../../config/StudentContext';
import { useRouter } from 'next/router';

const MyPurchases = () => {
  const router = useRouter();
  const { user, authToken } = useAuth();
  const { isAuthenticated } = useStudent();
  const purchases = user?.purchases || [];
  const [mycourseList, setMyCourseList] = useState([]);
  const [selectedSceduleList, setSelectedSceduleList] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentView, setCurrentView] = useState('courses'); // 'courses' or 'content'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [selectCourse, setSelectCourse] = useState('');
  const [activeCoursesList, setActiveCoursesList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAppDownloadDialog, setShowAppDownloadDialog] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [showAudioModal, setShowAudioModal] = useState(false);

  const handleCloseVideo = () => {
    setopenDialog(false)
  }

  const fetcMyCourse = async () => {
    try {
      let response = await Network.getMyCourses(authToken);
      if (response && (response.courses || response.data)) {
        setMyCourseList(response.courses || response.data || response);
        setActiveCoursesList(response.courses || response.data || response);
      };
    } catch (error) {
      console.log("Error fetching my courses:", error);
    };
  };

  // Recursive function to traverse folders and find content
  const traverseFoldersRecursively = async (courseId, folderId = 0, visitedFolders = new Set(), depth = 0) => {
    const folderKey = `${courseId}_${folderId}`;
    if (visitedFolders.has(folderKey)) {
      return [];
    }
    visitedFolders.add(folderKey);

    const indent = "  ".repeat(depth);

    try {
      const response = await Network.fetchScheduleApi(authToken, courseId, folderId);
      if (!response?.contentList) {
        return [];
      }

      let foundContent = [];

      for (const item of response.contentList) {
        const itemType = item?.entityType?.toLowerCase();

        if (itemType === "folder" && item?.id) {
          const folderContent = await traverseFoldersRecursively(courseId, item.id, visitedFolders, depth + 1);
          foundContent = [...foundContent, ...folderContent];
        } else {
          foundContent.push(item);
        }
      }

      return foundContent;
    } catch (error) {
      console.error(`${indent}Error fetching content for course ${courseId}, folder ${folderId}:`, error);
      return [];
    }
  };

  const getMergedSchedules = async (courseId, folderId = 0) => {
    try {

      let response = await Network.fetchScheduleApi(authToken, courseId, folderId);

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

    if (currentView === 'courses') {
      setSelectedCourse(item);
      setCourseId(item?.id);
      setCurrentView('content');
      getMergedSchedules(item?.id, 0);
      return;
    }

    if (item?.entityType?.toLowerCase() === "folder") {
      setParentId(item?.id);
      getMergedSchedules(courseId, item?.id);
      return;
    }

    if ((item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") && authToken && item?.quiz?.id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('quizData', JSON.stringify(item));
      }
      if (item?.quiz?.attempt === true) {
        // Navigate to result page for already attempted quiz
        router.push('/quiz-result');
      } else {
        // Navigate to test page for new quiz
        router.push('/mcq-test');
      }
      return;
    }
    if (item?.entityType === "note" && authToken) {
      if (item?.note?.note) {
        window.open(Endpoints.mediaBaseUrl + item?.note?.note, "_blank");
      }
      return;
    }
    if (item?.entityType === "video" && authToken) {
      if (item?.video?.youtubeUrl) {
        setSelectedItem(item);
        setopenDialog(true)
      }
      return;
    }
    if (item?.entityType === 'blog') {
      // Create URL-friendly slug from title
      const titleSlug = slugify(item.title || '');
      // Combine courseId, parentId, and slug with hyphens for the route
      const combinedSlug = `${courseId}-${parentId ? parentId : 0}-${titleSlug}`;
      router.push(`/blog/${combinedSlug}`);
      return;
    }

    if (item?.entityType === "audio" && authToken) {
      if (item?.audio?.audio) {
        setSelectedAudio(item);
        setShowAudioModal(true);
      }
      return;
    }

    // Check if content type is supported on web platform
    const contentType = item?.entityType?.toLowerCase();
    const webSupportedTypes = ['video', 'audio', 'quiz', 'folder'];

    if (webSupportedTypes.includes(contentType)) {
      // Content supported on web - open form modal
      setSelectedItem(item);
      setFormModalOpen(true);
    } else {
      // Content not supported on web - show app download dialog
      setShowAppDownloadDialog(true);
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
          }
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourse(null);
    setCourseId(null);
    setParentId(null);
    setSelectedSceduleList([]);
  };

  useEffect(() => {
    fetcMyCourse();
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log('selectedSceduleList', selectedSceduleList);

  // console.log('mycourseList', mycourseList);

  const getProgressPercentage = () => {
    // Mock progress - in a real app, this would come from user progress data
    return Math.floor(Math.random() * 100);
  };

  if (mycourseList.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">My Purchases</h1>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-12 text-center border border-emerald-100">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Courses Purchased Yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven't purchased any courses yet. Browse our course catalog to find courses that match your interests and start your learning journey!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-4 px-2">
            {currentView === 'courses' ? '📚 My Purchases' : `📖 ${selectedCourse?.title || 'Course Content'}`}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            {currentView === 'courses'
              ? 'Access your purchased courses and track your learning progress'
              : 'Navigate through your course content and continue learning'
            }
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        {currentView === 'content' && (
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={goBackToCourses}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 flex items-center justify-center font-semibold shadow-md"
            >
              ← Back to My Purchases
            </button>
            {parentId && (
              <button
                onClick={() => {
                  setParentId(null);
                  getMergedSchedules(courseId, 0);
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 flex items-center justify-center font-semibold shadow-md"
              >
                ← Back to Course Root
              </button>
            )}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Show courses or course content based on currentView */}
          {currentView === 'courses' ? (
            // Show courses
            mycourseList.map((course, i) => (
              <div
                key={course.id || i}
                className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${100 + (i * 100)}ms` }}
              >
                <div
                  onClick={() => handleCardClick(course)}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300 flex flex-col relative"
                >
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 transform group-hover:scale-110 transition-transform duration-300 ${course.active
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : 'bg-gradient-to-r from-slate-400 to-slate-500'
                    }`}>
                    {course.active ? 'ACTIVE' : 'INACTIVE'}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden aspect-video">
                    {course.logo ? (
                      <img
                        src={`${Endpoints.mediaBaseUrl}${course.logo}`}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <BookOpen className="w-16 h-16 text-emerald-500 opacity-70" />
                      </div>
                    )}

                    {/* Course Type Icon */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl p-2">
                      <BookOpen className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
                    {/* Title */}
                    <h3 className="text-slate-800 font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 leading-tight">
                      {course.title || 'Course Title'}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {course.shortDescription || 'Course description not available'}
                    </p>

                    {/* Continue Learning Button */}
                    <div className="mt-auto">
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Continue Learning</span>
                        <span className="xs:hidden">Continue</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Show course content (same as FreeResourcesPage)
            selectedSceduleList.map((item, i) => (
              <div
                key={i}
                className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${100 + (i * 100)}ms` }}
              >
                <div
                  onClick={() => handleCardClick(item)}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300 flex flex-col relative"
                >
                  {/* Content Type Badge */}
                  <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 transform group-hover:scale-110 transition-transform duration-300 ${item?.entityType?.toLowerCase() === "folder"
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                    : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz")
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    }`}>
                    {item?.entityType?.toUpperCase() || 'CONTENT'}
                  </div>

                  {/* Image Section */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                    {item?.thumb ? (
                      <img
                        src={Endpoints.mediaBaseUrl + item?.thumb}
                        alt={item?.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-50 to-amber-50">
                        {item?.entityType?.toLowerCase() === "folder" ?
                          <div className="flex flex-col items-center">
                            <FolderOpen className="w-16 h-16 text-amber-500 opacity-70" />
                            <span className="text-amber-600 font-semibold text-sm mt-1">FOLDER</span>
                          </div> :
                          item?.entityType === "video" ?
                            <PlayCircle className="w-16 h-16 text-emerald-500 opacity-70" /> : item?.entityType === "audio" ?
                              <Music className="w-16 h-16 text-green-500 opacity-70" /> : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ?
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-white font-bold text-2xl">?</span>
                                  </div>
                                  <span className="text-purple-600 font-semibold text-sm">QUIZ</span>
                                </div> :
                                <FileText className="w-16 h-16 text-red-500 opacity-70" />
                        }
                      </div>
                    )}

                    {/* Content Type Icon */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl p-2">
                      {item?.entityType?.toLowerCase() === "folder" ?
                        <Folder className="w-5 h-5 text-amber-300 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" /> :
                        item?.entityType === "video" ?
                          <PlayCircle className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" /> : item?.entityType === "audio" ?
                            <Music className="w-5 h-5 text-green-400 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" /> : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ?
                              <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
                                ?
                              </div> :
                              <FileText className="w-5 h-5 text-white transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                      }
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
                    {/* Title */}
                    <h3 className="text-slate-800 font-bold text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 leading-tight">
                      {item?.title || 'Content Title'}
                    </h3>

                    {/* Footer */}
                    <div className="mt-auto">
                      {/* Date */}
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 mr-2" />
                        <span className="text-slate-500 text-xs">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : "Recently Added"}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 ${item?.entityType?.toLowerCase() === "folder"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/30"
                        : item?.entityType === "audio"
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/30"
                          : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz")
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/30"
                            : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-emerald-500/30"
                        } text-white`}>
                        {item?.entityType?.toLowerCase() === "folder" ? (
                          <>
                            <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Open Folder</span>
                            <span className="xs:hidden">Open</span>
                          </>
                        ) : item?.entityType === "audio" ? (
                          <>
                            <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Listen Audio</span>
                            <span className="xs:hidden">Audio</span>
                          </>
                        ) : (item?.entityType === "quiz" || item?.entityType === "practiseTest" || item?.entityType === "answerQuiz") ? (
                          <>
                            {item?.quiz?.attempt === true ? (
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">?</div>
                            )}
                            <span className="hidden xs:inline">{item?.quiz?.attempt === true ? "View Result" : "Start Quiz"}</span>
                            <span className="xs:hidden">{item?.quiz?.attempt === true ? "Result" : "Quiz"}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Access Now</span>
                            <span className="xs:hidden">Access</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* No Content Found */}
        {((currentView === 'courses' && mycourseList.length === 0) ||
          (currentView === 'content' && selectedSceduleList.length === 0)) && (
            <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                {currentView === 'courses' ? 'No Courses Available' : 'No Content Available'}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                {currentView === 'courses'
                  ? 'Purchase courses to start your learning journey.'
                  : 'This course folder is empty or content is being loaded.'
                }
              </p>
            </div>
          )}

        {/* App Download Dialog */}
        {formModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setFormModalOpen(false)}
          >
            <div className="bg-gradient-to-br from-white/98 to-gray-50/98 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-gray-800 relative overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>

                <button
                  onClick={() => setFormModalOpen(false)}
                  className="absolute right-4 top-4 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/80 text-gray-600 hover:text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    📱 Download Our App
                  </h2>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                    For accessing this content, please install our mobile application
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* App Features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-white text-sm">Access all video content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-white text-sm">Read PDFs and documents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-white text-sm">Enhanced learning experience</span>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.classio.quiz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-4 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download from Play Store
                  </a>

                  <button
                    onClick={() => setShowAppDownloadDialog(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Note */}
                <p className="text-center text-white text-xs">
                  📱 Get the best learning experience with our mobile app
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simple Modal for YouTube Video */}
      {openDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={handleCloseVideo}
            className="fixed top-4 right-4 md:top-8 md:right-8 z-[110] bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-2 md:p-3 transition-all shadow-lg hover:scale-105"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="w-full max-w-[95%] md:max-w-5xl aspect-video px-4">
            <div className="w-full h-full rounded-lg md:rounded-xl overflow-hidden shadow-2xl">
              <YouTubePlayer videoUrl={selectedItem?.video?.youtubeUrl} />
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
            {/* Title */}
            <div className="text-center mb-8 pt-8">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedAudio?.title || 'Audio'}</h2>
              {selectedAudio?.description && (
                <p className="text-gray-300 text-sm max-w-xl mx-auto">{selectedAudio.description}</p>
              )}
            </div>

            {/* Audio Player */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <Music className="w-16 h-16 text-green-500 opacity-80" />
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

    </div>
  );
};

export default MyPurchases;
