import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS, TEXT_GREEN } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';
import { useAuth } from '../../config/AuthContext';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import Endpoints from '../../config/endpoints';

export const BlogListPage = () => {
  const router = useRouter();
  const { authToken } = useAuth();
  const [coursesList, setCoursesList] = useState([]);
  const [selectedScheduleList, setSelectedScheduleList] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);

  console.log('courseId', courseId, parentId);
  console.log('selectedScheduleList', selectedScheduleList);


  useEffect(() => {
    window.scrollTo(0, 0);
    getAllCourses();
  }, []);


  useEffect(() => {
    if (coursesList?.length > 0) {
      // Automatically select first course and fetch its content
      const firstCourse = coursesList[0];
      setCourseId(firstCourse.id);
      setParentId(null);
      getMergedSchedules(firstCourse.id, null);
      setBreadcrumb([
        { id: null, name: 'Courses' },
        { id: firstCourse.id, name: firstCourse.title || `Course ${firstCourse.id}` }
      ]);
    }
  }, [coursesList]);

  const getAllCourses = async () => {
    try {
      const response = await Network.getFreeCourseList(instId);
      const courses = response?.courses || [];
      const filteredCourses = courses.filter(course => course?.active === true);
      setCoursesList(filteredCourses);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setCoursesList([]);
    } finally {
      setLoading(false);
    }
  };

  const getMergedSchedules = async (cId, folderId = null) => {
    try {
      setLoading(true);
      let response = await Network.fetchFreePublicScheduleApi(cId, folderId || 0);

      if (response?.contentList) {
        const content = response.contentList;
        const blogs = content.filter(item => item.entityType === 'blog');
        const foldersData = content.filter(item => item.entityType === 'folder' && item?.drip === false);

        // Display only blogs in the card grid
        setSelectedScheduleList(blogs);
        setFolders(foldersData);
      } else if (response?.data) {
        const content = Array.isArray(response.data) ? response.data : [];
        const blogs = content.filter(item => item.entityType === 'blog');
        const foldersData = content.filter(item => item.entityType === 'folder' && item?.drip === false);

        // Display only blogs in the card grid
        setSelectedScheduleList(blogs);
        setFolders(foldersData);
      } else {
        setSelectedScheduleList([]);
        setFolders([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to load content');
      setSelectedScheduleList([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBlogs();
  // }, []);

  // Slugify helper function for clean URLs
  const slugify = (str) => {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleCardClick = (item) => {
    // If we're at the root level (no courseId selected yet)
    if (!courseId && !item?.entityType) {
      setCourseId(item?.id);
      setParentId(null);
      getMergedSchedules(item?.id, null);
      setBreadcrumb([
        { id: null, name: 'Courses' },
        { id: item?.id, name: item?.title || `Course ${item?.id}` }
      ]);
      return;
    }

    // If item is a folder
    if (item?.entityType?.toLowerCase() === 'folder') {
      setParentId(item?.id);
      getMergedSchedules(courseId, item?.id);
      setBreadcrumb(prev => [
        ...prev.slice(0, 2),
        { id: item?.id, name: item?.title || item?.name || `Folder ${item?.id}` }
      ]);
      return;
    }

    // If item is a blog - navigate to detail
    if (item?.entityType === 'blog') {
      // Create URL-friendly slug from title
      const titleSlug = slugify(item.title || '');
      // Combine courseId, parentId, and slug with hyphens for the route
      const combinedSlug = `${courseId}-${parentId ? parentId : 0}-${titleSlug}`;
      router.push(`/blog/${combinedSlug}`);
      return;
    }

    // If it's a course item without entity type
    if (item?.id && !item?.entityType) {
      setCourseId(item?.id);
      setParentId(null);
      getMergedSchedules(item?.id, null);
      setBreadcrumb([
        { id: null, name: 'Courses' },
        { id: item?.id, name: item?.title || `Course ${item?.id}` }
      ]);
      return;
    }
  };

  const handleFolderSelect = (folder) => {
    if (!folder) {
      // Reset to show all content from course root
      setSelectedFolder(null);
      setParentId(null);
      getMergedSchedules(courseId, null);
      setBreadcrumb(prev => prev.slice(0, 2));
      return;
    }

    // Save current state to history before navigating
    setNavigationHistory(prev => [...prev, {
      selectedFolder: selectedFolder,
      parentId: parentId,
      breadcrumb: [...breadcrumb]
    }]);

    setSelectedFolder(folder);
    setParentId(folder.id);
    getMergedSchedules(courseId, folder.id);

    // Update breadcrumb - remove any existing folder level and add new one
    setBreadcrumb(prev => [
      ...prev.slice(0, 2),
      { id: folder.id, name: folder.name || folder.title }
    ]);
  };

  const handleBack = () => {
    if (navigationHistory.length === 0) {
      // If no history, go to all content
      handleFolderSelect(null);
      return;
    }

    // Get previous state from history
    const previousState = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory(prev => prev.slice(0, -1));

    // Restore previous state
    setSelectedFolder(previousState.selectedFolder);
    setParentId(previousState.parentId);
    setBreadcrumb(previousState.breadcrumb);

    // Fetch content for previous state
    getMergedSchedules(courseId, previousState.parentId || null);
  };

  const handleBreadcrumbClick = (index) => {
    const crumb = breadcrumb[index];

    if (index === 0) {
      setCourseId(null);
      setParentId(null);
      setSelectedFolder(null);
      setSelectedScheduleList(coursesList);
      setFolders([]);
      setBreadcrumb([{ id: null, name: 'Courses' }]);
    } else if (index === 1) {
      setParentId(null);
      setSelectedFolder(null);
      getMergedSchedules(crumb.id, null);
      setBreadcrumb(prev => prev.slice(0, 2));
    } else {
      setSelectedFolder(null);
      getMergedSchedules(courseId, crumb.id);
      setBreadcrumb(prev => prev.slice(0, index + 1));
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 pt-10 pb-16">
        <div className={LAYOUT_PADDING}>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-2 block">
              Knowledge Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Insights & Updates
            </h1>
            <p className="text-slate-500">
              Stay updated with the latest in Financial Reporting, Exam Strategies, and Ind AS Amendments.
            </p>
          </div>
        </div>
      </div>

      <div className={`py-12 ${LAYOUT_PADDING}`}>
        {/* Back Button */}
        {(selectedFolder || navigationHistory.length > 0) && (
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">
              <Icons.Back />
              Back
            </button>
          </div>
        )}

        {/* Folder Tabs */}
        {folders.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleFolderSelect(null)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-2 ${!selectedFolder
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-700 hover:text-indigo-700'
                  }`}
              >
                All Content
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-2 ${selectedFolder?.id === folder.id
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-700 hover:text-indigo-700'
                    }`}
                >
                  <Icons.Folder className="w-4 h-4" />
                  {folder.name || folder.title}
                  <Icons.ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {selectedScheduleList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No content available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedScheduleList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
                  {(typeof item.img === 'string' && item.img) || (typeof item.thumb === 'string' && item.thumb) || (typeof item.logo === 'string' && item.logo) ? (
                    <img
                      src={(typeof item.img === 'string' ? Endpoints?.mediaBaseUrl + item.img : null) || (typeof item.thumb === 'string' ? Endpoints?.mediaBaseUrl + item.thumb : null) || (typeof item.logo === 'string' ? Endpoints?.mediaBaseUrl + item.logo : null)}
                      alt={item.title || 'Content'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {!courseId && !item?.entityType ? (
                        <Icons.Book className="w-16 h-16 text-blue-500 opacity-70" />
                      ) : item?.entityType?.toLowerCase() === 'folder' ? (
                        <Icons.Folder className="w-16 h-16 text-yellow-500 opacity-70" />
                      ) : (
                        <Icons.FileText className="w-16 h-16 text-blue-500 opacity-70" />
                      )}
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                    {item.entityType === 'folder' ? '📁 Folder' : '📄 Content'}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Icons.Calendar /> {item.date || item.createdAt ? (() => {
                        try {
                          const dateStr = item.createdAt || item.date;
                          return new Date(dateStr).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });
                        } catch {
                          return 'Recently Added';
                        }
                      })() : 'Recently Added'}
                    </span>
                    {item.author && typeof item.author === 'string' && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Icons.User /> {item.author}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                    {String(item.title || item.name || 'Untitled')}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    <div dangerouslySetInnerHTML={{ __html: String(item.desc || item.description || 'Click to explore more...') }} />
                    {/* {String(item.desc || item.description || 'Click to explore more...')} */}
                  </p>

                  <button className="mt-4 text-indigo-700 text-xs font-bold flex items-center gap-1 group/btn">
                    {item.entityType === 'folder' ? 'Open Folder' : 'Read More'}{' '}
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

