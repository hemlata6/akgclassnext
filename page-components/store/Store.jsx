import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../config/AuthContext';
import { ShoppingCart, Star, Clock, Users, CheckCircle, Filter, X } from 'lucide-react';
import Network from '../../config/Network';
import instId from '../../config/instituteId';
import parse from "html-react-parser";
import CourseConfigModal from '../Home/sections/CourseConfigModal';
import Endpoints from '../../config/endpoints';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Footer } from '../../components/Shared/SharedComponents';
import { useTheme } from '../../config/ThemeContext';

// --- THEMED DROPDOWN COMPONENT ---
function ThemeDropdown({ label, options, selectedValue, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider whitespace-nowrap">
                {label}:
            </span>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 py-0.5 text-xs font-bold text-slate-700 focus:outline-none select-none transition-colors hover:text-slate-900"
            >
                <span>{selectedValue}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer transition-colors"
                            style={{
                                backgroundColor: selectedValue === option ? 'var(--theme-primary, #0749A2)' : 'transparent',
                                color: selectedValue === option ? '#ffffff' : undefined,
                            }}
                            onMouseEnter={(e) => {
                                if (selectedValue !== option) {
                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                    e.currentTarget.style.color = '#0f172a';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedValue !== option) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#475569';
                                }
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const Store = () => {

    const { theme } = useTheme();

    // const FILTER_SELECTION_TYPE = {
    //     paper: 'multiple',   // checkbox
    //     product: 'single',   // radio
    //     batch: 'single',     // radio
    //     price: 'single',     // radio
    // };
    const { institute } = useAuth();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [routeData, setRouteData] = useState(null);
    const [tokenFromUrl, setTokenFromUrl] = useState(null);
    const { addPurchase } = useAuth();
    const [loading, setLoading] = useState(false)
    const [fullDes, setFullDes] = useState('');
    const [cartCourses, setCartCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showConfigModal, setShowConfigModal] = useState(false);

    // const [finalAmounts, setFinalAmounts] = useState(0);
    // const [finalAmountsss, setFinalAmountsss] = useState(0);
    // const [selectedSceduleList, setSelectedSceduleList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    // const [showAllCourses, setShowAllCourses] = useState(false);

    // New filter states
    const [domains, setDomains] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null); // Radio button - single selection
    const [selectedExamStage, setSelectedExamStage] = useState(null); // Radio button - single selection
    const [selectedFaculties, setSelectedFaculties] = useState([]); // Checkbox - multiple selection
    const [selectedPapers, setSelectedPapers] = useState([]); // Checkbox - multiple selection
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState(null); // Single selection
    const [productTypes, setProductTypes] = useState([]); // Available product types
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [priceSorting, setPriceSorting] = useState(''); // '' | 'low-to-high' | 'high-to-low'
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [mobileFilterTab, setMobileFilterTab] = useState('exam-type'); // 'exam-type' | 'exam-stage' | 'faculty'
    const [filtersInitialized, setFiltersInitialized] = useState(false);
    const [isProcessingSubmenu, setIsProcessingSubmenu] = useState(false); // Track if we're processing a sidebar submenu selection
    const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(null);
    // const [purchaseSuccess, setPurchaseSuccess
    // 
    // ] = useState(null);
    const [navigationStateChanged, setNavigationStateChanged] = useState(0); // Trigger navigation handler when header navigation happens
    const [pendingBatchTag, setPendingBatchTag] = useState(null); // Pending batch tag from URL query param
    const [pendingStage, setPendingStage] = useState(null); // Pending exam stage from footer URL param
    const [pendingPapers, setPendingPapers] = useState([]); // Pending papers from URL query param (e.g. ?paper=Audit)
    const paperCount = selectedPapers.length;
    const productCount = selectedProductType ? 1 : 0;
    const batchCount = selectedTag ? 1 : 0;
    const priceCount = priceSorting ? 1 : 0;

    // Website brand colors - get from theme
    const primaryColor = theme.primary;
    const primaryColorLight = theme.primary;
    const primaryColorDark = theme.primaryHover;

    const getQueryString = () => {
        const params = new URLSearchParams();
        if (routeData) params.append('isMobile', routeData);
        if (tokenFromUrl) params.append('token', tokenFromUrl);
        const queryStr = params.toString();
        return queryStr ? `?${queryStr}` : '';
    };

    // Check if we should hide global header/footer
    const shouldHideGlobalControls = !!(routeData || tokenFromUrl);

    // console.log('shouldHideGlobalControls', shouldHideGlobalControls)

    useEffect(() => {
        if (shouldHideGlobalControls) {
            setSelectedDomain(null);
            setSelectedExamStage(null);
            setSelectedFaculties([]);
            setSelectedPapers([]);
            setSelectedTag(null);
            setSelectedProductType(null);
            setPriceSorting('');
            setSearchTerm('');
            setFiltersInitialized(true);
            sessionStorage.removeItem('storeFilters');
        }
    }, [shouldHideGlobalControls]);

    // Detect query params on mount and when router is ready
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const isMobileParam = params.get('isMobile');
            const tokenParam = params.get('token');
            const batchTagParam = params.get('batchTag');
            const stageParam = params.get('stage');
            const paperParam = params.get('paper');

            if (isMobileParam) setRouteData(isMobileParam);
            if (tokenParam) setTokenFromUrl(tokenParam);
            if (batchTagParam) setPendingBatchTag(batchTagParam);
            if (stageParam) setPendingStage(stageParam);
            if (paperParam) setPendingPapers(paperParam.split(',').map(p => p.trim()).filter(Boolean));
        }
    }, [router.asPath]);

    useEffect(() => {
        setIsMobile(window.innerWidth >= 600);
        const handleResize = () => {
            setIsMobile(window.innerWidth >= 600);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // console.log('productTypes', productTypes, selectedProductType);


    // Convert hex color to RGB
    const hexToRgb = (hex) => {
        // Handle CSS variable or hex string
        if (hex.includes('var(')) {
            // For CSS variables, parse the theme primary color
            const color = theme.primary;
            if (color.includes('rgb')) {
                const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbMatch) {
                    return {
                        r: parseInt(rgbMatch[1], 10),
                        g: parseInt(rgbMatch[2], 10),
                        b: parseInt(rgbMatch[3], 10)
                    };
                }
            }
            // Fallback to blue theme
            return { r: 33, g: 150, b: 243 };
        }

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 33, g: 150, b: 243 }; // Blue theme default
    };

    const ChevronDownIcon = () => (
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    );

    // Hide layout controls when routeData or token is present
    useEffect(() => {
        if (routeData || tokenFromUrl) {
            sessionStorage.setItem('hideLayoutControls', 'true');
            sessionStorage.setItem('studentToken', tokenFromUrl);
        } else {
            sessionStorage.removeItem('hideLayoutControls');
            sessionStorage.removeItem('studentToken');
        }
        return () => {
            if (!tokenFromUrl) {
                sessionStorage.removeItem('hideLayoutControls');
            }
        };
    }, [routeData, tokenFromUrl]);

    // CSS Injection for subtle vibration animation
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes softVibrate {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.02) rotate(-0.5deg); }
                75% { transform: scale(1.02) rotate(0.5deg); }
            }
            .animate-vibrate {
                animation: softVibrate 2.5s infinite ease-in-out;
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    useEffect(() => {

        window.scrollTo(0, 0);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        getAllCourses();
        fetchDomains();
        fetchFaculties();
        fetchTags();

        // Check if coming from faculty click with facultyFilter
        const facultyFilter = router.query?.facultyFilter;
        const productTypeFromNavigation = router.query?.productType;
        const fromCoursesTag = router.query?.fromCoursesTag;
        const selectedDomainId = router.query?.selectedDomainId;
        const selectedExamStageId = router.query?.selectedExamStageId;

        // Check if coming from CourseExplore or if this is a page refresh
        const fromCourseExplore = sessionStorage.getItem('fromCourseExplore');
        const storePageActive = sessionStorage.getItem('storePageActive');

        // Set product type if coming from navigation
        if (productTypeFromNavigation) {
            setSelectedProductType(productTypeFromNavigation);
        }

        if (facultyFilter) {
            // Coming from faculty click - set only the selected faculty (but NOT exam stage)
            // Only exam type will be set by default, exam stage will NOT be set
            setFiltersInitialized(true);
        } else if (fromCoursesTag) {
            // Coming from CoursesByTag - set only exam type (but NOT exam stage)
            setFiltersInitialized(true);
        } else if (selectedDomainId) {
            // Coming from header navigation with domain/exam stage selection
            // Will be handled by the domain selection useEffect
            // Don't set filtersInitialized yet, let the domain useEffect handle it
        } else if (fromCourseExplore === 'true') {
            // Coming from CourseExplore - restore filters and clear the flag
            const savedFilters = sessionStorage.getItem('storeFilters');
            if (savedFilters) {
                try {
                    const filters = JSON.parse(savedFilters);
                    if (filters.selectedDomain) setSelectedDomain(filters.selectedDomain);
                    if (filters.selectedExamStage) setSelectedExamStage(filters.selectedExamStage);
                    if (filters.selectedFaculties !== undefined) setSelectedFaculties(filters.selectedFaculties);
                    if (filters.selectedPapers) setSelectedPapers(filters.selectedPapers);
                    if (filters.selectedTag) setSelectedTag(filters.selectedTag);
                    if (filters.selectedProductType) setSelectedProductType(filters.selectedProductType);
                    if (filters.priceSorting !== undefined) setPriceSorting(filters.priceSorting);
                    if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
                    setFiltersInitialized(true);
                } catch (error) {
                    console.error('Error restoring filters:', error);
                }
            }
            sessionStorage.removeItem('fromCourseExplore');
        } else if (storePageActive === 'true') {
            // Page refresh or browser back/forward - restore filters
            const savedFilters = sessionStorage.getItem('storeFilters');
            if (savedFilters) {
                try {
                    const filters = JSON.parse(savedFilters);
                    if (filters.selectedDomain) setSelectedDomain(filters.selectedDomain);
                    if (filters.selectedExamStage) setSelectedExamStage(filters.selectedExamStage);
                    if (filters.selectedFaculties !== undefined) setSelectedFaculties(filters.selectedFaculties);
                    if (filters.selectedPapers) setSelectedPapers(filters.selectedPapers);
                    if (filters.selectedTag) setSelectedTag(filters.selectedTag);
                    if (filters.selectedProductType) setSelectedProductType(filters.selectedProductType);
                    if (filters.priceSorting !== undefined) setPriceSorting(filters.priceSorting);
                    if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
                    setFiltersInitialized(true);
                } catch (error) {
                    console.error('Error restoring filters:', error);
                }
            }
        } else {
            // Coming from other routes (Home, Gallery, etc.) - clear filters and reset to defaults
            sessionStorage.removeItem('storeFilters');
        }

        // Mark that Store page is now active
        sessionStorage.setItem('storePageActive', 'true');

        // Cleanup on unmount
        return () => {
            // Clear storePageActive when leaving Store (unless going to CourseExplore)
            // The flag will be set again by handlePurchaseCourse if navigating to CourseExplore
            const isGoingToCourseExplore = sessionStorage.getItem('fromCourseExplore');
            if (isGoingToCourseExplore !== 'true') {
                sessionStorage.removeItem('storePageActive');
                sessionStorage.removeItem('storeFilters');
            }
        };

    }, [])

    // Monitor for storeNavigationState changes from Header (even if already on /store)
    useEffect(() => {
        let lastNavState = sessionStorage.getItem('storeNavigationState');

        const checkForNavStateChange = setInterval(() => {
            const currentNavState = sessionStorage.getItem('storeNavigationState');
            if (currentNavState !== lastNavState) {
                lastNavState = currentNavState;
                setNavigationStateChanged(prev => prev + 1); // Trigger navigation handler
            }
        }, 100); // Check every 100ms for changes

        return () => clearInterval(checkForNavStateChange);
    }, []);

    // Handle domain selection from Header/Footer/CoursesSection/BookStore navigation
    useEffect(() => {
        if (shouldHideGlobalControls) {
            return;
        }
        // First check sessionStorage for navigation state
        const navigationState = sessionStorage.getItem('storeNavigationState');
        if (!navigationState) {
            console.log('No storeNavigationState found, returning');
            return; // No navigation state to process
        }

        let state = null;
        let sourceFromState = null;
        let selectedDomainIdFromState = null;
        let selectedExamStageIdFromState = null;
        let examTypeFromState = null;
        let examStageNameFromState = null;
        let productTypeFromState = null;

        try {
            state = JSON.parse(navigationState);
            sourceFromState = state.source; // 'header', 'footer', 'lecture', 'books'
            selectedDomainIdFromState = state.selectedDomainId;
            selectedExamStageIdFromState = state.selectedExamStageId;
            examTypeFromState = state.selectedDomainName;
            examStageNameFromState = state.selectedExamStageName;
            productTypeFromState = state.productType;
        } catch (error) {
            console.error('Error parsing navigation state:', error);
            sessionStorage.removeItem('storeNavigationState');
            return;
        }

        // CASE 1: From CoursesSection "Explore Store" (lecture) or BookStore "Explore Store" (books)
        // Only set product type, reset other filters
        if ((sourceFromState === 'lecture' || sourceFromState === 'books') && productTypeFromState) {
            // Reset exam type and exam stage (unselect them)
            setSelectedDomain(null);
            setSelectedExamStage(null);
            setSelectedFaculties([]);

            // Set only product type
            if (productTypes.length > 0) {
                const matchedType = productTypes.find(type =>
                    type.toLowerCase() === productTypeFromState.toLowerCase()
                );
                if (matchedType) {
                    setSelectedProductType(matchedType);
                }
            } else {
                // ProductTypes not loaded yet, try again on next render
                return;
            }

            setFiltersInitialized(true);
            sessionStorage.removeItem('storeNavigationState');
            return;
        }

        // CASE 2: From Footer (Courses menu)
        // Only set exam stage based on selected exam stage name (do not change other filters)
        if (sourceFromState === 'footer' && examStageNameFromState) {
            if (domains.length === 0) {
                // Domains not loaded yet, try again on next render
                return;
            }

            // Find the exam stage (child domain) by name across all domains
            const normalizeName = (value) => (value || '')
                .toLowerCase()
                .replace(/\s+/g, ' ')
                .trim();

            const targetStageName = normalizeName(examStageNameFromState);

            let matchedExamStage = null;
            let matchedParentDomain = null;

            // First try to match within currently selected domain (preferred, avoids changing exam type)
            if (selectedDomain && selectedDomain.child && selectedDomain.child.length > 0) {
                const examStage = selectedDomain.child.find(child => {
                    const childName = normalizeName(child.name);
                    return childName.includes(targetStageName) || targetStageName.includes(childName);
                });
                if (examStage) {
                    matchedExamStage = examStage;
                    matchedParentDomain = selectedDomain;
                }
            }

            // Fallback: search across all domains to find the stage
            if (!matchedExamStage) {
                for (const domain of domains) {
                    if (domain.child && domain.child.length > 0) {
                        const examStage = domain.child.find(child => {
                            const childName = normalizeName(child.name);
                            return childName.includes(targetStageName) || targetStageName.includes(childName);
                        });
                        if (examStage) {
                            matchedExamStage = examStage;
                            matchedParentDomain = domain;
                            break;
                        }
                    }
                }
            }

            if (matchedExamStage) {
                setIsProcessingSubmenu(true);
                if (matchedParentDomain && (!selectedDomain || selectedDomain.id !== matchedParentDomain.id)) {
                    setSelectedDomain(matchedParentDomain);
                }
                setSelectedExamStage(matchedExamStage);
            }

            setFiltersInitialized(true);
            sessionStorage.removeItem('storeNavigationState');
            return;
        }

        // CASE 3: From Header (Lectures/Books menu with exam type/stage selection)
        // Set exam type, exam stage, product type - faculty can be selected but not preset
        if ((sourceFromState === 'header' || !sourceFromState) && selectedDomainIdFromState) {
            if (domains.length === 0) {
                // Domains not loaded yet, try again on next render
                return;
            }

            let parentDomain = null;
            let examStage = null;

            // First, check if it's a parent domain (parentId === 0)
            parentDomain = domains.find(d => d.id === selectedDomainIdFromState && d.parentId === 0);

            if (parentDomain) {
                // selectedDomainId is an exam type (parent domain)
                setSelectedDomain(parentDomain);

                // If exam stage is also provided, find it in children
                if (selectedExamStageIdFromState && parentDomain.child && parentDomain.child.length > 0) {
                    examStage = parentDomain.child.find(child => child.id === selectedExamStageIdFromState);
                    if (examStage) {
                        setSelectedExamStage(examStage);
                    }
                }
            } else {
                // selectedDomainId might be an exam stage (child domain)
                // Need to find its parent
                for (const domain of domains) {
                    if (domain.parentId === 0 && domain.child && domain.child.length > 0) {
                        const foundChild = domain.child.find(c => c.id === selectedDomainIdFromState);
                        if (foundChild) {
                            parentDomain = domain;
                            examStage = foundChild;
                            break;
                        }
                    }
                }

                if (parentDomain) {
                    setSelectedDomain(parentDomain);
                    if (examStage) {
                        setSelectedExamStage(examStage);
                    }
                }
            }

            // Set product type if available (header navigation includes product type)
            if (productTypeFromState) {
                if (productTypes.length > 0) {
                    const matchedType = productTypes.find(type =>
                        type.toLowerCase() === productTypeFromState.toLowerCase()
                    );
                    if (matchedType) {
                        setSelectedProductType(matchedType);
                    }
                } else {
                    // ProductTypes not loaded yet, try again on next render
                    return;
                }
            }

            setFiltersInitialized(true);
            sessionStorage.removeItem('storeNavigationState');
        }
    }, [domains, productTypes, navigationStateChanged, shouldHideGlobalControls])

    // Handle pending exam stage selection (when coming from sidebar submenu)
    useEffect(() => {
        if (shouldHideGlobalControls) {
            return;
        }
        const pendingStage = sessionStorage.getItem('pendingExamStageSelection');

        if (pendingStage && isProcessingSubmenu && domains.length > 0) {
            try {
                const examStage = JSON.parse(pendingStage);
                // Find the parent domain of this exam stage
                const parentDomain = domains.find(d => d.id === examStage.parentId);
                if (parentDomain) {
                    setSelectedDomain(parentDomain);
                    setSelectedExamStage(examStage);
                }
                // Clear the pending selection
                sessionStorage.removeItem('pendingExamStageSelection');
            } catch (error) {
                console.error('Error processing pending exam stage:', error);
                sessionStorage.removeItem('pendingExamStageSelection');
            }
        }
    }, [domains, isProcessingSubmenu, shouldHideGlobalControls]);

    // Set default selections when data is loaded
    useEffect(() => {
        if (shouldHideGlobalControls) {
            return;
        }
        const facultyFilter = router.query?.facultyFilter;
        const fromCoursesTag = router.query?.fromCoursesTag;
        const selectedDomainIdFromState = router.query?.selectedDomainId;

        // Skip default selection if we're processing a submenu selection
        if (isProcessingSubmenu) {
            return;
        }

        // Skip default selection if coming from header navigation
        if (selectedDomainIdFromState) {
            return;
        }

        // Skip default selection if processing a stage from footer URL param
        if (pendingStage) {
            return;
        }

        if (domains.length > 0 && !selectedDomain) {
            // Select first exam type by default
            const firstDomain = domains.find(d => d.parentId === 0);
            if (firstDomain) {
                setSelectedDomain(firstDomain);

                // Only select first exam stage by default if NOT coming from CoursesByTag or Faculty
                if (!fromCoursesTag && !facultyFilter && firstDomain.child && firstDomain.child.length > 0) {
                    setSelectedExamStage(firstDomain.child[0]);
                }
            }
        }
    }, [domains, router.query, isProcessingSubmenu, shouldHideGlobalControls]);

    // Auto-select exam stage based on selected domain (when user selects a different exam type in sidebar)
    // This should NOT override user's manual selection in the sidebar
    useEffect(() => {
        if (shouldHideGlobalControls) {
            return;
        }
        const facultyFilter = router.query?.facultyFilter;
        const fromCoursesTag = router.query?.fromCoursesTag;

        // Skip auto-selection if coming from CoursesByTag or Faculty
        if ((facultyFilter || fromCoursesTag) && selectedExamStage) {
            return;
        }

        // Skip auto-selection while processing a submenu/footer selection
        if (isProcessingSubmenu) {
            if (selectedExamStage) {
                // Clear the flag now that exam stage is set
                setIsProcessingSubmenu(false);
            }
            return;
        }

        // Only auto-select exam stage if:
        // 1. There's a selected domain
        // 2. There's NO selected exam stage yet (user hasn't chosen one)
        // 3. The domain has children (exam stages)
        if (selectedDomain && !selectedExamStage && domains.length > 0) {
            // Find the parent domain to get its children (exam stages)
            const parentDomain = domains.find(d => d.id === selectedDomain.parentId);
            if (parentDomain && parentDomain.child && parentDomain.child.length > 0) {
                // Find the matching exam stage in the parent's children
                const matchingStage = parentDomain.child.find(c => c.id === selectedDomain.id);
                if (matchingStage) {
                    setSelectedExamStage(matchingStage);
                } else {
                    // Set the first exam stage from the parent's children
                    setSelectedExamStage(parentDomain.child[0]);
                }
            }
        }
    }, [selectedDomain, domains, isProcessingSubmenu, shouldHideGlobalControls])

    // Select all faculties by default or specific faculty if coming from faculty click
    useEffect(() => {
        if (shouldHideGlobalControls) {
            return;
        }
        const facultyFilter = router.query?.facultyFilter;

        if (facultyFilter && faculties.length > 0) {
            // Coming from faculty click - select only the specific faculty
            const matchingFaculty = faculties.find(f => f.id === facultyFilter.id);
            if (matchingFaculty) {
                setSelectedFaculties([matchingFaculty]);
            }
        } else if (faculties.length > 0 && selectedFaculties.length === 0 && !filtersInitialized) {
            // Default behavior - select all faculties
            setSelectedFaculties(faculties);
        }
    }, [faculties, filtersInitialized, router.query, shouldHideGlobalControls]);

    // Select batch tag from URL query param (e.g. ?batchTag=F2F from F2F Pune header button)
    useEffect(() => {
        if (shouldHideGlobalControls || !pendingBatchTag) {
            return;
        }
        if (pendingBatchTag && tags.length > 0) {
            const matchingTag = tags.find(t =>
                t.tag?.toLowerCase() === pendingBatchTag.toLowerCase() ||
                String(t.id) === String(pendingBatchTag)
            );
            if (matchingTag) {
                setSelectedTag(matchingTag);
            }
            setPendingBatchTag(null); // Clear pending state regardless of match
            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete('batchTag');
            window.history.replaceState({}, '', url.toString());
        }
    }, [tags, pendingBatchTag, shouldHideGlobalControls]);

    // Select exam stage from footer URL param (e.g. ?stage=CA-Intermediate)
    useEffect(() => {
        if (shouldHideGlobalControls || !pendingStage) {
            return;
        }
        if (pendingStage && domains.length > 0) {
            const normalizeName = (value) => (value || '')
                .toLowerCase()
                .replace(/[\s-]+/g, ' ')
                .trim();

            const targetStage = normalizeName(pendingStage);
            let matchedStage = null;
            let matchedDomain = null;

            for (const domain of domains) {
                if (domain.child && domain.child.length > 0) {
                    const stage = domain.child.find(child => {
                        const childName = normalizeName(child.name);
                        return childName.includes(targetStage) || targetStage.includes(childName);
                    });
                    if (stage) {
                        matchedStage = stage;
                        matchedDomain = domain;
                        break;
                    }
                }
            }

            if (matchedStage) {
                if (matchedDomain && (!selectedDomain || selectedDomain.id !== matchedDomain.id)) {
                    setSelectedDomain(matchedDomain);
                }
                setSelectedExamStage(matchedStage);
            }

            setPendingStage(null);

            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('stage');
            window.history.replaceState({}, '', url.toString());
        }
    }, [domains, pendingStage, shouldHideGlobalControls]);

    // Select papers from URL query param (e.g. ?paper=Audit) so a shared link pre-selects them
    useEffect(() => {
        if (shouldHideGlobalControls || pendingPapers.length === 0) {
            return;
        }
        if (pendingPapers.length > 0 && domains.length > 0) {
            const normalizeName = (value) => (value || '')
                .toLowerCase()
                .replace(/[\s-]+/g, ' ')
                .trim();

            const targets = pendingPapers.map(normalizeName);

            let matchedPapers = [];
            let matchedExamStage = null;
            let matchedDomain = null;

            const searchNodes = (nodes, depth, parentStage, parentDomain) => {
                for (const node of nodes) {
                    const nodeName = normalizeName(node.name);
                    const isPaperMatch = targets.some(target =>
                        nodeName === target || nodeName.includes(target) || target.includes(nodeName)
                    );
                    if (isPaperMatch) {
                        matchedPapers.push(node);
                        if (!matchedExamStage) matchedExamStage = parentStage || (depth === 1 ? node : null);
                        if (!matchedDomain) matchedDomain = parentDomain;
                    }
                    if (node.child && node.child.length > 0) {
                        const nextStage = depth === 1 ? node : parentStage;
                        searchNodes(node.child, depth + 1, nextStage, parentDomain);
                    }
                }
            };

            domains.filter(d => d.parentId === 0).forEach(domain => {
                searchNodes(domain.child || [], 1, null, domain);
            });

            if (matchedPapers.length > 0) {
                setSelectedPapers(matchedPapers);
                if (matchedDomain && (!selectedDomain || selectedDomain.id !== matchedDomain.id)) {
                    setSelectedDomain(matchedDomain);
                }
                if (matchedExamStage) {
                    setSelectedExamStage(matchedExamStage);
                }
            }

            setPendingPapers([]);
        }
    }, [domains, pendingPapers, shouldHideGlobalControls]);

    // Keep the URL in sync with selected papers (e.g. ?paper=Audit,Law) so it can be shared
    useEffect(() => {
        if (typeof window === 'undefined' || shouldHideGlobalControls) {
            return;
        }
        const url = new URL(window.location.href);
        if (selectedPapers.length > 0) {
            url.searchParams.set('paper', selectedPapers.map(p => p.name).join(','));
        } else {
            url.searchParams.delete('paper');
        }
        window.history.replaceState({}, '', url.toString());
    }, [selectedPapers, shouldHideGlobalControls]);

    // Select 'lecture' product type by default
    // useEffect(() => {
    //   if (productTypes.length > 0 && !selectedProductType) {
    //     const lectureType = productTypes.find(type => type.toLowerCase() === 'lecture');
    //     if (lectureType) {
    //       setSelectedProductType(lectureType);
    //     }
    //   }
    // }, [productTypes]);


    const FilterOption = ({ label, selected, onClick, theme }) => {
        return (
            <label
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs
        ${selected ? theme.activeBg : 'hover:bg-gray-100'}
      `}
            >
                <span className="truncate">{label}</span>

                <input
                    type="radio"
                    checked={selected}
                    onChange={onClick}
                    className="accent-current ml-3 scale-125" // 👈 increase size
                />
            </label>
        );
    };


    // Fetch domains
    const fetchDomains = async () => {
        try {
            const response = await fetch(`${Endpoints.baseURL}domain/fetch-public?instId=${instId}`);
            const data = await response.json();
            if (data.status && data.domains) {
                setDomains(data.domains);
            }
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    // Fetch faculties
    const fetchFaculties = async () => {
        try {
            const response = await fetch(`${Endpoints.baseURL}admin/employee/fetch-public-employee/${instId}`);
            const data = await response.json();
            if (data.status && data.employees) {
                setFaculties(data.employees);
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    // Fetch tags
    const fetchTags = async () => {
        try {
            const data = await Network.fetchTags(instId);
            if (data.status && data.tags) {
                let newList = data.tags.filter(tag => tag.availablePublic === true && tag.tag !== 'Trending Courses');
                setTags(newList);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    // Filter courses based on selected filters
    useEffect(() => {

        // Only filter if we have courses to filter from
        if (allCourses && allCourses.length > 0) {
            filterCourses();
        }

        // Save current filter state whenever filters change (but only if we have data loaded)
        // Only save to storeFilters if we're NOT currently processing storeNavigationState
        const navigationState = sessionStorage.getItem('storeNavigationState');
        if (!shouldHideGlobalControls && !navigationState && (domains.length > 0 || faculties.length > 0)) {
            const filterState = {
                selectedDomain,
                selectedExamStage,
                selectedFaculties,
                selectedPapers,
                selectedTag,
                selectedProductType,
                priceSorting,
                searchTerm
            };
            sessionStorage.setItem('storeFilters', JSON.stringify(filterState));
        }
    }, [selectedDomain, selectedExamStage, selectedFaculties, selectedPapers, selectedTag, selectedProductType, priceSorting, searchTerm, allCourses, shouldHideGlobalControls]);

    const filterCourses = () => {
        let filtered = [...allCourses];

        // Helper function to get all child domain IDs recursively
        const getAllChildIds = (domainId) => {
            const ids = [domainId];
            const findChildren = (id) => {
                domains.forEach(d => {
                    if (d.parentId === id) {
                        ids.push(d.id);
                        findChildren(d.id);
                    }
                });
            };
            findChildren(domainId);
            return ids;
        };

        // Filter by domain (first level - exam type)
        if (selectedDomain) {
            const domainIds = getAllChildIds(selectedDomain.id);
            filtered = filtered.filter(course =>
                course.domain && course.domain.some(d => domainIds.includes(d.id))
            );
        }

        // Filter by exam stage (second level)
        if (selectedExamStage) {
            const stageIds = getAllChildIds(selectedExamStage.id);
            filtered = filtered.filter(course =>
                course.domain && course.domain.some(d => stageIds.includes(d.id))
            );
        }

        // Filter by papers (third level and beyond - multiple selection)
        if (selectedPapers.length > 0) {
            const paperIds = [];
            selectedPapers.forEach(paper => {
                paperIds.push(...getAllChildIds(paper.id));
            });
            filtered = filtered.filter(course =>
                course.domain && course.domain.some(d => paperIds.includes(d.id))
            );
        }

        // Filter by faculties (multiple selection) — exclusive: only show courses where ALL teaching faculty are selected
        if (selectedFaculties.length > 0) {
            // Collect courseIds from selected faculties
            const selectedCourseIds = new Set();
            selectedFaculties.forEach(faculty => {
                if (faculty.courseIds && Array.isArray(faculty.courseIds)) {
                    faculty.courseIds.forEach(courseId => selectedCourseIds.add(courseId));
                }
            });

            // Collect courseIds from unselected faculties
            const unselectedCourseIds = new Set();
            faculties.forEach(faculty => {
                if (!selectedFaculties.some(f => f.id === faculty.id)) {
                    if (faculty.courseIds && Array.isArray(faculty.courseIds)) {
                        faculty.courseIds.forEach(courseId => unselectedCourseIds.add(courseId));
                    }
                }
            });

            // Only show courses that are in selected but NOT in unselected (exclusive to selected faculty)
            filtered = filtered.filter(course =>
                selectedCourseIds.has(course.id) && !unselectedCourseIds.has(course.id)
            );
        }

        // Filter by tag
        if (selectedTag) {

            filtered = filtered.filter(course => {
                // Check if course has tags property and it's an array
                if (course.tags && Array.isArray(course.tags)) {
                    return course.tags.some(t => t.id === selectedTag.id);
                }
                // If course.tags doesn't exist, try course.tag (singular)
                if (course.tag && Array.isArray(course.tag)) {
                    return course.tag.some(t => t.id === selectedTag.id);
                }
                // Also check if there's a tagIds array
                if (course.tagIds && Array.isArray(course.tagIds)) {
                    return course.tagIds.includes(selectedTag.id);
                }
                return false;
            });
        }

        // Filter by product type (single selection)
        if (selectedProductType) {
            filtered = filtered.filter(course =>
                course.type && course.type === selectedProductType
            );
        }

        // Filter by search term (course title)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                course.title && course.title.toLowerCase().includes(searchLower)
            );
        }

        // Sort by price
        const sortByPrice = (courses) => {
            if (!priceSorting) return courses;

            return [...courses].sort((a, b) => {
                const getPriceA = () => {
                    if (a.coursePricing && a.coursePricing.length > 0) {
                        return Math.min(...a.coursePricing.map(p => {
                            const price = p.discount && p.discount > 0
                                ? p.price - (p.price * (p.discount / 100))
                                : p.price;
                            return price;
                        }));
                    }
                    return 0;
                };

                const getPriceB = () => {
                    if (b.coursePricing && b.coursePricing.length > 0) {
                        return Math.min(...b.coursePricing.map(p => {
                            const price = p.discount && p.discount > 0
                                ? p.price - (p.price * (p.discount / 100))
                                : p.price;
                            return price;
                        }));
                    }
                    return 0;
                };

                const priceA = getPriceA();
                const priceB = getPriceB();

                return priceSorting === 'low-to-high' ? priceA - priceB : priceB - priceA;
            });
        };

        filtered = sortByPrice(filtered);

        setFilteredCourses(filtered);
    };

    const clearAllFilters = () => {
        // Reset to first domain and exam stage
        const firstDomain = domains.find(d => d.parentId === 0);
        if (firstDomain) {
            setSelectedDomain(firstDomain);
            // if (firstDomain.child && firstDomain.child.length > 0) {
            //   setSelectedExamStage(firstDomain.child[0]);
            // }
            setSelectedExamStage(null);
            setSelectedFaculties([])
        } else {
            setSelectedDomain(null);
            setSelectedExamStage(null);
        }

        // Reset to all faculties
        // setSelectedFaculties(faculties);
        setSelectedPapers([]);
        setSelectedTag(null);
        setSelectedProductType(null);
        setPriceSorting('');
        setSearchTerm('');
    };

    // Load cart from localStorage on mount and listen for updates
    useEffect(() => {
        const loadCart = () => {
            const cartData = localStorage.getItem('cartCourses');
            if (cartData) {
                try {
                    const cart = JSON.parse(cartData);
                    // Filter for regular courses only (items without plan property)
                    const regularCartItems = Array.isArray(cart) ? cart.filter(item => !item.plan) : [];
                    setCartCourses(regularCartItems);
                } catch (error) {
                    console.error('Error loading cart:', error);
                    setCartCourses([]);
                }
            }
        };

        // Load cart on mount
        loadCart();

        // Listen for cart updates from other components
        const handleCartUpdate = () => {
            loadCart();
        };

        window.addEventListener('storage', handleCartUpdate);
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('storage', handleCartUpdate);
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [])

    const getAllCourses = async () => {
        try {
            setLoading(true);
            const response = await Network.getFreeCourseList(instId);
            const activeCourses = (response?.courses || []).filter(c => c.active === true && c.paid === true);

            // setCourseList(activeCourses);
            setAllCourses(activeCourses);
            setFilteredCourses(activeCourses);

            // Extract unique product types from all courses
            const uniqueTypes = [...new Set(activeCourses.map(course => course.type).filter(Boolean))];
            setProductTypes(uniqueTypes);

            // Debug: Log course structure to see if tags exist
        } catch (error) {
            console.error("Error in getAllCourses:", error);
        } finally {
            setLoading(false);
        }
    };


    // const handlePurchase = (item) => {
    //     addPurchase(item);
    //     setPurchaseSuccess(item.title);
    //     setTimeout(() => {
    //         setPurchaseSuccess(null);
    //     }, 3000);
    // };

    const truncateDescription = (description) => {
        // Replace &nbsp; and other HTML entities with plain text equivalents
        const decodedDescription = description
            ?.replace(/&nbsp;/g, ' ')
            ?.replace(/&amp;/g, '&') // Example for handling other entities, can add more if needed
            ?.replace(/&lt;/g, '<')
            ?.replace(/&gt;/g, '>')
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'");

        // Strip any remaining HTML tags
        const strippedDescription = decodedDescription
            ?.replace(/<[^>]*>/g, ' ') // Remove HTML tags
            ?.split(/\s+/)
            ?.slice(0, 10) // Get first 10 words
            ?.join(' ');

        return strippedDescription;
    };
    const toggleExpandDescription = (des) => {
        setFullDes(des)
        setCourseExpandedDescriptions(true);
    };

    const getMergedSchedules = async (courseId, folderId = 0) => {
        try {
            let response = await Network.fetchFreePublicScheduleApi(courseId, folderId);
            return response
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToCartFromModal = (cartItem) => {
        // Check if already in cart
        const existingCartIndex = cartCourses.findIndex(
            item => item.coursePricingId === cartItem.coursePricingId
        );

        let updatedCart;
        if (existingCartIndex !== -1) {
            // Update existing item
            updatedCart = [...cartCourses];
            updatedCart[existingCartIndex] = cartItem;
        } else {
            // Add new item
            updatedCart = [...cartCourses, cartItem];
        }

        setCartCourses(updatedCart);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        setShowConfigModal(false);
    };

    const handleCardClick = (course) => {
        const queryString = getQueryString();

        if (course?.type === "books") {
            router.push(`/book/${course.id}${queryString}`);
        } else {
            router.push(`/course/${course.id}${queryString}`);
        }
    };

    const handleExploreClick = (course) => {
        const queryString = getQueryString();
        if (course?.type === "books") {
            router.push(`/book/${course.id}${queryString}`);
        } else {
            router.push(`/course/${course.id}${queryString}`);
        }
    };

    const handleAddtoCart = (course) => {
        const isInCart = cartCourses.some(item => item.id === course.id);

        if (isInCart) {
            // Remove from cart
            const updatedCart = cartCourses.filter(item => item.id !== course.id);
            setCartCourses(updatedCart);
            localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            // Add to cart via modal
            if (!course.coursePricing || course.coursePricing.length === 0) {
                console.error('No pricing available for this course');
                return;
            }
            setSelectedCourse(course);
            setShowConfigModal(true);
        }
    };

    const handleShowCart = () => {
        const queryString = getQueryString();
        router.push(`/cart${queryString}`);
    }

    // Get exam stages based on selected domain (only if selected domain has children)
    const getExamStages = () => {
        // If a domain is selected and it has children, return its children as exam stages
        if (selectedDomain && selectedDomain.child && selectedDomain.child.length > 0) {

            return selectedDomain.child;
        }
        // Otherwise return empty array (no exam stages to show)
        return [];
    };

    // Get all papers (all remaining children recursively from selected exam stage only)
    const getPapers = () => {
        const papers = [];
        const collectPapers = (domain) => {
            if (domain.child && domain.child.length > 0) {
                domain.child.forEach(child => {
                    papers.push(child);
                    collectPapers(child);
                });
            }
        };

        // Collect papers only from selected exam stage
        if (selectedExamStage) {
            collectPapers(selectedExamStage);
        }

        return papers;
    };

    // Toggle faculty selection
    const toggleFaculty = (faculty) => {
        setSelectedFaculties(prev => {
            const exists = prev.find(f => f.id === faculty.id);
            if (exists) {
                return prev.filter(f => f.id !== faculty.id);
            } else {
                return [...prev, faculty];
            }
        });
    };

    // Toggle paper selection
    // const togglePaper = (paper) => {
    //   setSelectedPapers(prev => {
    //     const exists = prev.find(p => p.id === paper.id);
    //     if (exists) {
    //       return prev.filter(p => p.id !== paper.id);
    //     } else {
    //       return [...prev, paper];
    //     }
    //   });
    // };

    const togglePaper = (paper) => {
        setSelectedPapers(prev => {
            const exists = prev.some(p => p.id === paper.id);

            if (exists) {
                // ❌ REMOVE (deselect)
                return prev.filter(p => p.id !== paper.id);
            }

            // ✅ ADD (select)
            return [...prev, paper];
        });
    };


    //  useEffect(() => {
    //     if (selectCourse) {
    //         const filterCourseTags = course.filter(item => {
    //             const tagslists = item.tags || [];
    //             if (tagslists.some(tag => tag.id === selectCourse?.setting?.checkoutTag)) {
    //                 return item
    //             }
    //         });

    //         setSuggestedCourse(filterCourseTags);
    //     }
    // }, [selectCourse, course])


    const FilterSidebarContent = () => (
        <div className="space-y-4">
            <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-2xl text-sm font-bold shadow-md active:scale-[0.99] transition-all"
                style={{ backgroundColor: primaryColor }}
            >
                <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Reset Filters</span>
            </button>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Type</h3>
                {domains.filter(d => d.parentId === 0).map(domain => {
                    const isActive = selectedDomain?.id === domain.id;
                    return (
                        <button key={domain.id}
                            onClick={() => { if (selectedDomain?.id !== domain.id) { setSelectedDomain(domain); setSelectedExamStage(null); } }}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all"
                            style={{ backgroundColor: isActive ? 'rgb(149 194 255 / 19%)' : '#f8fafc', color: isActive ? 'rgb(7, 73, 162)' : '#475569' }}>
                            <span>{domain.name}</span>
                            {isActive && <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </button>
                    );
                })}
            </div>
            {getExamStages().length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Stage</h3>
                    <div className="space-y-3.5 pl-0.5">
                        {getExamStages().map((stage) => (
                            <label key={stage.id} className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" name="stage" checked={selectedExamStage?.id === stage.id}
                                    onChange={() => setSelectedExamStage(selectedExamStage?.id === stage.id ? null : stage)}
                                    className="w-4 h-4 border-slate-300" style={{ accentColor: 'primaryColor' }} />
                                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{stage.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            {getPapers().length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paper</h3>
                    <div className="flex flex-wrap gap-2">
                        {getPapers().map((paper) => {
                            const isActive = selectedPapers.some(p => p.id === paper.id);
                            return (
                                <button key={paper.id} onClick={() => togglePaper(paper)}
                                    className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition-all ${isActive ? 'text-white border-transparent' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                    style={{ backgroundColor: isActive ? primaryColor : undefined }}>
                                    {paper.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {faculties.length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty</h3>
                        <button onClick={() => setSelectedFaculties([])} className="text-xs font-bold transition-all" style={{ color: primaryColor }}>Clear All</button>
                    </div>
                    <div className="space-y-4 pl-0.5">
                        <label className="flex items-center gap-3 cursor-pointer group border-b border-slate-100 pb-2">
                            <input type="checkbox" checked={selectedFaculties.length === faculties.length && faculties.length > 0}
                                onChange={() => { if (selectedFaculties.length === faculties.length) setSelectedFaculties([]); else setSelectedFaculties([...faculties]); }}
                                className="w-4 h-4 rounded border-slate-300" style={{ accentColor: 'rgb(149 194 255 / 19%)' }} />
                            <span className="text-xs font-bold text-slate-700">{selectedFaculties.length === faculties.length ? 'Deselect All' : 'Select All'}</span>
                        </label>
                        {faculties.map((fac) => {
                            const isSelected = selectedFaculties.some(f => f.id === fac.id);
                            const fullName = [fac?.firstName, fac?.lastName].filter(Boolean).join(' ');
                            const initial = (fac?.firstName?.[0] || '') + (fac?.lastName?.[0] || '');
                            return (
                                <label key={fac.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={isSelected} onChange={() => toggleFaculty(fac)}
                                        className="w-4 h-4 rounded border-slate-300" style={{ accentColor: 'rgb(149 194 255 / 19%)' }} />
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {fac.profile ? <img src={`${Endpoints.mediaBaseUrl}${fac.profile}`} alt={fullName} className="w-full h-full object-cover" />
                                            : <span className="text-[9px] font-bold text-slate-500">{initial || '?'}</span>}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate">{fullName}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafbfc] text-slate-800 antialiased font-sans">

            {/* GLOBAL HEADER */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-6">

                    <div onClick={() => router.push('/')} className="flex items-center gap-3 shrink-0 select-none group cursor-pointer">
                        <div className="bg-gradient-to-br from-[#0a459a] to-[#05214c] text-white font-bold text-xl px-3 py-2 rounded-xl tracking-tight shadow-[0_4px_12px_rgba(10,69,154,0.3)] transition-transform duration-300 group-hover:scale-105">
                            RJCE
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="font-bold text-slate-900 tracking-tight text-xs sm:text-base leading-none group-hover:text-[#0a459a] transition-colors duration-200">RISHABH JAIN</h1>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Commerce Education</span>
                        </div>
                    </div>

                    <div className="flex-1 max-w-4xl flex items-center justify-end gap-3 md:gap-6">

                        {/* Search Box */}
                        <div className="relative w-full max-w-[160px] sm:max-w-xs">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input type="text" placeholder="Search courses..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0749A2]/10 focus:border-[#0749A2] transition-all" />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {!shouldHideGlobalControls && (
                            <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5">
                                <ThemeDropdown label="PRODUCT TYPE" options={['All', ...productTypes]}
                                    selectedValue={selectedProductType || 'All'}
                                    onChange={(val) => setSelectedProductType(val === 'All' ? null : val)} />
                                <div className="h-4 w-[1px] bg-slate-200" />
                                <ThemeDropdown label="BATCH TYPE" options={['All', ...tags.map(t => t.tag)]}
                                    selectedValue={selectedTag?.tag || 'All'}
                                    onChange={(val) => setSelectedTag(val === 'All' ? null : tags.find(t => t.tag === val))} />
                                <div className="h-4 w-[1px] bg-slate-200" />
                                <ThemeDropdown label="PRICE" options={['All', 'Low to High', 'High to Low']}
                                    selectedValue={priceSorting ? (priceSorting === 'low-to-high' ? 'Low to High' : 'High to Low') : 'All'}
                                    onChange={(val) => setPriceSorting(val === 'All' ? '' : val === 'Low to High' ? 'low-to-high' : 'high-to-low')} />
                            </div>
                        )}

                        <div className="relative p-2 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-all flex-shrink-0" onClick={handleShowCart}>
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCourses.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}>
                                    {cartCourses.length}
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </header>

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 md:gap-8">

                <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-22 h-fit space-y-4">
                    <FilterSidebarContent />
                </aside>

                <main className="flex-1 space-y-4 sm:space-y-6">

                    <div className="lg:hidden flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
                        <div className="text-xs text-slate-500 font-bold tracking-tight">Filters & Sorting Options</div>
                        <button onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition-all">
                            <span>Filters</span>
                        </button>
                    </div>

                    <section className="space-y-4 overflow-y-auto max-h-[calc(112vh-140px)] scrollbar-thin pr-1 !mt-0">
                        {/* <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                                {selectedTag ? `Batch: ${selectedTag.tag}` : 'All Courses'}
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">{filteredCourses.length} courses</span>
                        </div> */}

                        {/* Course Listing */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse">
                                        <div className="w-full aspect-square bg-slate-200 rounded-xl" />
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                        <div className="h-6 bg-slate-200 rounded w-1/2 mt-4" />
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="h-8 bg-slate-200 rounded-lg" />
                                            <div className="h-8 bg-slate-200 rounded-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredCourses?.length > 0 ? (
                            selectedTag ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                                    {filteredCourses.map((item) => {
                                        const getPriceInfo = () => {
                                            if (item?.coursePricing && item.coursePricing.length > 0) {
                                                let minOriginalPrice = Infinity;
                                                let minFinalPrice = Infinity;
                                                let maxDiscount = 0;
                                                item.coursePricing.forEach(pricing => {
                                                    const originalPrice = pricing.price;
                                                    const discount = pricing.discount || 0;
                                                    const finalPrice = discount > 0 ? originalPrice - (originalPrice * (discount / 100)) : originalPrice;
                                                    if (finalPrice < minFinalPrice) { minFinalPrice = finalPrice; minOriginalPrice = originalPrice; maxDiscount = discount; }
                                                });
                                                return { originalPrice: minOriginalPrice, finalPrice: minFinalPrice, discount: maxDiscount };
                                            }
                                            return { originalPrice: 0, finalPrice: 0, discount: 0 };
                                        };
                                        const priceInfo = getPriceInfo();
                                        return (
                                            <div
                                                key={item.id}
                                                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                                            >
                                                <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
                                                    <img
                                                        src={Endpoints?.mediaBaseUrl + item.logo}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                                    />
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                                    <div>
                                                        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 leading-snug line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                        <div>
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                                                                    ₹{(priceInfo.finalPrice || 0).toLocaleString('en-IN')}
                                                                </span>
                                                                {priceInfo.discount > 0 && (
                                                                    <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                                                                        ₹{(priceInfo.originalPrice || 0).toLocaleString('en-IN')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {priceInfo.discount > 0 && (
                                                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                                {priceInfo.discount}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                                                        <button onClick={(e) => { e.stopPropagation(); handleExploreClick(item); }}
                                                            className="flex items-center justify-center px-2 py-2 sm:py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 active:scale-[0.98] transition-all">
                                                            Explore
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAddtoCart(item); }}
                                                            className={`flex items-center justify-center px-2 py-2 sm:py-2.5 rounded-xl text-xs font-semibold shadow-sm active:scale-[0.97] transition-all ${cartCourses.some(a => a.id === item?.id) ? 'bg-white border border-red-500 text-red-600' : 'text-white'}`}
                                                            style={cartCourses.some(a => a.id === item?.id) ? {} : { backgroundColor: primaryColor }}>
                                                            {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to Cart"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <>
                                    {tags.map((tag) => {
                                        const tagCourses = filteredCourses.filter(course => {
                                            if (course.tags && Array.isArray(course.tags)) return course.tags.some(t => t.id === tag.id);
                                            if (course.tag && Array.isArray(course.tag)) return course.tag.some(t => t.id === tag.id);
                                            if (course.tagIds && Array.isArray(course.tagIds)) return course.tagIds.includes(tag.id);
                                            return false;
                                        });
                                        if (tagCourses.length === 0) return null;
                                        return (
                                            <div key={tag.id} className="mb-6">
                                                <div className="flex justify-start items-center gap-2 mb-3">
                                                    <div className="w-fit h-8 rounded-lg flex items-center justify-start p-2 text-black text-sm font-bold">
                                                        {tag.tag}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                                                    {tagCourses.map((item) => {
                                                        const getPriceInfo = () => {
                                                            if (item?.coursePricing && item.coursePricing.length > 0) {
                                                                let minOriginalPrice = Infinity;
                                                                let minFinalPrice = Infinity;
                                                                let maxDiscount = 0;
                                                                item.coursePricing.forEach(pricing => {
                                                                    const originalPrice = pricing.price;
                                                                    const discount = pricing.discount || 0;
                                                                    const finalPrice = discount > 0 ? originalPrice - (originalPrice * (discount / 100)) : originalPrice;
                                                                    if (finalPrice < minFinalPrice) { minFinalPrice = finalPrice; minOriginalPrice = originalPrice; maxDiscount = discount; }
                                                                });
                                                                return { originalPrice: minOriginalPrice, finalPrice: minFinalPrice, discount: maxDiscount };
                                                            }
                                                            return { originalPrice: 0, finalPrice: 0, discount: 0 };
                                                        };
                                                        const priceInfo = getPriceInfo();
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                                                            >
                                                                <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
                                                                    <img src={Endpoints?.mediaBaseUrl + item.logo} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
                                                                </div>
                                                                <div className="p-2 flex-1 flex flex-col justify-between space-y-4">
                                                                    <div>
                                                                        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 leading-snug line-clamp-2">{item.title}</h3>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                                        <div>
                                                                            <div className="flex items-baseline gap-1.5">
                                                                                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                                                                                    ₹{(priceInfo.finalPrice || 0).toLocaleString('en-IN')}
                                                                                </span>
                                                                                {priceInfo.discount > 0 && (
                                                                                    <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                                                                                        ₹{(priceInfo.originalPrice || 0).toLocaleString('en-IN')}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {priceInfo.discount > 0 && (
                                                                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                                                {priceInfo.discount}% OFF
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                                                                        <button onClick={(e) => { e.stopPropagation(); handleExploreClick(item); }}
                                                                            className="flex items-center justify-center px-2 py-2 sm:py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 active:scale-[0.98] transition-all">
                                                                            Explore
                                                                        </button>
                                                                        <button onClick={(e) => { e.stopPropagation(); handleAddtoCart(item); }}
                                                                            className={`flex items-center justify-center px-2 py-2 sm:py-2.5 rounded-xl text-xs font-semibold shadow-sm active:scale-[0.97] transition-all ${cartCourses.some(a => a.id === item?.id) ? 'bg-white border border-red-500 text-red-600' : 'text-white'}`}
                                                                            style={cartCourses.some(a => a.id === item?.id) ? {} : { backgroundColor: primaryColor }}>
                                                                            {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to Cart"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-white rounded-3xl shadow-xl p-4 max-w-md mx-auto border border-gray-100">
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner bg-gradient-to-br from-emerald-100 to-green-100">
                                        <ShoppingCart className="h-16 w-16 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">No Courses Found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your filters to see more courses!</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-lg"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Mobile Filters Dialog */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setMobileFiltersOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed bottom-14 left-0 right-0 rounded-t-3xl bg-white shadow-2xl max-h-[55vh] overflow-y-auto z-50">
                        <div className="flex flex-col h-full bg-white">
                            {/* Header */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-emerald-600/20 sticky top-0">
                                <h2 className="text-base font-bold tracking-tight text-slate-900">Refine Filters</h2>
                                {(selectedDomain || selectedExamStage || selectedFaculties.length > 0) && (
                                    <button
                                        onClick={() => {
                                            setSelectedDomain(null);
                                            setSelectedExamStage(null);
                                            setSelectedFaculties([]);
                                        }}
                                        className="font-black text-xs text-indigo-700 hover:text-indigo-800 transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Main Content - Tabs and Content Side by Side */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Tabs - Left Side - Filter Categories */}
                                <div className="w-32 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
                                    <button
                                        onClick={() => setMobileFilterTab('exam-type')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all duration-200"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'exam-type' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'exam-type' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'exam-type' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'exam-type' ? '600' : '500'
                                        }}
                                    >
                                        Exam Type
                                    </button>
                                    <button
                                        onClick={() => setMobileFilterTab('exam-stage')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all duration-200"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'exam-stage' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'exam-stage' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'exam-stage' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'exam-stage' ? '600' : '500'
                                        }}
                                    >
                                        Exam Stage
                                    </button>
                                    <button
                                        onClick={() => setMobileFilterTab('paper')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'paper' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'paper' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'paper' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'paper' ? '600' : '500'
                                        }}
                                    >
                                        Paper
                                    </button>

                                    {
                                        faculties.length > 0 && (
                                            <button
                                                onClick={() => setMobileFilterTab('faculty')}
                                                className="text-left px-4 py-2 border-l-4 text-xs transition-all duration-200"
                                                style={{
                                                    backgroundColor: mobileFilterTab === 'faculty' ? 'white' : 'transparent',
                                                    borderLeftColor: mobileFilterTab === 'faculty' ? primaryColor : 'transparent',
                                                    color: mobileFilterTab === 'faculty' ? primaryColor : '#4b5563',
                                                    fontWeight: mobileFilterTab === 'faculty' ? '600' : '500'
                                                }}
                                            >
                                                Faculty
                                            </button>
                                        )
                                    }

                                    <button
                                        onClick={() => setMobileFilterTab('product')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'product' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'product' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'product' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'product' ? '600' : '500'
                                        }}
                                    >
                                        Product
                                    </button>
                                    <button
                                        onClick={() => setMobileFilterTab('batch')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'batch' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'batch' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'batch' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'batch' ? '600' : '500'
                                        }}
                                    >
                                        Batch
                                    </button>


                                    <button
                                        onClick={() => setMobileFilterTab('price')}
                                        className="text-left px-4 py-2 border-l-4 text-xs transition-all"
                                        style={{
                                            backgroundColor: mobileFilterTab === 'price' ? 'white' : 'transparent',
                                            borderLeftColor: mobileFilterTab === 'price' ? primaryColor : 'transparent',
                                            color: mobileFilterTab === 'price' ? primaryColor : '#4b5563',
                                            fontWeight: mobileFilterTab === 'price' ? '600' : '500'
                                        }}
                                    >
                                        Price
                                    </button>
                                </div>

                                {/* Tab Content - Right Side */}
                                <div className="flex-1 overflow-y-auto p-4 bg-white">
                                    {/* Exam Type Tab */}
                                    {mobileFilterTab === 'exam-type' && (
                                        <div className="space-y-1">
                                            {domains.filter(d => d.parentId === 0).length > 0 ? (
                                                domains.filter(d => d.parentId === 0).map(domain => (
                                                    <div
                                                        key={domain.id}
                                                        onClick={() => {
                                                            if (selectedDomain?.id !== domain.id) {
                                                                setSelectedDomain(domain);
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${selectedDomain?.id === domain.id
                                                            ? 'bg-emerald-50'
                                                            : ''
                                                            }`}
                                                    >
                                                        <span className="font-medium line-clamp-1 text-gray-700"
                                                        // style={{ color: selectedDomain?.id === domain.id ? primaryColor : (isDarkMode ? '#fff' : '#111827') }}
                                                        >{domain.name}</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${selectedDomain?.id === domain.id
                                                            ? 'border-emerald-600 bg-emerald-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {selectedDomain?.id === domain.id && (
                                                                <div className="w-full h-full rounded-full flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center py-6 text-sm">No exam types</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Exam Stage Tab */}
                                    {mobileFilterTab === 'exam-stage' && (
                                        <div className="space-y-1">
                                            {getExamStages().length > 0 ? (
                                                getExamStages().map(stage => (
                                                    <div
                                                        key={stage.id}
                                                        onClick={() => {
                                                            setSelectedExamStage(selectedExamStage?.id === stage.id ? null : stage);
                                                        }}
                                                        className={`w-full text-left px-4 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${selectedExamStage?.id === stage.id
                                                            ? 'bg-emerald-50'
                                                            : ''
                                                            }`}
                                                    >
                                                        <span className="font-medium line-clamp-1 text-gray-700"
                                                        // style={{ color: selectedExamStage?.id === stage.id ? primaryColor : (isDarkMode ? '#fff' : '#111827') }}
                                                        >{stage.name}</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${selectedExamStage?.id === stage.id
                                                            ? 'border-emerald-600 bg-emerald-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {selectedExamStage?.id === stage.id && (
                                                                <div className="w-full h-full rounded-full flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center py-6 text-sm">No exam stages</p>
                                            )}
                                        </div>
                                    )}

                                    {mobileFilterTab === 'paper' && (
                                        <div className="space-y-1">
                                            {getPapers().map(paper => {
                                                const isSelected = selectedPapers.some(p => p.id === paper.id);

                                                return (
                                                    <div
                                                        key={paper.id}
                                                        onClick={() => togglePaper(paper)}
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-xs cursor-pointer
            flex items-center justify-between hover:bg-gray-50
            ${isSelected
                                                                ? 'bg-emerald-50'
                                                                : ''
                                                            }
          `}
                                                    >
                                                        <span className="font-medium line-clamp-1 text-gray-700">
                                                            {paper.name}
                                                        </span>

                                                        {/* Custom checkbox UI */}
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
   ${isSelected
                                                                    ? 'border-emerald-600 bg-emerald-600'
                                                                    : 'border-gray-300'
                                                                }
  `}
                                                        >
                                                            {isSelected && (
                                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                            )}
                                                        </div>

                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {mobileFilterTab === 'faculty' && (
                                        <div className="space-y-1">
                                            {faculties.length > 0 ? (
                                                <>
                                                    {/* Select All / Deselect All */}
                                                    <div
                                                        onClick={() => {
                                                            if (selectedFaculties.length === faculties.length) {
                                                                setSelectedFaculties([]);
                                                            } else {
                                                                setSelectedFaculties([...faculties]);
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 border-b border-gray-200 mb-2 ${selectedFaculties.length > 0
                                                            ? 'bg-emerald-50'
                                                            : ''
                                                            }`}
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {selectedFaculties.length === faculties.length ? 'Deselect All' : 'Select All'}
                                                        </span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selectedFaculties.length > 0
                                                            ? 'border-emerald-600 bg-emerald-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {selectedFaculties.length === faculties.length ? (
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : selectedFaculties.length > 0 ? (
                                                                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/* Faculty List */}
                                                    {faculties.map(faculty => {
                                                        const isSelected = selectedFaculties.some(f => f.id === faculty.id);
                                                        return (
                                                            <div
                                                                key={faculty.id}
                                                                onClick={() => toggleFaculty(faculty)}
                                                                className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${isSelected
                                                                    ? 'bg-emerald-50'
                                                                    : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                                    {faculty.profile && (
                                                                        <img
                                                                            src={`${Endpoints.mediaBaseUrl}${faculty.profile}`}
                                                                            alt={`${faculty.firstName} ${faculty.lastName}`}
                                                                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                                                        />
                                                                    )}
                                                                    <span className="font-medium text-gray-700 line-clamp-1">{faculty.firstName} {faculty.lastName}</span>
                                                                </div>
                                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected
                                                                    ? 'border-emerald-600 bg-emerald-600'
                                                                    : 'border-gray-300'
                                                                    }`}>
                                                                    {isSelected && (
                                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <p className="text-gray-500 text-center py-6 text-sm">No faculties</p>
                                            )}
                                        </div>
                                    )}

                                    {mobileFilterTab === 'product' && (
                                        <div className="space-y-1">
                                            {/* ALL PRODUCT TYPES */}
                                            <div
                                                onClick={() => setSelectedProductType(null)}
                                                className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${!selectedProductType
                                                    ? 'bg-emerald-50'
                                                    : ''
                                                    }`}
                                            >
                                                <span className="font-medium text-gray-700 line-clamp-1">All Types</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${!selectedProductType
                                                    ? 'border-emerald-600 bg-emerald-600'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {!selectedProductType && (
                                                        <div className="w-full h-full rounded-full flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {productTypes.map(type => (
                                                <div
                                                    key={type}
                                                    onClick={() => setSelectedProductType(type)}
                                                    className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${selectedProductType === type
                                                        ? 'bg-emerald-50'
                                                        : ''
                                                        }`}
                                                >
                                                    <span className="font-medium text-gray-700 line-clamp-1">{type}</span>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${selectedProductType === type
                                                        ? 'border-emerald-600 bg-emerald-600'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {selectedProductType === type && (
                                                            <div className="w-full h-full rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {mobileFilterTab === 'batch' && (
                                        <div className="space-y-1">
                                            {/* ALL BATCHES */}
                                            <div
                                                onClick={() => setSelectedTag(null)}
                                                className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${!selectedTag
                                                    ? 'bg-emerald-50'
                                                    : ''
                                                    }`}
                                            >
                                                <span className="font-medium text-gray-700 line-clamp-1">All Batches</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${!selectedTag
                                                    ? 'border-emerald-600 bg-emerald-600'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {!selectedTag && (
                                                        <div className="w-full h-full rounded-full flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {tags.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    onClick={() => setSelectedTag(tag)}
                                                    className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${selectedTag?.id === tag.id
                                                        ? 'bg-emerald-50'
                                                        : ''
                                                        }`}
                                                >
                                                    <span className="font-medium text-gray-700 line-clamp-1">{tag.tag}</span>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${selectedTag?.id === tag.id
                                                        ? 'border-emerald-600 bg-emerald-600'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {selectedTag?.id === tag.id && (
                                                            <div className="w-full h-full rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    {mobileFilterTab === 'price' && (
                                        <div className="space-y-1">
                                            {[
                                                { label: 'All', value: '' },
                                                { label: 'Low to High', value: 'low-to-high' },
                                                { label: 'High to Low', value: 'high-to-low' },
                                            ].map(p => (
                                                <div
                                                    key={p.value}
                                                    onClick={() => setPriceSorting(p.value)}
                                                    className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${priceSorting === p.value
                                                        ? 'bg-emerald-50'
                                                        : ''
                                                        }`}
                                                >
                                                    <span className="font-medium text-gray-700 line-clamp-1">{p.label}</span>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${priceSorting === p.value
                                                        ? 'border-emerald-600 bg-emerald-600'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {priceSorting === p.value && (
                                                            <div className="w-full h-full rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Footer - Buttons */}
                            <div className="bg-white border-t border-gray-200 p-4 shadow-lg flex gap-3 sticky bottom-0">
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-lg"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showConfigModal && (
                <CourseConfigModal
                    course={selectedCourse}
                    onClose={() => setShowConfigModal(false)}
                    onAddToCart={handleAddToCartFromModal}
                />
            )}

            {/* Description Expanded Dialog */}
            {courseExpandedDescriptions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setCourseExpandedDescriptions(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="text-base leading-relaxed text-gray-700">
                                {parse(fullDes)}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setCourseExpandedDescriptions(false)}
                                className="px-6 py-2 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Footer - Hidden when using routeData */}
            {!shouldHideGlobalControls && <Footer />}
        </div>
    );
};

export default Store;
