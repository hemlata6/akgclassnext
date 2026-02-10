import React, { useState, useEffect } from 'react';
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
        { l: "Call", i: <Icons.Phone />, a: "tel:+" },
        { l: "Cart", i: <Icons.Cart />, action: () => router.push('/cart'), badge: cartCount },
        { l: "Store", i: <Icons.Cart />, action: () => router.push('/store'), h: true },
        { l: "Free", i: <Icons.Book />, action: () => { router.push('/free-resources') } },
        { l: "App", i: <Icons.Download />, action: () => { router.push('/'); setTimeout(() => document.getElementById('free-resources-section')?.scrollIntoView({ behavior: 'smooth' }), 100); } }
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
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

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

  // console.log('institute', institute, instituteAppSettingsModals);


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

  // Fetch domains for Lectures menu
  const fetchDomainsForMenu = async () => {
    try {
      setDomainLoading(true);
      const response = await Network.fetchDomain(instId);
      const availableDomains = response?.domains || [];
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
    if (domain.child && domain.child.length > 0 && !shouldShowSecondLevel) {
      setSelectedParentDomain(domain);
      setSelectedFirstLevelDomain(domain);
      setCurrentLevel('second');
    } else if (domain.child && domain.child.length > 0) {
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

  // Handle first level domain click for Books
  const handleBooksFirstLevelDomainClick = (domain) => {
    if (domain.child && domain.child.length > 0 && !booksShowSecondLevel) {
      setBooksSelectedParentDomain(domain);
      setBooksSelectedFirstLevelDomain(domain);
      setBooksCurrentLevel('second');
    } else if (domain.child && domain.child.length > 0) {
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

  // Handle back button for Books
  const handleBooksBackToFirstLevel = () => {
    setBooksCurrentLevel('first');
    setBooksSelectedParentDomain(null);
    setBooksSelectedFirstLevelDomain(null);
  };

  // Domain hierarchy logic
  const shouldShowSecondLevel = domains.length === 1;
  const firstLevelDomains = shouldShowSecondLevel ? domains[0].child || [] : domains;
  const secondLevelDomains = selectedParentDomain?.child || [];

  // Books domain hierarchy logic
  const booksShowSecondLevel = booksDomains.length === 1;
  const booksFirstLevelDomains = booksShowSecondLevel ? booksDomains[0].child || [] : booksDomains;
  const booksSecondLevelDomains = booksSelectedParentDomain?.child || [];

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
          {subItems && subItems.length > 0 ? (
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

  return (
    <>
      <button
        onClick={() => router.push('/announcements')}
        className="sticky top-0 z-50 bg-slate-900 text-white text-[10px] md:text-xs font-medium py-1.5 overflow-hidden relative w-full hover:bg-slate-800 transition-colors cursor-pointer"
        onMouseEnter={() => setIsMarqueeHovered(true)}
        onMouseLeave={() => setIsMarqueeHovered(false)}
      >
        <div className={`whitespace-nowrap animate-marquee ${isMarqueeHovered ? 'animation-pause' : ''}`} style={{ animationPlayState: isMarqueeHovered ? 'paused' : 'running' }}>
          {announcements.length > 0 && announcements[0]?.title ? (
            <span className="inline-block">
              📢 {announcements[0].title}
            </span>
          ) : (
            <span className="inline-block">
              📢 New CA Final Financial Reporting (FR) Batch Starting Soon!
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              📚 Ind AS Brahmastra Books Now Available.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              🎓 100% Concepts + Exam Oriented Approach.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              📢 New CA Final Financial Reporting (FR) Batch Starting Soon!
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              📚 Ind AS Brahmastra Books Now Available.
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              🎓 100% Concepts + Exam Oriented Approach.
            </span>
          )}
        </div>
      </button>
      <nav className={`sticky top-6 z-50 transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1 border-slate-100' : 'bg-white py-1'}`}>
        <div className={LAYOUT_PADDING}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-slate-600" onClick={() => setMobileMenuOpen(true)}>
                <Icons.Menu />
              </button>
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                {/* <img src={"/logoCA Pankaj Aswani.png"} alt="CA Pankaj Aswani" className="h-16 md:h-16 object-contain" /> */}
                <Typography
                  variant="h5"
                  className="font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 cursor-pointer tracking-tight"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    letterSpacing: '-0.5px'
                  }}
                >
                  CA Pankaj Aswani
                </Typography>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-8 h-full">
              <NavItem
                label="Home"
                onClick={() => router.push('/')}
              />
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => {
                  setHoveredMenu('Lectures');
                  fetchDomainsForMenu();
                }}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  className={`hover:${theme.textClass} transition-colors whitespace-nowrap uppercase text-[11px] tracking-wide font-bold text-slate-600 flex items-center gap-1 py-4`}
                >
                  Lectures <Icons.ChevronDown />
                </button>
                <div className={`absolute top-full left-0 w-64 bg-white border-t-2 ${theme.borderClass} shadow-xl rounded-b-lg overflow-y-auto max-h-[400px] transition-all duration-300 ${hoveredMenu === 'Lectures' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {domainLoading ? (
                    <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.primaryClass} animate-bounce`}></div>
                      <span>Loading...</span>
                    </div>
                  ) : currentLevel === 'first' && firstLevelDomains.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500">No categories available</div>
                  ) : (
                    <>
                      {currentLevel === 'second' && (
                        <button onClick={handleBackToFirstLevel} className={`w-full text-left px-4 py-2.5 text-xs font-semibold text-white ${theme.primaryClass} ${theme.primaryHoverClass} mb-1 flex items-center gap-2 transition-all`}>
                          <Icons.ChevronLeft size={14} />
                          Back to Categories
                        </button>
                      )}
                      {currentLevel === 'first' && firstLevelDomains.map((domain) => (
                        <button key={domain.id} onClick={() => handleFirstLevelDomainClick(domain)} className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center justify-between group ${selectedFirstLevelDomain?.id === domain.id ? `${theme.primaryClass} text-white font-bold` : `text-slate-700 hover:bg-slate-50 hover:${theme.textClass}`}`}>
                          <span className="truncate">{domain.name}</span>
                          {!shouldShowSecondLevel && domain.child && domain.child.length > 0 && (
                            <div className={`flex items-center gap-1 ml-2 flex-shrink-0 ${selectedFirstLevelDomain?.id === domain.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                              <span className="text-[10px] font-semibold">{domain.child.length}</span>
                              <Icons.ChevronRight size={12} />
                            </div>
                          )}
                        </button>
                      ))}
                      {currentLevel === 'second' && selectedParentDomain && (
                        <>
                          <div className={`px-4 py-2 text-xs font-bold text-white ${theme.primaryClass} mb-1 flex items-center gap-2`}>
                            <div className="w-2 h-4 rounded-full bg-white opacity-80"></div>
                            <span>{selectedParentDomain.name}</span>
                          </div>
                          {secondLevelDomains.map((domain) => (
                            <button key={domain.id} onClick={() => handleSecondLevelDomainClick(domain)} className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center gap-2 group ${selectedSecondLevelDomain?.id === domain.id ? `${theme.primaryClass} opacity-60 text-white font-bold` : `text-slate-700 hover:bg-slate-50 hover:${theme.textClass}`}`}>
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${selectedSecondLevelDomain?.id === domain.id ? 'bg-white' : theme.primaryClass}`}></span>
                              <span className="truncate">{domain.name}</span>
                            </button>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => {
                  setHoveredMenu('Books');
                  fetchBooksDomainsForMenu();
                }}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  className={`hover:${theme.textClass} transition-colors whitespace-nowrap uppercase text-[11px] tracking-wide font-bold text-slate-600 flex items-center gap-1 py-4`}
                >
                  Books <Icons.ChevronDown />
                </button>
                <div className={`absolute top-full left-0 w-64 bg-white border-t-2 ${theme.borderClass} shadow-xl rounded-b-lg overflow-y-auto max-h-[400px] transition-all duration-300 ${hoveredMenu === 'Books' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {booksLoading ? (
                    <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.primaryClass} animate-bounce`}></div>
                      <span>Loading...</span>
                    </div>
                  ) : booksCurrentLevel === 'first' && booksFirstLevelDomains.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500">No categories available</div>
                  ) : (
                    <>
                      {booksCurrentLevel === 'second' && (
                        <button onClick={handleBooksBackToFirstLevel} className={`w-full text-left px-4 py-2.5 text-xs font-semibold text-white ${theme.primaryClass} ${theme.primaryHoverClass} mb-1 flex items-center gap-2 transition-all`}>
                          <Icons.ChevronLeft size={14} />
                          Back to Categories
                        </button>
                      )}
                      {booksCurrentLevel === 'first' && booksFirstLevelDomains.map((domain) => (
                        <button key={domain.id} onClick={() => handleBooksFirstLevelDomainClick(domain)} className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center justify-between group ${booksSelectedFirstLevelDomain?.id === domain.id ? `${theme.primaryClass} text-white font-bold` : `text-slate-700 hover:bg-slate-50 hover:${theme.textClass}`}`}>
                          <span className="truncate">{domain.name}</span>
                          {!booksShowSecondLevel && domain.child && domain.child.length > 0 && (
                            <div className={`flex items-center gap-1 ml-2 flex-shrink-0 ${booksSelectedFirstLevelDomain?.id === domain.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                              <span className="text-[10px] font-semibold">{domain.child.length}</span>
                              <Icons.ChevronRight size={12} />
                            </div>
                          )}
                        </button>
                      ))}
                      {booksCurrentLevel === 'second' && booksSelectedParentDomain && (
                        <>
                          <div className={`px-4 py-2 text-xs font-bold text-white ${theme.primaryClass} mb-1 flex items-center gap-2`}>
                            <div className="w-2 h-4 rounded-full bg-white opacity-80"></div>
                            <span>{booksSelectedParentDomain.name}</span>
                          </div>
                          {booksSecondLevelDomains.map((domain) => (
                            <button key={domain.id} onClick={() => handleBooksSecondLevelDomainClick(domain)} className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center gap-2 group ${booksSelectedSecondLevelDomain?.id === domain.id ? `${theme.primaryClass} opacity-60 text-white font-bold` : `text-slate-700 hover:bg-slate-50 hover:${theme.textClass}`}`}>
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${booksSelectedSecondLevelDomain?.id === domain.id ? 'bg-white' : theme.primaryClass}`}></span>
                              <span className="truncate">{domain.name}</span>
                            </button>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <NavItem label="Announcement" onClick={() => router.push('/announcements')} />
              <NavItem label="Free Resources" onClick={() => router.push('/free-resources')} />
              {user && <NavItem label="My Purchases" onClick={() => router.push('/my-purchases')} />}
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Switcher - Hidden by default */}
              <div className="relative hidden">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 rounded-full relative text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                  </svg>
                </button>

                {/* Theme Dropdown */}
                {showThemeMenu && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          changeTheme('purple');
                          setShowThemeMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgb(55, 48, 163)' }}></div>
                        <span>Purple</span>
                      </button>
                      <button
                        onClick={() => {
                          changeTheme('blue');
                          setShowThemeMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#2196F3' }}></div>
                        <span>Blue</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => router.push('/cart')} className={`p-2 rounded-full relative text-slate-700 hover:bg-slate-100 transition-colors`}>
                <Icons.Cart />
                {cartCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">{cartCount}</span>}
              </button>

              {user ? (
                <div className="relative group hidden md:block">
                  <button className={`${theme.primaryClass} ${theme.primaryHoverClass} text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap`}>
                    <Icons.User size={16} />
                    {(studentData?.firstName && studentData?.lastName) ? `${studentData.firstName} ${studentData.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.name}
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-slate-900">{(studentData?.firstName && studentData?.lastName) ? `${studentData.firstName} ${studentData.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.name}</p>
                      {studentData?.email && <p className="text-xs text-slate-500">{studentData.email}</p>}
                    </div>
                    {/* <button 
                      onClick={() => router.push('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => router.push('/orders')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition border-b border-gray-100"
                    >
                      My Orders
                    </button> */}
                    <button
                      onClick={async () => {
                        await logout();
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`hidden md:block text-slate-700 hover:${theme.textClass} px-4 py-2 rounded-lg text-sm font-bold transition-colors`}
                >
                  Login
                </button>
              )}

              <button
                onClick={() => setShowAppDownloadModal(true)}
                className={`hidden md:block ${theme.primaryClass} ${theme.primaryHoverClass} text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-all`}>
                Download App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <Typography
                variant="h6"
                className="font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tight"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.5px'
                }}
              >
                CA Pankaj Aswani
              </Typography>
              {/* <img src={instituteAppSettingsModals?.logo ? Endpoints?.mediaBaseUrl + instituteAppSettingsModals.logo : "logoCA Pankaj Aswani.png"} alt="Logo" className="h-20" /> */}
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <Icons.X />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {/* Home */}
                <button
                  onClick={() => { router.push('/'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                >
                  Home
                </button>

                {/* Lectures */}
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
                    className="w-full flex items-center justify-between px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
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

                {/* Books */}
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
                    className="w-full flex items-center justify-between px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
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

                {/* Announcements */}
                <button
                  onClick={() => { router.push('/announcements'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                >
                  Announcement
                </button>

                {/* Free Resources */}
                <button
                  onClick={() => { router.push('/free-resources'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                >
                  Free Resources
                </button>

                {/* My Purchases (only if logged in) */}
                {user && (
                  <button
                    onClick={() => { router.push('/my-purchases'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 font-bold text-slate-900 text-sm hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                  >
                    My Purchases
                  </button>
                )}
              </div>
            </div>

            {/* User Section / Footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-2">
              {user ? (
                <>
                  <div className="bg-white p-3 rounded-lg border border-slate-100 mb-3">
                    <p className="font-semibold text-slate-900 text-sm">{(studentData?.firstName && studentData?.lastName) ? `${studentData.firstName} ${studentData.lastName}` : (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.name}</p>
                    {studentData?.email && <p className="text-xs text-slate-500 mt-0.5">{studentData.email}</p>}
                  </div>
                  {/* <button
                    onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 font-semibold text-slate-900 text-sm hover:bg-white rounded-lg transition flex items-center gap-2"
                  >
                    <Icons.User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => { router.push('/orders'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 font-semibold text-slate-900 text-sm hover:bg-white rounded-lg transition flex items-center gap-2"
                  >
                    <Icons.Cart size={16} />
                    My Orders
                  </button> */}
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

