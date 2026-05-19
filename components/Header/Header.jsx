import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { useTheme } from '../../config/ThemeContext';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import { useAuth } from '../../config/AuthContext';
import { useStudent } from '../../config/StudentContext';
import LoginModal from '../Auth/LoginModal';
import SignupModal from '../Auth/SignupModal';
import AppDownloadModal from '../Modals/AppDownloadModal';
import Endpoints from '@/config/endpoints';
import { Typography } from '@mui/material';

export const StickyMobileFooter = ({ cartCount }) => {
  const router = useRouter();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const { institute } = useAuth();


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${theme.primaryClass} bg-opacity-5 border-t z-50 !grid !grid-cols-5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderColor: `var(--theme-primary, #2196F3)` }}>
      {[
        { l: "Call", i: <Icons.Phone />, a: `tel:+${institute?.instituteAppSettingsModals?.contact}` },
        { l: "Cart", i: <Icons.Cart />, action: () => router.push('/cart'), badge: cartCount },
        { l: "Store", i: <Icons.Cart />, action: () => router.push('/store'), h: true },
        { l: "Free", i: <Icons.Book />, action: () => { router.push('/free-resources') } },
        { l: "App", i: <Icons.Download />, action: () => { router.push('/download-app'); setTimeout(() => document.getElementById('free-resources-section')?.scrollIntoView({ behavior: 'smooth' }), 100); } }
      ].map((item, idx) => (
        <button
          key={idx}
          onClick={item.action ? item.action : () => window.location.href = item.a}
          className={`flex flex-col items-center justify-center transition-all relative ${item.h ? 'pt-1 pb-3' : 'py-3'}`}
        >
          {item.h ? (
            <>
              <div
                className={`h-14 w-14 ${theme.primaryClass} rounded-full text-white shadow-lg border-4 border-white flex items-center justify-center transform active:scale-95 -mt-8 mb-1 z-10`}
                style={{ backgroundColor: `var(--theme-primary, #2196F3)` }}
              >
                {item.i}
              </div>
              <span className={`text-[10px] font-bold ${theme.textClass}`}>
                {item.l}
              </span>
            </>
          ) : (
            <>
              <div className={`${theme.textClass} relative mb-1 transition-colors`}>
                {item.i}
                {item.badge > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full border border-white"></span>}
              </div>
              <span className={`text-[10px] font-bold ${theme.textClass}`}>
                {item.l}
              </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export const Header = ({ cartCount }) => {

  const router = useRouter();
  const { theme, changeTheme } = useTheme();
  const { user, logout, institute, instituteAppSettingsModals } = useAuth();
  const { studentData } = useStudent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [courses, setCourses] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [showStudentMenu, setShowStudentMenu] = useState(false);
  const studentMenuRef = useRef(null);

  // Domain states for Lectures
  const [domains, setDomains] = useState([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('first');
  const [selectedParentDomain, setSelectedParentDomain] = useState(null);
  const [selectedFirstLevelDomain, setSelectedFirstLevelDomain] = useState(null);
  const [selectedSecondLevelDomain, setSelectedSecondLevelDomain] = useState(null);

  // Domain states for Books
  const [booksDomains, setBooksDomains] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksCurrentLevel, setBooksCurrentLevel] = useState('first');
  const [booksSelectedParentDomain, setBooksSelectedParentDomain] = useState(null);
  const [booksSelectedFirstLevelDomain, setBooksSelectedFirstLevelDomain] = useState(null);
  const [booksSelectedSecondLevelDomain, setBooksSelectedSecondLevelDomain] = useState(null);

  const [expandedLecture, setExpandedLecture] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  // Fetch employee list for Faculty menu
  const fetchEmployeeList = async () => {
    try {
      setEmployeesLoading(true);
      const response = await Network.fetchEmployee(instId);
      if (response?.errorCode === 0 && response?.employees) {
        const filteredEmployees = response.employees.filter(
          emp => emp.showInApp === true
        );
        // console.log('filteredEmployees', filteredEmployees, response)
        setEmployees(filteredEmployees);
      } else {
        // console.log('Failed to fetch employee list:', response?.message || 'Unknown error');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Handle faculty click
  const handleFaculty = (faculty) => {
    const fullName = typeof faculty === 'string'
      ? faculty
      : [faculty?.firstName, faculty?.lastName].filter(Boolean).join(' ');

    const facultyName = fullName.toLowerCase().trim().replace(/\s+/g, '-');
    const facultyState = {
      faculty: faculty,
    };

    router.push(
      {
        pathname: '/faculty/[facultyname]',
        query: {
          facultyname: facultyName,
          state: JSON.stringify(facultyState),
        },
      },
      `/faculty/${facultyName}`
    );
  };

  // console.log('domains', domains, booksDomains);


  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Fetch courses and separate into courses and books
  useEffect(() => {

    fetchCoursesData();
    fetchAnnouncements();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % Math.max(announcementTitles.length, 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {

    fetchEmployeeList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (studentMenuRef.current && !studentMenuRef.current.contains(event.target)) {
        setShowStudentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refresh student data when user changes (e.g., after signup/login)
  useEffect(() => {
    // This will trigger a re-render when studentData updates
  }, [studentData]);

  const fetchCoursesData = async () => {
    try {
      setLoadingCourses(true);
      const response = await Network.getFreeCourseList(instId);
      const allCourses = response?.courses || response || [];

      // Filter active courses and separate by domain
      const activeCourses = Array.isArray(allCourses) ? allCourses.filter(c => c.active === true) : [];

      const courseList = Array.isArray(activeCourses)
        ? activeCourses.filter(c => c.type !== "books")
        : [];

      // Filter books: only active courses that have "Books" domain
      const bookCourses = Array.isArray(activeCourses)
        ? activeCourses.filter(c => c.type === "books")
        : [];

      setCourses(courseList);
      setBooks(bookCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      setBooks([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // console.log('announcements', announcements);


  const fetchAnnouncements = async () => {
    try {
      const response = await Network.getAnnouncementList(instId);
      const announcementList = response?.announcement || response || [];
      setAnnouncements(Array.isArray(announcementList) ? announcementList : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  const announcementTitles = announcements.length > 0
    ? announcements.map((item) => item?.title).filter(Boolean)
    : [
      'Think Selection - JOIN FAST EDUCATION',
      'New CA Inter Batches Starting Soon!',
      'Get 10% Off on All Video Lectures'
    ];

  const studentDisplayName = (studentData?.firstName && studentData?.lastName)
    ? `${studentData.firstName} ${studentData.lastName}`
    : (user?.firstName && user?.lastName)
      ? `${user.firstName} ${user.lastName}`
      : user?.name;

  // Fetch domains for Lectures menu
  const fetchDomainsForMenu = async () => {
    try {
      setDomainLoading(true);
      const response = await Network.fetchDomain(instId);
      const availableDomains = response?.domains || [];
      // console.log('availableDomains', availableDomains);
      setDomains(availableDomains);
      setCurrentLevel('first');
      setSelectedParentDomain(null);
      setDomainLoading(false);
    } catch (error) {
      console.error('Error fetching domains:', error);
      setDomainLoading(false);
    }
  };

  // Fetch domains for Books menu
  const fetchBooksDomainsForMenu = async () => {
    try {
      setBooksLoading(true);
      const response = await Network.fetchDomain(instId);
      const availableDomains = response?.domains || [];
      setBooksDomains(availableDomains);
      setBooksCurrentLevel('first');
      setBooksSelectedParentDomain(null);
      setBooksLoading(false);
    } catch (error) {
      console.error('Error fetching book domains:', error);
      setBooksLoading(false);
    }
  };

  // Handle back button for Lectures
  const handleBackToFirstLevel = () => {
    setCurrentLevel('first');
    setSelectedParentDomain(null);
    setSelectedFirstLevelDomain(null);
  };

  // Handle first level domain click for Lectures
  const handleFirstLevelDomainClick = (domain) => {
    if (domain.child && domain.child?.length > 0 && !shouldShowSecondLevel) {
      setSelectedParentDomain(domain);
      setSelectedFirstLevelDomain(domain);
      setCurrentLevel('second');
    } else if (domain.child && domain.child?.length > 0 && shouldShowSecondLevel) {
      sessionStorage.setItem('storeNavigationState', JSON.stringify({
        source: 'header',
        selectedDomainId: domains?.[0]?.id || domain.id,
        selectedDomainName: domains?.[0]?.name || domain.name,
        selectedExamStageId: domain.id,
        selectedExamStageName: domain.name,
        isMobile: false,
        productType: 'lecture'
      }));
      router.push('/store');
    } else {
      sessionStorage.setItem('storeNavigationState', JSON.stringify({
        source: 'header',
        selectedDomainId: domain.id,
        selectedDomainName: domain.name,
        isMobile: false,
        productType: 'lecture'
      }));
      router.push('/store');
    }
  };

  // Handle second level domain click for Lectures
  const handleSecondLevelDomainClick = (domain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: selectedParentDomain?.id,
      selectedDomainName: selectedParentDomain?.name,
      selectedExamStageId: domain.id,
      selectedExamStageName: domain.name,
      isMobile: false,
      productType: 'lecture'
    }));
    router.push('/store');
  };

  const handleMergedLectureChildClick = (domain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: domain?.__parentId,
      selectedDomainName: domain?.__parentName,
      selectedExamStageId: domain?.id,
      selectedExamStageName: domain?.name,
      isMobile: false,
      productType: 'lecture'
    }));
    router.push('/store');
  };

  // Handle first level domain click for Books
  const handleBooksFirstLevelDomainClick = (domain) => {
    if (domain.child && domain.child?.length > 0 && !booksShowSecondLevel) {
      setBooksSelectedParentDomain(domain);
      setBooksSelectedFirstLevelDomain(domain);
      setBooksCurrentLevel('second');
    } else if (domain.child && domain.child.length > 0 && booksShowSecondLevel) {
      sessionStorage.setItem('storeNavigationState', JSON.stringify({
        source: 'header',
        selectedDomainId: booksDomains?.[0]?.id || domain.id,
        selectedDomainName: booksDomains?.[0]?.name || domain.name,
        selectedExamStageId: domain.id,
        selectedExamStageName: domain.name,
        isMobile: false,
        productType: 'books'
      }));
      router.push('/store');
    } else {
      sessionStorage.setItem('storeNavigationState', JSON.stringify({
        source: 'header',
        selectedDomainId: domain.id,
        selectedDomainName: domain.name,
        isMobile: false,
        productType: 'books'
      }));
      router.push('/store');
    }
  };

  // Handle second level domain click for Books
  const handleBooksSecondLevelDomainClick = (domain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: booksSelectedParentDomain?.id,
      selectedDomainName: booksSelectedParentDomain?.name,
      selectedExamStageId: domain.id,
      selectedExamStageName: domain.name,
      isMobile: false,
      productType: 'books'
    }));
    router.push('/store');
  };

  const handleMergedBookChildClick = (domain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: domain?.__parentId,
      selectedDomainName: domain?.__parentName,
      selectedExamStageId: domain?.id,
      selectedExamStageName: domain?.name,
      isMobile: false,
      productType: 'books'
    }));
    router.push('/store');
  };

  // Handle back button for Books
  const handleBooksBackToFirstLevel = () => {
    setBooksCurrentLevel('first');
    setBooksSelectedParentDomain(null);
    setBooksSelectedFirstLevelDomain(null);
  };

  // Domain hierarchy logic
  const shouldShowSecondLevel = domains?.length === 1;
  const firstLevelDomains = shouldShowSecondLevel ? domains[0].child || [] : domains;
  const secondLevelDomains = selectedParentDomain?.child || [];

  // Books domain hierarchy logic
  const booksShowSecondLevel = booksDomains?.length === 1;
  const booksFirstLevelDomains = booksShowSecondLevel ? booksDomains[0].child || [] : booksDomains;
  const booksSecondLevelDomains = booksSelectedParentDomain?.child || [];

  const mergedLectureSecondLevelDomains = firstLevelDomains.flatMap((parent) =>
    (parent?.child || []).map((child) => ({
      ...child,
      __parentId: parent?.id,
      __parentName: parent?.name,
    }))
  );

  const mergedBookSecondLevelDomains = booksFirstLevelDomains.flatMap((parent) =>
    (parent?.child || []).map((child) => ({
      ...child,
      __parentId: parent?.id,
      __parentName: parent?.name,
    }))
  );

  const NavItem = ({ label, hasSub, subItems, onClick, onSubItemClick, onMouseEnter }) => (
    <div
      className="relative group h-full flex items-center"
      onMouseEnter={() => {
        hasSub && setHoveredMenu(label);
        onMouseEnter && onMouseEnter();
      }}
      onMouseLeave={() => hasSub && setHoveredMenu(null)}
    >
      <button
        onClick={onClick}
        className={`hover:${theme.textClass} transition-colors whitespace-nowrap uppercase text-[11px] tracking-wide font-bold text-slate-600 flex items-center gap-1 py-4`}
      >
        {label} {hasSub && <Icons.ChevronDown />}
      </button>
      {hasSub && (
        <div className={`absolute top-full left-0 w-64 bg-white border-t-2 ${theme.borderClass} shadow-xl rounded-b-lg overflow-y-auto max-h-[400px] transition-all duration-300 ${hoveredMenu === label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
          {subItems && subItems?.length > 0 ? (
            subItems.map((sub, i) => (
              <div
                key={i}
                onClick={() => {
                  if (onSubItemClick && sub.id) {
                    onSubItemClick(sub.id);
                  }
                }}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center group/item"
              >
                <span className={`text-xs font-semibold text-slate-600 group-hover/item:${theme.textClass}`}>{sub.label}</span>
                {sub.tag && <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">{sub.tag}</span>}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-slate-400 text-center">Loading...</div>
          )}
        </div>
      )}
    </div>
  );

  // console.log('firstLevelDomains', firstLevelDomains, secondLevelDomains, shouldShowSecondLevel);

  const MENU_DATA = {
    lectures: ["CA Foundation", "CA Inter", "CA Final", "CS Executive", "CMA Inter"],
    books: ["Textbooks", "Scanner", "Chart Book", "Combos"]
  };

  const menuStructure = [
    { name: 'Home', link: '/', isDropdown: false },
    {
      name: 'Lectures',
      link: '#',
      isDropdown: true,
      dropdownType: 'mega-lectures',
      dropdownData: MENU_DATA.lectures.map((category) => ({
        category,
        courses: courses.slice(0, 6).map((c) => c?.name).filter(Boolean)
      }))
    },
    {
      name: 'Books',
      link: '#',
      isDropdown: true,
      dropdownType: 'mega-books',
      dropdownData: MENU_DATA.books
    },
    {
      name: 'Faculty',
      link: '#',
      isDropdown: true,
      dropdownType: 'simple-list',
      dropdownData: employees.map((e) => [e?.firstName, e?.lastName].filter(Boolean).join(' ')).filter(Boolean)
    },
    { name: 'Free Resources', link: '/free-resources', isDropdown: false },
    { name: 'Blog', link: '/blog', isDropdown: false },
    { name: 'Test-Series', link: 'https://fasttestseries.com/', isDropdown: false },
    ...(user ? [{ name: 'My Purchases', link: '/my-purchases', isDropdown: false }] : [])
  ];

  const navigateTo = (view, data = null) => {
    window.scrollTo(0, 0);
    if (view === 'home' && data) {
      setActiveCategory(data);
      setCurrentView('home');
      setTimeout(() => { const el = document.getElementById('courses'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
      setCurrentView(view);
      if (data) setSelectedItem(data);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 font-sans shadow-lg shadow-slate-200/50">
        <div className="relative bg-white">

          {/* --- A. TOP ANNOUNCEMENT STRIP --- */}
          <div className="bg-[#111827] text-white py-3 text-[13px] font-bold border-b border-white/10 shadow-2xl pl-24 md:pl-44 lg:pl-56 pr-4">
            <div className="flex justify-between items-center">
              <div
                className="flex-1 text-center transition-all duration-700 ease-in-out tracking-wide cursor-pointer"
                onClick={() => router.push('/announcements')}
              >
                <span className="bg-[#e11d48] px-3 py-1 rounded-full mr-4 text-[9px] animate-pulse shadow-lg shadow-[#e11d48]/30 uppercase">Update</span>
                {announcementTitles[announcementIndex]}
              </div>

              <div className="hidden md:flex gap-6 items-center text-[11px] uppercase tracking-widest">
                <div className="flex gap-4 text-gray-400 border-r border-gray-800 pr-6">
                  <a href={institute?.instituteAppSettingsModals?.youtubeLink || '#'} className="hover:text-[#e11d48] cursor-pointer transition-all">YouTube</a>
                  <a href={institute?.instituteAppSettingsModals?.instagramLink || '#'} className="hover:text-[#e11d48] cursor-pointer transition-all">Instagram</a>
                </div>

                <a href={`tel:${institute?.contact || '9584510000'}`} className="bg-[#e11d48] text-white px-5 py-2 rounded-full font-black flex items-center gap-2 shadow-2xl shadow-[#e11d48]/20 normal-case">
                  <span className="text-sm">📞</span> {institute?.contact || '9584510000'}
                </a>

                {user ? (
                  <div className="relative ml-2" ref={studentMenuRef}>
                    <button
                      onClick={() => setShowStudentMenu((prev) => !prev)}
                      className="font-black normal-case text-white truncate max-w-[220px] px-3 py-1 rounded-full bg-white/15 border border-white/30 shadow-lg shadow-black/20 flex items-center gap-2"
                    >
                      <span className="truncate">{studentDisplayName || 'Student'}</span>
                      <Icons.ChevronDown className={`w-3 h-3 transition-transform ${showStudentMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showStudentMenu && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={async () => {
                            await logout();
                            setShowStudentMenu(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-semibold"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="hover:text-[#e11d48] ml-2 font-black transition-colors">Login</button>
                )}
              </div>
            </div>
          </div>

          {/* --- B. MAIN MENU BAR --- */}
          <nav className="bg-white/90 backdrop-blur-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-b border-gray-100 sticky top-[48px] z-50">
            <div className="container mx-auto px-6 flex items-center justify-between h-24">
              <div className="flex items-center hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-[#111827]">
                  <img src="/logo.png" alt="Fast Education" onClick={() => router.push('/')} className="w-20 md:w-40 h-20 md:h-16 object-contain cursor-pointer" />
                </div>
              </div>

              <div className="hidden xl:flex items-center gap-1">
                {menuStructure.map((item) => (
                  <div
                    key={item.name}
                    className="relative group px-3 py-9"
                    onMouseEnter={() => {
                      if (item.name === 'Lectures' && domains.length === 0) fetchDomainsForMenu();
                      if (item.name === 'Books' && booksDomains.length === 0) fetchBooksDomainsForMenu();
                      if (item.name === 'Faculty' && employees.length === 0) fetchEmployeeList();
                    }}
                    onMouseLeave={() => {
                      if (item.name === 'Lectures') handleBackToFirstLevel();
                      if (item.name === 'Books') handleBooksBackToFirstLevel();
                    }}
                  >
                    <a
                      href={item.link}
                      onClick={(e) => {
                        if (item.isDropdown) {
                          e.preventDefault();
                          if (item.name === 'Lectures') fetchDomainsForMenu();
                          if (item.name === 'Books') fetchBooksDomainsForMenu();
                          if (item.name === 'Faculty' && employees.length === 0) fetchEmployeeList();
                        }
                      }}
                      className="text-[#111827] text-[14px] uppercase tracking-tighter font-black group-hover:text-[#e11d48] transition-all flex items-center gap-1.5"
                    >
                      {item.name}
                      {item.isDropdown && <span className="text-[8px] opacity-40 group-hover:rotate-180 transition-transform duration-300">▼</span>}
                    </a>

                    {item.isDropdown && item.dropdownType === 'mega-lectures' && (
                      <div className="absolute top-[96px] left-0 w-72 bg-white shadow-2xl rounded-2xl border border-gray-50 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                        {domainLoading ? (
                          <div className="px-3 py-2 text-sm text-slate-400">Loading...</div>
                        ) : (
                          <>
                            {mergedLectureSecondLevelDomains.length > 0 ? (
                              mergedLectureSecondLevelDomains.map((domain) => (
                                <button
                                  key={`${domain.__parentId}-${domain.id}`}
                                  onClick={() => handleMergedLectureChildClick(domain)}
                                  className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700 rounded-lg transition"
                                >
                                  {domain.name}
                                </button>
                              ))
                            ) : (
                              firstLevelDomains.map((domain) => (
                                <button
                                  key={domain.id}
                                  onClick={() => handleFirstLevelDomainClick(domain)}
                                  className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700 rounded-lg transition"
                                >
                                  {domain.name}
                                </button>
                              ))
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {item.isDropdown && item.dropdownType === 'mega-books' && (
                      <div className="absolute top-[96px] left-0 w-72 bg-white shadow-2xl rounded-2xl border border-gray-50 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                        {booksLoading ? (
                          <div className="px-3 py-2 text-sm text-slate-400">Loading...</div>
                        ) : (
                          <>
                            {mergedBookSecondLevelDomains.length > 0 ? (
                              mergedBookSecondLevelDomains.map((domain) => (
                                <button
                                  key={`${domain.__parentId}-${domain.id}`}
                                  onClick={() => handleMergedBookChildClick(domain)}
                                  className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700 rounded-lg transition"
                                >
                                  {domain.name}
                                </button>
                              ))
                            ) : (
                              booksFirstLevelDomains.map((domain) => (
                                <button
                                  key={domain.id}
                                  onClick={() => handleBooksFirstLevelDomainClick(domain)}
                                  className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700 rounded-lg transition"
                                >
                                  {domain.name}
                                </button>
                              ))
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {item.isDropdown && item.dropdownType === 'simple-list' && (
                      <div className="absolute top-[96px] left-0 w-64 bg-white shadow-2xl rounded-2xl border border-gray-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform group-hover:translate-y-0 translate-y-6 z-50">
                        {item.dropdownData.map((faculty) => (
                          <a
                            key={faculty}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              const selected = employees.find((emp) => [emp?.firstName, emp?.lastName].filter(Boolean).join(' ') === faculty);
                              if (selected) handleFaculty(selected);
                            }}
                            className="block px-6 py-4 text-[#111827] hover:text-white hover:bg-[#e11d48] font-bold text-[14px] transition-all border-b border-gray-50 last:border-0"
                          >
                            {faculty}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                {/* <button className="text-[#111827] hover:text-[#e11d48] text-xl transition-all">🔍</button> */}
                <button onClick={() => router.push('/cart')} className="relative text-[#111827] hover:text-[#e11d48] text-xl transition-all">
                  🛒 <span className="absolute -top-2 -right-3 bg-[#e11d48] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black border-2 border-white">{cartCount || 0}</span>
                </button>
                <button onClick={() => setShowAppDownloadModal(true)} className="bg-[#111827] hover:bg-[#e11d48] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10">Download App</button>
                <button className="xl:hidden text-slate-700 p-1" onClick={() => setMobileMenuOpen(true)}>
                  <Icons.Menu />
                </button>
              </div>
            </div>
          </nav>

          {/* --- C. FLOATING LOGO --- */}
          {/* <div className="absolute top-0 left-0 h-full z-50 flex flex-col justify-center pl-4 md:pl-12 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-white shadow-xl h-[calc(100%+16px)] flex items-center px-6 rounded-b-lg border-b-[3px] border-indigo-600 transform transition-transform hover:translate-y-1 duration-300 origin-top">
              <div className="flex flex-col items-center">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                  <img src="/logo.png" alt="Fast Education" className="w-16 md:w-20 h-16 md:h-16 object-contain" />

                </Link>
              </div>
            </div>
          </div> */}
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <h3 className="font-bold text-lg text-slate-900">Menu</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-900"><Icons.X /></button>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => router.push('/')} className="text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md">Home</button>
                {/* <button className="text-left font-bold text-rose-600 py-3 bg-rose-50 px-2 rounded-md flex items-center gap-2"><Icons.Gift /> Birthday Offer</button> */}
                <div className="">
                  <button
                    onClick={() => {
                      if (openMobileSubmenu === 'courses') {
                        setOpenMobileSubmenu(null);
                        setCurrentLevel('first');
                        setSelectedParentDomain(null);
                      } else {
                        setOpenMobileSubmenu('courses');
                        fetchDomainsForMenu();
                      }
                    }}
                    className="w-full flex items-center justify-between text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md"
                  >
                    <span>Lectures</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'courses' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileSubmenu === 'courses' && (
                    <div className="space-y-1 mt-1 pl-2">
                      {domainLoading ? (
                        <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></div>
                          <span>Loading...</span>
                        </div>
                      ) : currentLevel === 'first' && firstLevelDomains.length === 0 ? (
                        <p className="px-4 py-2 text-xs text-slate-400">No categories available</p>
                      ) : (
                        <>
                          {currentLevel === 'second' && (
                            <button
                              onClick={handleBackToFirstLevel}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-all"
                            >
                              <Icons.ChevronLeft size={14} />
                              Back to Categories
                            </button>
                          )}
                          {currentLevel === 'first' && firstLevelDomains.map((domain) => (
                            <button
                              key={domain.id}
                              onClick={() => {
                                handleFirstLevelDomainClick(domain);
                                if (domain.child && domain.child.length > 0 && shouldShowSecondLevel) {
                                  setMobileMenuOpen(false);
                                  setOpenMobileSubmenu(null);
                                  setCurrentLevel('first');
                                  setSelectedParentDomain(null);
                                }
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between rounded-lg ${selectedFirstLevelDomain?.id === domain.id
                                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                              <span className="truncate">{domain.name}</span>
                              {!shouldShowSecondLevel && domain.child && domain.child.length > 0 && (
                                <Icons.ChevronRight size={16} />
                              )}
                            </button>
                          ))}
                          {currentLevel === 'second' && selectedParentDomain && (
                            <>
                              <div className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg mb-1">
                                {selectedParentDomain.name}
                              </div>
                              {secondLevelDomains.map((domain) => (
                                <button
                                  key={domain.id}
                                  onClick={() => {
                                    handleSecondLevelDomainClick(domain);
                                    setMobileMenuOpen(false);
                                    setOpenMobileSubmenu(null);
                                    setCurrentLevel('first');
                                    setSelectedParentDomain(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                  <span className="truncate">{domain.name}</span>
                                </button>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="">
                  <button
                    onClick={() => {
                      if (openMobileSubmenu === 'books') {
                        setOpenMobileSubmenu(null);
                        setBooksCurrentLevel('first');
                        setBooksSelectedParentDomain(null);
                      } else {
                        setOpenMobileSubmenu('books');
                        fetchBooksDomainsForMenu();
                      }
                    }}
                    className="w-full flex items-center justify-between text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md"
                  >
                    <span>Books</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'books' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileSubmenu === 'books' && (
                    <div className="space-y-1 mt-1 pl-2">
                      {booksLoading ? (
                        <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></div>
                          <span>Loading...</span>
                        </div>
                      ) : booksCurrentLevel === 'first' && booksFirstLevelDomains.length === 0 ? (
                        <p className="px-4 py-2 text-xs text-slate-400">No categories available</p>
                      ) : (
                        <>
                          {booksCurrentLevel === 'second' && (
                            <button
                              onClick={handleBooksBackToFirstLevel}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-2 transition-all"
                            >
                              <Icons.ChevronLeft size={14} />
                              Back to Categories
                            </button>
                          )}
                          {booksCurrentLevel === 'first' && booksFirstLevelDomains.map((domain) => (
                            <button
                              key={domain.id}
                              onClick={() => {
                                handleBooksFirstLevelDomainClick(domain);
                                if (domain.child && domain.child.length > 0 && booksShowSecondLevel) {
                                  setMobileMenuOpen(false);
                                  setOpenMobileSubmenu(null);
                                  setBooksCurrentLevel('first');
                                  setBooksSelectedParentDomain(null);
                                }
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between rounded-lg ${booksSelectedFirstLevelDomain?.id === domain.id
                                ? 'bg-amber-100 text-amber-700 font-semibold'
                                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                                }`}
                            >
                              <span className="truncate">{domain.name}</span>
                              {!booksShowSecondLevel && domain.child && domain.child.length > 0 && (
                                <Icons.ChevronRight size={16} />
                              )}
                            </button>
                          ))}
                          {booksCurrentLevel === 'second' && booksSelectedParentDomain && (
                            <>
                              <div className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 rounded-lg mb-1">
                                {booksSelectedParentDomain.name}
                              </div>
                              {booksSecondLevelDomains.map((domain) => (
                                <button
                                  key={domain.id}
                                  onClick={() => {
                                    handleBooksSecondLevelDomainClick(domain);
                                    setMobileMenuOpen(false);
                                    setOpenMobileSubmenu(null);
                                    setBooksCurrentLevel('first');
                                    setBooksSelectedParentDomain(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 rounded-lg text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                  <span className="truncate">{domain.name}</span>
                                </button>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Faculty Menu */}
                <div className="">
                  <button
                    onClick={() => {
                      if (openMobileSubmenu === 'faculty') {
                        setOpenMobileSubmenu(null);
                      } else {
                        setOpenMobileSubmenu('faculty');
                        if (employees.length === 0) {
                          fetchEmployeeList();
                        }
                      }
                    }}
                    className="w-full flex items-center justify-between text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md"
                  >
                    <span>Faculty</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'faculty' ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileSubmenu === 'faculty' && (
                    <div className="space-y-1 mt-1 pl-2">
                      {employeesLoading ? (
                        <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></div>
                          <span>Loading faculty...</span>
                        </div>
                      ) : employees.length > 0 ? (
                        employees.map((e) => {
                          const fullName = [e?.firstName, e?.lastName].filter(Boolean).join(' ');
                          return (
                            <button
                              key={e?.id || fullName}
                              onClick={() => {
                                handleFaculty(e);
                                setMobileMenuOpen(false);
                                setOpenMobileSubmenu(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              <span className="truncate">{fullName}</span>
                              <Icons.ChevronRight size={16} />
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-4 py-2 text-xs text-slate-400">No faculty available</p>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={() => router.push('/free-resources')} className="text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md">Free Resources</button>

                <button onClick={() => router.push('/blog')} className="text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md">Blog</button>

                <button onClick={() => window.location.href = 'https://fasttestseries.com/'} className="text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md">Test-Series</button>

                {user && <button onClick={() => router.push('/my-purchases')} className="text-left font-medium text-slate-600 py-3 hover:bg-slate-50 px-2 rounded-md">My Purchases</button>}

                {/* Mobile Socials */}
                <div className="flex gap-4 mt-4 px-2">
                  <a href={institute?.instituteAppSettingsModals?.youtubeLink || '#'} className="text-slate-400 hover:text-red-500"><Icons.Youtube /></a>
                  <a href={institute?.instituteAppSettingsModals?.instagramLink || '#'} className="text-slate-400 hover:text-pink-500"><Icons.Instagram /></a>
                  <a href={institute?.instituteAppSettingsModals?.telegramLink || '#'} className="text-slate-400 hover:text-sky-400"><Icons.Telegram /></a>
                  <a href={institute?.instituteAppSettingsModals?.whatsappLink || '#'} className="text-slate-400 hover:text-green-500"><Icons.Whatsapp /></a>
                </div>

                <button onClick={() => setShowAppDownloadModal(true)} className={`bg-slate-900 ${theme.primaryClass} ${theme.primaryHoverClass} text-white px-4 py-3.5 rounded-lg font-bold text-sm mt-6 w-full flex items-center justify-center gap-2`}>
                  <Icons.Download /> Download App
                </button>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 py-4 space-y-2">
                {user ? (
                  <>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 mb-3">
                      <p className="font-semibold text-slate-900 text-sm">{(studentData?.firstName && studentData?.lastName) ? `${studentData.firstName} ${studentData.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.name}</p>
                      {studentData?.email && <p className="text-xs text-slate-500 mt-0.5">{studentData.email}</p>}
                    </div>
                    <button
                      onClick={async () => {
                        await logout();
                        setMobileMenuOpen(false);
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2.5 font-bold text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Icons.X size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-3 font-bold text-white text-sm ${theme.primaryClass} ${theme.primaryHoverClass} rounded-lg transition flex items-center justify-center gap-2`}
                  >
                    <Icons.User size={16} />
                    Login / Signup
                  </button>
                )}
              </div>
            </div>

          </div>
        )}
      </header>
      {/* Login and Signup Modals */}
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
      <AppDownloadModal
        open={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
        brandColor={`var(--theme-primary, #0d5a3e)`}
      />
    </>
  );
};

