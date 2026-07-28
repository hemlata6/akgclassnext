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

const Layers = () => <Icons.Book className="w-3.5 h-3.5 text-[#0a459a]" />;
const ChevronDown = ({ className }) => <Icons.ChevronDown className={className} />;
const ArrowRight = ({ className }) => <Icons.ChevronRight className={className} />;
const Smartphone = ({ className }) => <Icons.Phone className={className} />;
const User = ({ className }) => <Icons.User className={className} />;
const ShoppingBag = ({ className }) => <Icons.Cart className={className} />;
const MenuIcon = ({ className }) => <Icons.Menu className={className} />;
const CloseIcon = ({ className }) => <Icons.X className={className} />;

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
    <div className={`fixed bottom-0 left-0 right-0 ${theme.primaryClass} bg-opacity-5 border-t z-50 !grid !grid-cols-5 font-bold shadow-[0_-4px_10px_rgba(0,0,0,0.05)]`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderColor: `var(--theme-primary, #2196F3)` }}>
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
  const { user, logout } = useAuth();
  const { studentData } = useStudent();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domains, setDomains] = useState([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [mobileFacultyOpen, setMobileFacultyOpen] = useState(false);
  const [mobileComboOpen, setMobileComboOpen] = useState(false);
  const [comboDropdownOpen, setComboDropdownOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // REFS FOR CLICK-OUTSIDE DETECTION
  const facultyDropdownRef = useRef(null);
  const exploreDropdownRef = useRef(null);
  const comboDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // SCROLL TRIGGER DETECTOR DETACHMENT STATE
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    fetchDomainsForMenu();
    fetchFacultyForMenu();

    const handleScroll = () => {
      // 40px corresponds to the approx height of the system utility pre-header
      if (window.scrollY > 40) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CLICK OUTSIDE HANDLER FOR DROPDOWNS
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(e.target)) {
        setFacultyDropdownOpen(false);
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(e.target)) {
        setExploreDropdownOpen(false);
      }
      if (comboDropdownRef.current && !comboDropdownRef.current.contains(e.target)) {
        setComboDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDomainsForMenu = async () => {
    try {
      setDomainLoading(true);
      const response = await Network.fetchDomain(instId);
      const availableDomains = response?.domains || [];
      setDomains(availableDomains);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setDomainLoading(false);
    }
  };

  const fetchFacultyForMenu = async () => {
    try {
      setFacultyLoading(true);
      const response = await fetch(`${Endpoints.baseURL}admin/employee/fetch-public-employee/${instId}`);
      const data = await response.json();
      if (data.status && data.employees?.length > 0) {
        setFacultyList(data.employees.filter(fac => fac.showInApp === true));
      } else {
        setFacultyList([
          { id: 1, firstName: 'CA Rishabh', lastName: 'Jain', designation: 'Director & Lead Faculty' },
          { id: 2, firstName: 'Prof. Commerce', lastName: 'Team', designation: 'Faculty Team' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setFacultyList([
        { id: 1, firstName: 'CA Rishabh', lastName: 'Jain', designation: 'Director & Lead Faculty' },
        { id: 2, firstName: 'Prof. Commerce', lastName: 'Team', designation: 'Faculty Team' }
      ]);
    } finally {
      setFacultyLoading(false);
    }
  };

  const handleDomainChildClick = (childDomain, parentDomain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: parentDomain?.id,
      selectedDomainName: parentDomain?.name,
      selectedExamStageId: childDomain.id,
      selectedExamStageName: childDomain.name,
      isMobile: false,
      productType: 'lecture'
    }));
    setExploreDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/store');
  };

  const handleComboDomainClick = (childDomain, parentDomain) => {
    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'header',
      selectedDomainId: parentDomain?.id,
      selectedDomainName: parentDomain?.name,
      selectedExamStageId: childDomain.id,
      selectedExamStageName: childDomain.name,
      isMobile: false,
      productType: 'lecture',
      batchTag: 'Combo'
    }));
    setComboDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/store?batchTag=Combo');
  };

  // Handle faculty click
  const handleFacultyRedirect = (faculty) => {
    const fullName = typeof faculty === 'string'
      ? faculty
      : [faculty?.firstName, faculty?.lastName].filter(Boolean).join(' ');

    if (!fullName) return;
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

  console.log('studentData', studentData)

  return (
    <>
      {/* 1. SYSTEM UTILITY PRE-HEADER (Stays relative, scrolls up away naturally) */}
      {!router.pathname.startsWith('/faculty/') && (
        <div className="bg-[#111827] text-gray-300 text-[11px] font-bold py-3 px-8 flex justify-between items-center tracking-widest relative border-b border-white/5 shadow-inner hidden md:flex">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <a href="mailto:support@rishabhjain.com" className="hover:text-white transition-colors duration-200 font-bold">support@rishabhjain.com</a>
          </div>
          <div className="flex items-center gap-8 font-bold uppercase text-[10px]">
            <Link href="/blog" className="hover:text-white hover:underline decoration-2 transition-all duration-200">Blog</Link>
            <Link href="/free-resources" className="hover:text-white hover:underline decoration-2 transition-all duration-200">Free Resources</Link>
            <a href="#" className="text-yellow-400 font-bold hover:scale-105 transition-transform duration-200">Become Franchise Partner</a>
            <a href="#" className="hover:text-white hover:underline decoration-2 transition-all duration-200">Student Feedback</a>
          </div>
        </div>)}

      {/* 2. DUMMY BUFFER - Replaces layout void spacing ONLY when header snaps to absolute fixed */}
      {isHeaderFixed && <div className="h-[73px] w-full invisible pointer-events-none"></div>}

      {/* 3. MAIN HEADER (Toggles seamlessly between normal path and fixed-top upon scroll breakpoint) */}
      <header className={`${isHeaderFixed ? 'fixed top-0 left-0 w-full z-50 shadow-md' : 'relative z-40'} bg-white/70 border-b border-slate-200/60 px-4 sm:px-8 py-4 flex justify-between items-center backdrop-blur-xl transition-all duration-300 font-bold`}>
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <div onClick={() => router.push('/')} className="flex items-center gap-3 shrink-0 select-none group cursor-pointer">
            <div className="bg-gradient-to-br from-[#0a459a] to-[#05214c] text-white font-bold text-xl px-3 py-2 rounded-xl tracking-tight shadow-[0_4px_12px_rgba(10,69,154,0.3)] transition-transform duration-300 group-hover:scale-105">
              RJCE
            </div>
            <div className="space-y-0.5">
              <h1 className="font-bold text-slate-900 tracking-tight text-xs sm:text-base leading-none group-hover:text-[#0a459a] transition-colors duration-200">RISHABH JAIN</h1>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Commerce Education</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION CONTENT */}
          <div className="hidden lg:flex items-center gap-6 border-l border-slate-200/80 pl-6 relative">

            {/* EXPLORE DROPDOWN BUTTON */}
            <div className="relative" ref={exploreDropdownRef}>
              <button
                onClick={() => {
                  setExploreDropdownOpen(!exploreDropdownOpen);
                  setFacultyDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-[#0a459a] font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
              >
                <Layers /> Explore Lectures
                <ChevronDown className={`w-4 h-4 text-[#0a459a] transition-transform duration-300 ${exploreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exploreDropdownOpen && (
                <div className="absolute left-0 top-[calc(100%+12px)] w-56 bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl p-2 z-50">
                  {domainLoading ? (
                    <div className="px-4 py-3 text-xs text-slate-400 font-bold">Loading categories...</div>
                  ) : domains.length > 0 ? (
                    domains.map((parentDomain) => (
                      (parentDomain.child || []).map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleDomainChildClick(child, parentDomain)}
                          className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-blue-50/70 px-4 py-3 rounded-xl transition-all flex items-center justify-between group"
                        >
                          {child.name}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#0a459a]" />
                        </button>
                      ))
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-slate-400">No categories active</div>
                  )}
                </div>
              )}
            </div>

            {/* NAV LINKS WITH DYNAMIC FACULTY DROPDOWN */}
            <nav className="flex items-center gap-6 text-xs font-bold text-slate-500 tracking-wider uppercase relative">
              <a href="#" className="hover:text-[#0a459a] transition-colors duration-200 flex items-center gap-1">
                Test-Series <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-tighter">Soon</span>
              </a>

              {/* FACULTY DROPDOWN NAV ANCHOR */}
              <div className="relative" ref={facultyDropdownRef}>
                <button
                  onClick={() => {
                    setFacultyDropdownOpen(!facultyDropdownOpen);
                    setExploreDropdownOpen(false);
                  }}
                  className="hover:text-[#0a459a] transition-colors duration-200 flex items-center gap-1 uppercase tracking-wider font-bold"
                >
                  Faculty
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${facultyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {facultyDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+16px)] w-48 bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl p-2 z-50 normal-case">
                    {facultyLoading ? (
                      <div className="px-4 py-3 text-xs text-slate-400 font-bold">Loading...</div>
                    ) : facultyList.length > 0 ? (
                      facultyList.map((fac) => (
                        <button
                          key={fac.id}
                          onClick={() => handleFacultyRedirect(fac)}
                          className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-blue-50/70 px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group"
                        >
                          {[fac.firstName, fac.lastName].filter(Boolean).join(' ')}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#0a459a]" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-slate-400">No active faculty found</div>
                    )}
                  </div>
                )}
              </div>
              {/* COMBO DROPDOWN */}
              <div className="relative" ref={comboDropdownRef}>
                <button
                  onClick={() => {
                    setComboDropdownOpen(!comboDropdownOpen);
                    setExploreDropdownOpen(false);
                    setFacultyDropdownOpen(false);
                  }}
                  className="hover:text-[#0a459a] transition-colors duration-200 flex items-center gap-1 uppercase tracking-wider font-bold"
                >
                  Combo
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${comboDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {comboDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+16px)] w-56 bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl p-2 z-50 normal-case">
                    {domainLoading ? (
                      <div className="px-4 py-3 text-xs text-slate-400 font-bold">Loading categories...</div>
                    ) : domains.length > 0 ? (
                      domains.map((parentDomain) => (
                        (parentDomain.child || []).map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleComboDomainClick(child, parentDomain)}
                            className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-blue-50/70 px-4 py-3 rounded-xl transition-all flex items-center justify-between group"
                          >
                            {child.name}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#0a459a]" />
                          </button>
                        ))
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-slate-400">No categories active</div>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/store?batchTag=F2F%20Pune"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0a459a] transition-colors duration-200"
              >
                F2F Pune
              </Link>
              <Link href="/store?productType=books" className="hover:text-[#0a459a] transition-colors duration-200">Books Hub</Link>
            </nav>
          </div>
        </div>

        {/* RIGHT ACTION ITEMS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setShowAppDownloadModal(true)} className="hidden sm:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0a459a] font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm">
            <Smartphone className="w-3.5 h-3.5 text-[#0a459a]" /> Download Our App
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-gradient-to-r from-[#0a459a] to-[#073373] text-white font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(10,69,154,0.2)] hover:shadow-[0_4px_20px_rgba(10,69,154,0.35)] hover:-translate-y-0.5"
              >
                <User className="w-3.5 h-3.5 text-white" /> <span className="hidden xs:inline">{studentData?.firstName + " " + studentData?.lastName}</span>
                <ChevronDown className={`w-3 h-3 text-white/80 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl p-2 z-50">
                  <button
                    onClick={() => { setShowUserMenu(false); router.push('/my-purchases'); }}
                    className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-blue-50/70 px-4 py-3 rounded-xl transition-all flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    My Purchases
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); router.push('/'); }}
                    className="w-full text-left font-bold text-xs text-red-600 hover:bg-red-50/70 px-4 py-3 rounded-xl transition-all flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="bg-gradient-to-r from-[#0a459a] to-[#073373] text-white font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(10,69,154,0.2)] hover:shadow-[0_4px_20px_rgba(10,69,154,0.35)] hover:-translate-y-0.5">
              <User className="w-3.5 h-3.5 text-white" /> <span className="hidden xs:inline">Student Login</span>
            </button>
          )}

          <button onClick={() => router.push('/cart')} className="p-2 sm:p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative shadow-sm transition-colors duration-200">
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full border border-white text-[9px] text-white flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* MOBILE RESPONSIVE TRIGGER TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
          >
            {mobileMenuOpen ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* MOBILE SLIDEOUT NAV DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[73px] z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-full max-w-[300px] bg-white border-r border-slate-200 h-[calc(100vh-73px)] p-4 flex flex-col justify-between overflow-y-auto shadow-xl">
              <div className="space-y-4">
                <div className="font-bold text-slate-400 text-[10px] tracking-widest uppercase px-2">Explore Lectures</div>
                <div className="flex flex-col gap-1">
                  {domainLoading ? (
                    <div className="px-2 py-1 text-xs text-slate-400">Loading categories...</div>
                  ) : domains.length > 0 ? (
                    domains.map((parentDomain) => (
                      (parentDomain.child || []).map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleDomainChildClick(child, parentDomain)}
                          className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-slate-50 px-3 py-2.5 rounded-xl transition-all"
                        >
                          {child.name}
                        </button>
                      ))
                    ))
                  ) : (
                    <div className="px-2 py-1 text-xs text-slate-400">No categories active</div>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2"></div>

                {/* MOBILE DYNAMIC FACULTY COLLAPSIBLE MENU */}
                <div className="font-bold text-slate-400 text-[10px] tracking-widest uppercase px-2 flex justify-between items-center cursor-pointer" onClick={() => setMobileFacultyOpen(!mobileFacultyOpen)}>
                  <span>Faculty Members</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileFacultyOpen ? 'rotate-180' : ''}`} />
                </div>

                {mobileFacultyOpen && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-slate-100 transition-all duration-300">
                    {/* <Link href="/faculty" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-extrabold text-xs text-[#0a459a] px-3 py-2 hover:bg-slate-50 rounded-xl">
                      View All Faculty
                    </Link> */}
                    {facultyList.map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => handleFacultyRedirect(fac)}
                        className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-slate-50 px-3 py-2 rounded-xl transition-all"
                      >
                        {[fac.firstName, fac.lastName].filter(Boolean).join(' ')}
                      </button>
                    ))}
                  </div>
                )}

                <div className="h-px bg-slate-100 my-2"></div>

                <div className="h-px bg-slate-100 my-2"></div>

                {/* MOBILE COMBO COLLAPSIBLE MENU */}
                <div className="font-bold text-slate-400 text-[10px] tracking-widest uppercase px-2 flex justify-between items-center cursor-pointer" onClick={() => setMobileComboOpen(!mobileComboOpen)}>
                  <span>Combo Batches</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileComboOpen ? 'rotate-180' : ''}`} />
                </div>

                {mobileComboOpen && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-slate-100 transition-all duration-300">
                    {domainLoading ? (
                      <div className="px-2 py-1 text-xs text-slate-400">Loading categories...</div>
                    ) : domains.length > 0 ? (
                      domains.map((parentDomain) => (
                        (parentDomain.child || []).map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleComboDomainClick(child, parentDomain)}
                            className="w-full text-left font-bold text-xs text-slate-700 hover:text-[#0a459a] hover:bg-slate-50 px-3 py-2 rounded-xl transition-all"
                          >
                            {child.name}
                          </button>
                        ))
                      ))
                    ) : (
                      <div className="px-2 py-1 text-xs text-slate-400">No categories active</div>
                    )}
                  </div>
                )}

                <nav className="flex flex-col gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Link href="/store?batchTag=F2F%20Pune" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 hover:bg-slate-50 hover:text-[#0a459a] rounded-xl transition-all">F2F Pune</Link>
                  <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 hover:bg-slate-50 hover:text-[#0a459a] rounded-xl transition-all">Books Hub</Link>
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button onClick={() => { setMobileMenuOpen(false); setShowAppDownloadModal(true); }} className="w-full flex items-center justify-center gap-1.5 bg-[#0a459a] text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md">
                  <Smartphone className="w-3.5 h-3.5 text-white" /> Download Our App
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSignupClick={() => setShowSignupModal(true)} />
      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} onLoginClick={() => { setShowSignupModal(false); setShowLoginModal(true); }} />
      <AppDownloadModal open={showAppDownloadModal} onClose={() => setShowAppDownloadModal(false)} brandColor="#0a459a" />
    </>
  );
};
