import React, { useEffect, useState } from 'react';
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

const Store = () => {

    const { theme } = useTheme();

    const FILTER_SELECTION_TYPE = {
        paper: 'multiple',   // checkbox
        product: 'single',   // radio
        batch: 'single',     // radio
        price: 'single',     // radio
    };

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
    const [finalAmounts, setFinalAmounts] = useState(0);
    const [finalAmountsss, setFinalAmountsss] = useState(0);
    const [selectedSceduleList, setSelectedSceduleList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [showAllCourses, setShowAllCourses] = useState(false);

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
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);
    const [navigationStateChanged, setNavigationStateChanged] = useState(0); // Trigger navigation handler when header navigation happens
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
            sessionStorage.removeItem('storeNavigationState');
        }
    }, [shouldHideGlobalControls]);

    // Detect query params on mount and when router is ready
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const isMobileParam = params.get('isMobile');
            const tokenParam = params.get('token');

            if (isMobileParam) setRouteData(isMobileParam);
            if (tokenParam) setTokenFromUrl(tokenParam);
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
                let newList = data.tags.filter(tag => tag.availablePublic === true);
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

        // Filter by faculties (multiple selection)
        if (selectedFaculties.length > 0) {
            // Collect all courseIds from selected faculties
            const allowedCourseIds = new Set();
            selectedFaculties.forEach(faculty => {
                if (faculty.courseIds && Array.isArray(faculty.courseIds)) {
                    faculty.courseIds.forEach(courseId => allowedCourseIds.add(courseId));
                }
            });

            // Filter courses that are in the faculty's courseIds array
            filtered = filtered.filter(course =>
                allowedCourseIds.has(course.id)
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

            setCourseList(activeCourses);
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


    const handlePurchase = (item) => {
        addPurchase(item);
        setPurchaseSuccess(item.title);
        setTimeout(() => {
            setPurchaseSuccess(null);
        }, 3000);
    };

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


    return (
        <div className="bg-gradient-to-br from-gray-50 via-indigo-50/30 to-indigo-50/30 lg:pt-4">
            {/* Main Store Content */}
            {/* Header Section - Fixed on mobile only - Hidden when using routeData */}

            <div className="lg:relative lg:z-auto fixed top-15 left-0 right-0 z-30 lg:bg-white lg:border-0 border-b lg:shadow-md shadow-sm bg-white border-indigo-100 lg:rounded-xl lg:mx-4">
                <div className="max-w-[1800px] mx-auto px-2 pt-2.5 md:px-3 md:py-2">
                    {/* Header Section - Course Store Title + Sort, Search, Cart */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-1">
                        {/* Left: Title */}
                        {!shouldHideGlobalControls && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: primaryColor }}>
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <h1 className="text-sm md:text-base font-bold" style={{ color: primaryColor }}>
                                        Course Store
                                    </h1>
                                    <p className="text-[9px] text-gray-600 hidden md:block">Explore our premium courses</p>
                                </div>
                            </div>
                        )}

                        {/* Right: Sort, Search, Cart in a row */}
                        <div className="flex flex-wrap items-start gap-1.5 w-full lg:w-auto">
                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg shadow-sm border transition-all mb-2"
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: primaryColor,
                                    color: primaryColor
                                }}
                            >
                                <Filter className="h-3.5 w-3.5" />
                                <span className="text-xs">Filters</span>
                                {(selectedPapers.length > 0 || selectedTag || selectedProductType || priceSorting) && (
                                    <span className="text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                                        {selectedPapers.length + (selectedTag ? 1 : 0) + (selectedProductType ? 1 : 0) + (priceSorting ? 1 : 0)}
                                    </span>
                                )}
                            </button>

                            {/* View Cart Button - Desktop and Mobile */}
                            {cartCourses?.length > 0 && (
                                <button
                                    onClick={handleShowCart}
                                    className="flex text-white font-bold text-xs py-2 px-4 rounded-lg hover:shadow-lg transition-all shadow-lg items-center justify-center gap-2"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    View Cart ({cartCourses.length})
                                </button>
                            )}

                            {/* Search Bar */}
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-1.5 border border-gray-200 min-w-[200px] flex-1 lg:flex-initial">
                                <div className="flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 text-xs text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Top Filters - Only Show When routeData Exists (Mobile Only) */}

                    <div
                        className="lg:hidden px-3 py-1.5 overflow-x-auto whitespace-nowrap"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            backgroundColor: `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)`,
                            borderColor: primaryColor
                        }}
                    >
                        <div className="flex items-center gap-2 flex-nowrap w-max">
                            {/* Exam Type Filter Pill */}
                            <button
                                onClick={() => {
                                    setMobileFilterTab('exam-type');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: selectedDomain ? primaryColor : '#d1d5db',
                                    backgroundColor: selectedDomain ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: selectedDomain ? primaryColor : '#374151'
                                }}
                            >
                                {selectedDomain && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        1
                                    </span>
                                )}
                                Exam Type
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>

                            {/* Exam Stage Filter Pill */}
                            <button
                                onClick={() => {
                                    setMobileFilterTab('exam-stage');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: selectedExamStage ? primaryColor : '#d1d5db',
                                    backgroundColor: selectedExamStage ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: selectedExamStage ? primaryColor : '#374151'
                                }}
                            >
                                {selectedExamStage && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        1
                                    </span>
                                )}
                                Exam Stage
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>

                            {/* Faculty Filter Pill */}
                            <button
                                onClick={() => {
                                    setMobileFilterTab('faculty');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: selectedFaculties.length > 0 ? primaryColor : '#d1d5db',
                                    backgroundColor: selectedFaculties.length > 0 ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: selectedFaculties.length > 0 ? primaryColor : '#374151'
                                }}
                            >
                                {selectedFaculties.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        {selectedFaculties.length}
                                    </span>
                                )}
                                Faculty
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setMobileFilterTab('paper');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: paperCount > 0 ? primaryColor : '#d1d5db',
                                    backgroundColor: paperCount > 0 ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: paperCount > 0 ? primaryColor : '#374151'
                                }}
                            >
                                {paperCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        {paperCount}
                                    </span>
                                )}
                                Paper
                                <ChevronDownIcon />
                            </button>


                            <button
                                onClick={() => {
                                    setMobileFilterTab('product');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: productCount ? primaryColor : '#d1d5db',
                                    backgroundColor: productCount ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: productCount ? primaryColor : '#374151'
                                }}
                            >
                                {productCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        1
                                    </span>
                                )}
                                Product
                                <ChevronDownIcon />
                            </button>
                            <button
                                onClick={() => {
                                    setMobileFilterTab('batch'); // same tab as product
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: batchCount ? primaryColor : '#d1d5db',
                                    backgroundColor: batchCount ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: batchCount ? primaryColor : '#374151'
                                }}
                            >
                                {batchCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        1
                                    </span>
                                )}
                                Batch
                                <ChevronDownIcon />
                            </button>
                            <button
                                onClick={() => {
                                    setMobileFilterTab('price');
                                    setMobileFiltersOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    borderColor: priceCount ? primaryColor : '#d1d5db',
                                    backgroundColor: priceCount ? `rgb(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.05)` : '#f9fafb',
                                    color: priceCount ? primaryColor : '#374151'
                                }}
                            >
                                {priceCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white font-bold text-[7px]" style={{ backgroundColor: primaryColor }}>
                                        1
                                    </span>
                                )}
                                Price
                                <ChevronDownIcon />
                            </button>

                            {/* Reset Button - Shows when filters are selected */}
                            {(selectedDomain || selectedExamStage || selectedFaculties.length > 0 || selectedPapers.length > 0 || selectedTag || selectedProductType || priceSorting) && (
                                <button
                                    onClick={() => {
                                        setSelectedDomain(null);
                                        setSelectedExamStage(null);
                                        setSelectedFaculties([]);
                                        setSelectedPapers([]);
                                        setSelectedTag(null);
                                        setSelectedProductType(null);
                                        setPriceSorting('');
                                    }}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all whitespace-nowrap flex-shrink-0 ml-1 ${routeData
                                        ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                                        }`}
                                >
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reset
                                </button>
                            )}

                        </div>
                    </div>


                    {/* View Cart Button */}
                    {/* {routeData && cartCourses?.length > 0 && (
                        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white px-3 py-2 border-t border-gray-200 shadow-lg z-30">
                            <button
                                onClick={handleShowCart}
                                className="w-full text-white font-bold text-xs py-2 px-4 rounded-lg hover:shadow-lg transition-all shadow-lg flex items-center justify-center gap-2"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                View Cart ({cartCourses.length})
                            </button>
                        </div>
                    )} */}
                </div>
            </div>


            {/* Main Content - padding top only on mobile */}
            <div className="lg:pt-4 lg:border-gray-200" style={{ paddingTop: !isMobile ? "10rem" : "1rem" }}>
                <div className="max-w-[1800px] mx-auto px-4 md:px-4">
                    {/* Main Layout - Sidebar + Content */}
                    <div className="flex flex-col lg:flex-row gap-3">

                        {/* Left Sidebar - Filters (Desktop Only) */}
                        <div className="hidden lg:block w-full lg:w-72 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-indigo-100 sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto" style={{ borderLeft: `5px solid ${primaryColor}` }}>
                                {(selectedPapers.length > 0 || selectedTag || selectedProductType || priceSorting || searchTerm) && (
                                    <div className="mb-4 pb-4 border-b-2" style={{ borderColor: `${primaryColor}40` }}>
                                        <button
                                            onClick={clearAllFilters}
                                            className="w-full text-white border-2 px-3 py-2.5 rounded-lg text-xs font-bold hover:shadow-md transition-all flex items-center justify-center gap-2"
                                            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                                        >
                                            <X className="h-4 w-4" />
                                            Reset Filters
                                        </button>
                                    </div>
                                )}

                                {/* Exam Type Filter - Radio */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2 pb-2" style={{ borderBottom: `2px solid ${primaryColor}` }}>
                                        <Filter className="h-4 w-4" style={{ color: primaryColor }} />
                                        Exam Type
                                    </h3>
                                    <div className="space-y-2">
                                        {domains.filter(d => d.parentId === 0).map(domain => (
                                            <div
                                                key={domain.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (selectedDomain?.id !== domain.id) {
                                                        setSelectedDomain(domain);
                                                        // Reset exam stage when changing domain
                                                        setSelectedExamStage(null);
                                                    }
                                                }}
                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-3 hover:shadow-sm group"
                                                style={{
                                                    backgroundColor: selectedDomain?.id === domain.id ? `${primaryColor}15` : 'transparent',
                                                    border: `2px solid ${selectedDomain?.id === domain.id ? primaryColor : 'transparent'}`,
                                                    color: selectedDomain?.id === domain.id ? primaryColor : '#666'
                                                }}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0`} style={{
                                                    borderColor: selectedDomain?.id === domain.id ? primaryColor : '#d1d5db',
                                                    backgroundColor: selectedDomain?.id === domain.id ? primaryColor : 'transparent'
                                                }}>
                                                    {selectedDomain?.id === domain.id && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span>{domain.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Exam Stage Filter - Radio */}
                                {getExamStages().length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2 pb-2" style={{ borderBottom: `2px solid ${primaryColor}` }}>Exam Stage</h3>
                                        <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                                            {getExamStages().map(stage => (
                                                <div
                                                    key={stage.id}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setSelectedExamStage(selectedExamStage?.id === stage.id ? null : stage);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-3 hover:shadow-sm group"
                                                    style={{
                                                        backgroundColor: selectedExamStage?.id === stage.id ? `${primaryColor}15` : 'transparent',
                                                        border: `2px solid ${selectedExamStage?.id === stage.id ? primaryColor : 'transparent'}`,
                                                        color: selectedExamStage?.id === stage.id ? primaryColor : '#666'
                                                    }}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0`} style={{
                                                        borderColor: selectedExamStage?.id === stage.id ? primaryColor : '#d1d5db',
                                                        backgroundColor: selectedExamStage?.id === stage.id ? primaryColor : 'transparent'
                                                    }}>
                                                        {selectedExamStage?.id === stage.id && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span>{stage.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Faculty Filter - Checkbox */}
                                {faculties.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2 pb-2" style={{ borderBottom: `2px solid ${primaryColor}` }}>Faculty</h3>
                                        <div className="space-y-2 overflow-y-auto pr-2">
                                            {/* Select All / Deselect All */}
                                            <div
                                                onClick={() => {
                                                    if (selectedFaculties.length === faculties.length) {
                                                        setSelectedFaculties([]);
                                                    } else {
                                                        setSelectedFaculties([...faculties]);
                                                    }
                                                }}
                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-3 hover:shadow-sm group mb-2 pb-3"
                                                style={{
                                                    backgroundColor: selectedFaculties.length > 0 ? `${primaryColor}15` : 'transparent',
                                                    borderBottom: `1px solid ${selectedFaculties.length > 0 ? primaryColor : '#e5e7eb'}`
                                                }}
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0`} style={{
                                                    borderColor: selectedFaculties.length > 0 ? primaryColor : '#d1d5db',
                                                    backgroundColor: selectedFaculties.length > 0 ? primaryColor : 'transparent'
                                                }}>
                                                    {selectedFaculties.length === faculties.length ? (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : selectedFaculties.length > 0 ? (
                                                        <div className="w-2.5 h-1 bg-white rounded"></div>
                                                    ) : null}
                                                </div>
                                                <span style={{ color: selectedFaculties.length > 0 ? primaryColor : '#333' }}>
                                                    {selectedFaculties.length === faculties.length ? 'Deselect All' : 'Select All'}
                                                </span>
                                            </div>

                                            {faculties.map(faculty => {
                                                const isSelected = selectedFaculties.some(f => f.id === faculty.id);
                                                return (
                                                    <div
                                                        key={faculty.id}
                                                        onClick={() => toggleFaculty(faculty)}
                                                        className="w-full text-left px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center gap-2 hover:bg-gray-50 group"
                                                    >
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                            ? 'border-indigo-600 bg-indigo-600 shadow-sm'
                                                            : 'border-gray-300 group-hover:border-indigo-400'
                                                            }`}>
                                                            {isSelected && (
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {faculty.profile && (
                                                            <img
                                                                src={`${Endpoints.mediaBaseUrl}${faculty.profile}`}
                                                                alt={`${faculty.firstName} ${faculty.lastName}`}
                                                                className="w-5 h-5 rounded-full object-cover"
                                                            />
                                                        )}
                                                        <span className={`truncate flex-1 font-medium transition-colors ${isSelected
                                                            ? 'text-gray-900'
                                                            : 'text-gray-600 group-hover:text-gray-900'
                                                            }`}>{faculty.firstName} {faculty.lastName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="flex-1 min-w-0">

                            {/* Filters Section - Paper-wise, Product Type, Batch Tag - Desktop Only */}
                            <div className="w-full hidden lg:block bg-white rounded-xl shadow-sm p-2.5 border border-gray-100 mb-2.5 ">
                                {/* Paper-wise Filter */}
                                {getPapers().length > 0 && (
                                    <div className="mb-1.5">
                                        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Paper-wise</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(() => {
                                                const papers = getPapers();

                                                // Sort papers in specific sequence: Both Group, Group 1, Group 2, then others
                                                const sortedPapers = [...papers].sort((a, b) => {
                                                    const nameA = a.name.toLowerCase().trim();
                                                    const nameB = b.name.toLowerCase().trim();

                                                    // Define priority order
                                                    const getPriority = (name) => {
                                                        if (name === 'both group') return 1;
                                                        if (name === 'group 1') return 2;
                                                        if (name === 'group 2') return 3;
                                                        return 4; // All others
                                                    };

                                                    const priorityA = getPriority(nameA);
                                                    const priorityB = getPriority(nameB);

                                                    // If priorities are different, sort by priority
                                                    if (priorityA !== priorityB) {
                                                        return priorityA - priorityB;
                                                    }

                                                    // If both have same priority (both are "others"), sort alphabetically
                                                    return nameA.localeCompare(nameB);
                                                });

                                                return (
                                                    <>
                                                        {sortedPapers.map(paper => {
                                                            const isSelected = selectedPapers.some(p => p.id === paper.id);
                                                            return (
                                                                <div key={paper.id} className="relative inline-block">
                                                                    <button
                                                                        onClick={() => togglePaper(paper)}
                                                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${isSelected
                                                                            ? 'bg-indigo-600 text-white shadow-lg'
                                                                            : 'border-2 border-indigo-200 text-indigo-700 hover:border-indigo-700'
                                                                            }`}
                                                                    >
                                                                        {paper.name}
                                                                    </button>
                                                                    {isSelected && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                togglePaper(paper);
                                                                            }}
                                                                            className="absolute -top-0.5 -right-0.5 bg-white border border-red-400 rounded-full w-4 h-4 flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-600 transition-all z-10"
                                                                        >
                                                                            <X className="h-2.5 w-2.5 text-red-500" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
                                {getPapers().length > 0 && (productTypes.length > 0 || tags.length > 0) && (
                                    <div className="my-4 border-t border-gray-200" />
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {/* Product Type Filter */}
                                    {productTypes.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Product Type</h3>
                                            <select
                                                value={selectedProductType || ''}
                                                onChange={(e) => setSelectedProductType(e.target.value || null)}
                                                className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs font-medium focus:border-emerald-600 focus:outline-none focus:ring-0 transition-colors hover:border-gray-400"
                                            >
                                                <option value="">All Types</option>
                                                {productTypes.map(type => (
                                                    <option key={type} value={type} style={{ textTransform: 'capitalize' }}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Batch Tag Filter */}
                                    {tags.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Batch Type</h3>
                                            <select
                                                value={selectedTag?.id || ''}
                                                onChange={(e) => {
                                                    if (e.target.value === '') {
                                                        setSelectedTag(null);
                                                    } else {
                                                        const selectedId = isNaN(e.target.value) ? e.target.value : parseInt(e.target.value);
                                                        const tag = tags.find(t => t.id === selectedId || String(t.id) === String(selectedId));
                                                        setSelectedTag(tag || null);
                                                    }
                                                }}
                                                className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs font-medium focus:border-indigo-600 focus:outline-none focus:ring-0 transition-colors hover:border-gray-400"
                                            >
                                                <option value="">All Tags</option>
                                                {tags.map(tag => (
                                                    <option key={tag.id} value={tag.id}>
                                                        {tag.tag}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Sort by Price Filter */}
                                    <div>
                                        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sort by Price</h3>
                                        <select
                                            value={priceSorting}
                                            onChange={(e) => setPriceSorting(e.target.value)}
                                            className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs font-medium focus:border-indigo-600 focus:outline-none focus:ring-0 transition-colors hover:border-gray-400"
                                        >
                                            <option value="">All Prices</option>
                                            <option value="low-to-high">Price: Low to High</option>
                                            <option value="high-to-low">Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="store-courses-scroll"
                                style={{
                                    height: isMobile ? "550px" : "",
                                    overflowY: "scroll",
                                    overflowX: "hidden"
                                }}
                            >
                                {filteredCourses?.length > 0 && (
                                    <div className="mb-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-2.5">
                                            {filteredCourses.map((item) => (
                                                <div
                                                    onClick={() => handleCardClick(item)}
                                                    key={item.id}
                                                    className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 flex flex-col transform hover:-translate-y-1 cursor-pointer ${routeData
                                                        ? 'border-amber-200 hover:border-amber-400'
                                                        : 'border-indigo-100 hover:border-indigo-400'
                                                        }`}
                                                >
                                                    {/* Course Image with Overlay */}
                                                    <div className="relative w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                                                        <img
                                                            src={Endpoints?.mediaBaseUrl + item.logo}
                                                            alt={item.title}
                                                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>

                                                    {/* Course Content */}
                                                    <div className="p-2.5 flex-1 flex flex-col">
                                                        <div className="flex items-start justify-between gap-1.5 mb-1">
                                                            <h3 className={`text-xs md:text-sm font-bold line-clamp-2 flex-1 transition-colors text-gray-900 group-hover:text-indigo-700`}>
                                                                {item.title}
                                                            </h3>
                                                        </div>

                                                        {/* Tags */}
                                                        {/* {item.tags && item.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                {item.tags.slice(0, 2).map((tag) => (
                                                                    <span
                                                                        key={tag.id}
                                                                        className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded-full"
                                                                    >
                                                                        {tag.tag}
                                                                    </span>
                                                                ))}
                                                                {item.tags.length > 2 && (
                                                                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full">
                                                                        +{item.tags.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )} */}

                                                        <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                                                            {truncateDescription(item?.shortDescription)}
                                                            {item?.shortDescription?.length > 100 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleExpandDescription(item?.shortDescription);
                                                                    }}
                                                                    className={`font-medium ml-1 underline text-indigo-700 hover:text-indigo-800`}
                                                                >
                                                                    more
                                                                </button>
                                                            )}
                                                        </p>

                                                        {/* Pricing Section */}
                                                        <div className="mb-2 mt-auto">
                                                            {(() => {
                                                                const cartItem = cartCourses.find(c => c.id === item.id);

                                                                const getPriceInfo = () => {
                                                                    if (item?.coursePricing && item.coursePricing.length > 0) {
                                                                        let minOriginalPrice = Infinity;
                                                                        let minFinalPrice = Infinity;
                                                                        let maxDiscount = 0;

                                                                        item.coursePricing.forEach(pricing => {
                                                                            const originalPrice = pricing.price;
                                                                            const discount = pricing.discount || 0;
                                                                            const finalPrice = discount > 0
                                                                                ? originalPrice - (originalPrice * (discount / 100))
                                                                                : originalPrice;

                                                                            if (finalPrice < minFinalPrice) {
                                                                                minFinalPrice = finalPrice;
                                                                                minOriginalPrice = originalPrice;
                                                                                maxDiscount = discount;
                                                                            }
                                                                        });

                                                                        return {
                                                                            originalPrice: minOriginalPrice,
                                                                            finalPrice: minFinalPrice,
                                                                            discount: maxDiscount
                                                                        };
                                                                    }
                                                                    return { originalPrice: 0, finalPrice: 0, discount: 0 };
                                                                };

                                                                const priceInfo = getPriceInfo();

                                                                if (cartItem && cartItem.finalPrice !== undefined && cartItem.finalPrice !== null) {
                                                                    // Get discount info from cart item's selected pricing
                                                                    const cartPricing = item?.coursePricing?.find(p => p.id === cartItem.pricingId);
                                                                    const discount = cartPricing?.discount || 0;
                                                                    const originalPrice = cartPricing?.price || parseFloat(cartItem.finalPrice) * 1.3;

                                                                    return (
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                                <span className="text-[10px] text-gray-500 italic">Starting</span>
                                                                                <span className={`text-sm font-bold`} style={{ color: primaryColor }}>
                                                                                    ₹{parseFloat(cartItem.finalPrice).toFixed(2)}
                                                                                </span>
                                                                                {discount > 0 && (
                                                                                    <span className="text-[9px] font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                                                                                        {discount}% OFF
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {discount > 0 && (
                                                                                <span className="text-[9px] text-gray-400 line-through block">
                                                                                    ₹{originalPrice.toFixed(2)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                                <span className="text-[10px] text-gray-500 italic">Starting</span>
                                                                                <span className={`text-sm font-bold`} style={{ color: priceInfo.finalPrice === 0 ? '#10b981' : primaryColor }}>
                                                                                    {priceInfo.finalPrice === 0 ? '0' : `₹${priceInfo.finalPrice.toFixed(2)}`}
                                                                                </span>
                                                                                {priceInfo.discount > 0 && (
                                                                                    <span className="text-[9px] font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                                                                                        {priceInfo.discount}% OFF
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {priceInfo.discount > 0 && (
                                                                                <span className="text-[9px] text-gray-400 line-through block">
                                                                                    ₹{priceInfo.originalPrice.toFixed(2)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCardClick(item);
                                                                }}
                                                                className={`flex-1 border-2 font-semibold py-1.5 px-2 text-xs rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105`}
                                                                style={{
                                                                    borderColor: primaryColor,
                                                                    color: primaryColor,
                                                                    backgroundColor: `${primaryColor}10`
                                                                }}
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Explore
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddtoCart(item);
                                                                }}
                                                                className={`flex-1 font-semibold py-2 px-2 text-xs rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 transform hover:scale-105 border-2 ${cartCourses.some(a => a.id === item?.id)
                                                                    ? 'bg-white border-red-500 text-red-600 hover:bg-red-50 shadow-sm hover:shadow-red-200/30'
                                                                    : 'text-white border-transparent shadow-lg hover:shadow-lg'
                                                                    }`}
                                                                style={cartCourses.some(a => a.id === item?.id) ? {} : {
                                                                    backgroundColor: primaryColor,
                                                                    boxShadow: `0 10px 15px -3px ${primaryColor}40`
                                                                }}
                                                            >
                                                                <ShoppingCart className="h-4 w-4" />
                                                                {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to cart"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* View More Button - Removed */}
                                    </div>
                                )}

                                {/* Empty State */}
                                {filteredCourses?.length === 0 && !loading && (
                                    <div className="text-center py-8">
                                        <div className="bg-white rounded-3xl shadow-xl p-4 max-w-md mx-auto border border-gray-100">
                                            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner bg-gradient-to-br from-emerald-100 to-green-100">
                                                <ShoppingCart className="h-16 w-16 text-emerald-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Courses Found</h3>
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
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-2xl max-h-[55vh] overflow-y-auto z-50">
                        <div className="flex flex-col h-full bg-white">
                            {/* Header */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-emerald-600/20 sticky top-0">
                                <h2 className="text-base font-black text-black">Refine Filters</h2>
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
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group hover:bg-gray-50 ${selectedExamStage?.id === stage.id
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
