// ============================================================================
// BEFORE: Current foundation-test-series.js (with Base64 decoding)
// ============================================================================

/**
 * Current data initialization (OLD):
 * 
 * const router = useRouter();
 * const queryParam = new URLSearchParams(
 *   typeof window !== 'undefined' ? window.location.search : ''
 * );
 * const campaignId = queryParam.get("campaignId");
 * 
 * let data = {};
 * if (typeof window !== 'undefined') {
 *   const foundationTestData = sessionStorage.getItem('foundationTestData');
 *   if (foundationTestData) {
 *     data = JSON.parse(foundationTestData);
 *     sessionStorage.removeItem('foundationTestData');
 *   } else {
 *     let paramData = queryParam.get("data");
 *     data = paramData ? JSON?.parse(Base64?.decode(paramData)) : {};
 *   }
 * }
 * 
 * const selectCourserout = data.courseObj;
 * const basicPlanObj = data.basicPlan;
 * // ... etc
 */

// ============================================================================
// AFTER: Updated foundation-test-series.js (with Context Hook)
// ============================================================================

/**
 * Changes to make in foundation-test-series.js:
 * 
 * 1. REMOVE these imports:
 *    - import { Base64 } from 'js-base64';
 *    - Remove custom URL parameter parsing
 * 
 * 2. ADD these imports:
 *    + import { useTestSeries } from '../context/TestSeriesContext';
 *    + import { useTestSeriesNavigation } from '../hooks/useTestSeriesNavigation';
 * 
 * 3. SIMPLIFY data initialization (see below)
 */

// ============================================================================
// STEP 1: Update Component Function Signature
// ============================================================================

/**
 * CURRENT (OLD):
 * export const FoundationTestSeries = () => {
 */

/**
 * UPDATED (NEW):
 * export const FoundationTestSeries = ({ cartNumberUpdate }) => {
 *   const { testSeriesData, updateField, updateFormData } = useTestSeries();
 *   const { navigateToTestSeries, navigateBack } = useTestSeriesNavigation();
 */

// ============================================================================
// STEP 2: Simplify Data Initialization
// ============================================================================

/**
 * REMOVE all this code:
 * 
 * const router = useRouter();
 * const queryParam = new URLSearchParams(...);
 * const campaignId = queryParam.get("campaignId");
 * let data = {};
 * if (typeof window !== 'undefined') {
 *   const foundationTestData = sessionStorage.getItem('foundationTestData');
 *   // ... complex conditional logic
 * }
 */

/**
 * REPLACE with this:
 */

// Simple initialization from context
const { testSeriesData, updateField, updateFormData } = useTestSeries();

// Extract data directly (no parsing or decoding needed)
const selectCourserout = testSeriesData?.courseObj;
const basicPlanObj = testSeriesData?.basicPlan;
const selectScheduleContentObj = testSeriesData?.selectScheduleContent;
const selectedPlanDataObj = testSeriesData?.selectedPlanData;
const selectedScheduleObj = testSeriesData?.selectedSchedule;

// Get query params only for specific things like campaign ID
const router = useRouter();
const { campaignId } = router.query;

/**
 * That's it! Instead of:
 * - Parsing URL search params
 * - Base64 decoding
 * - Conditional sessionStorage checks
 * - Removing data from sessionStorage
 * 
 * You now just access testSeriesData from context
 */

// ============================================================================
// STEP 3: Update useState Initialization
// ============================================================================

/**
 * CURRENT (OLD) - Initialize with empty or fallback values:
 * const [selectCourse, setSelectCourse] = useState('');
 * 
 * UPDATED (NEW) - Can still initialize empty, but values from context available:
 * const [selectCourse, setSelectCourse] = useState('');
 * 
 * No changes needed here! But add this in useEffect:
 */

// Initialize form from context data
useEffect(() => {
  if (selectCourserout?.id) {
    // Use updateField from context to sync state
    updateFormData({
      selectCourse: selectCourserout,
      selectedSchedule: selectedScheduleObj || {},
    });
    // Fetch course content
    getCourseContentList(selectCourserout?.id);
  }
}, [selectCourserout]);

// ============================================================================
// STEP 4: Update Navigation Calls
// ============================================================================

/**
 * CURRENT (OLD): Using Base64 encoding
 * 
 * function handleNextBrowse() {
 *   data['selectedSchedule'] = JSON.stringify(selectedSchedule);
 *   // ... more assignments
 *   navigate('/foundation-test-series?data=' + Base64.encode(JSON.stringify(data), true));
 * }
 */

/**
 * UPDATED (NEW): Using Context
 */

function handleNextBrowse() {
  // Update context instead of creating Base64 string
  updateFormData({
    selectedSchedule: JSON.stringify(selectedSchedule),
    selectedAotherSchedule: JSON.stringify(selectedAotherSchedule),
    selectedBasicPlan: JSON.stringify(selectedBasicPlan),
    selectedForPlans: JSON.stringify(selectedForPlans),
    selectedTag: JSON.stringify(selectedTag),
    selectCourse: JSON.stringify(selectCourse),
    activeStep: activeStep,
    schedule: JSON.stringify(schedule),
    activeBtn: activeBtn,
    selectSubjectWise: JSON.stringify(selectSubjectWise),
    addtoCartIds: JSON.stringify(addtoCartIds),
    addedCartPlans: JSON.stringify(addedCartPlans),
    purchaseArray: JSON.stringify(purchaseArray),
  });
  
  // Clean navigation without data in URL
  router.push('/foundation-test-series');
}

// ============================================================================
// STEP 5: Update Back Navigation
// ============================================================================

/**
 * CURRENT (OLD):
 * const handleBack = () => {
 *   setActiveStep((prevActiveStep) => prevActiveStep - 1);
 * }
 */

/**
 * UPDATED (NEW):
 */

const handleBack = () => {
  if (activeStep === 0) {
    navigateBack(); // Use the hook to go back to previous page
  } else {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
};

// ============================================================================
// STEP 6: Update Form Data Persistence
// ============================================================================

/**
 * CURRENT (OLD):
 * useEffect(() => {
 *   localStorage.setItem("addedCartPlans", JSON.stringify(addedCartPlans));
 *   localStorage.setItem("purchaseArray", JSON.stringify(purchaseArray));
 *   localStorage.setItem("addtoCartIds", JSON.stringify(addtoCartIds));
 * }, [addedCartPlans, purchaseArray, addtoCartIds])
 */

/**
 * UPDATED (NEW) - Also update context with form state:
 */

useEffect(() => {
  localStorage.setItem("addedCartPlans", JSON.stringify(addedCartPlans));
  localStorage.setItem("purchaseArray", JSON.stringify(purchaseArray));
  localStorage.setItem("addtoCartIds", JSON.stringify(addtoCartIds));
  
  // Also persist to React context
  updateFormData({
    addedCartPlans,
    purchaseArray,
    addtoCartIds,
  });
}, [addedCartPlans, purchaseArray, addtoCartIds]);

// ============================================================================
// STEP 7: Remove Unnecessary Checks
// ============================================================================

/**
 * REMOVE code checking typeof window (if using context):
 * 
 * OLD:
 * if (typeof window !== 'undefined') {
 *   const foundationTestData = sessionStorage.getItem('foundationTestData');
 *   // ... complex logic
 * }
 * 
 * NEW: Context hook handles this internally, no need to check
 * Just use testSeriesData directly
 */

// ============================================================================
// STEP 8: Clean Up Imports
// ============================================================================

/**
 * REMOVE:
 * - import { Base64 } from 'js-base64';  ❌
 * 
 * ADD:
 * + import { useTestSeries } from '../context/TestSeriesContext';  ✅
 * + import { useTestSeriesNavigation } from '../hooks/useTestSeriesNavigation';  ✅
 */

// ============================================================================
// BEFORE & AFTER COMPARISON
// ============================================================================

/**
 * BEFORE (~40 lines of code):
 * 
 * const router = useRouter();
 * const queryParam = new URLSearchParams(...);
 * const campaignId = queryParam.get("campaignId");
 * let paramData = queryParam.get("data");
 * let data = paramData ? JSON?.parse(Base64?.decode(paramData)) : {};
 * const selectCourserout = data.courseObj;
 * const basicPlanObj = data.basicPlan;
 * const selectScheduleContentObj = data?.selectScheduleContent;
 * const selectedPlanDataObj = data?.selectedPlanData;
 * const selectedScheduleObj = data?.selectedSchedule;
 * // Complex conditional logic for sessionStorage
 * if (typeof window !== 'undefined') {
 *   const foundationTestData = sessionStorage.getItem('foundationTestData');
 *   if (foundationTestData) {
 *     data = JSON.parse(foundationTestData);
 *     sessionStorage.removeItem('foundationTestData');
 *   } else {
 *     // ... fallback logic
 *   }
 * }
 * console.log('dataaaaa', data);
 */

/**
 * AFTER (~10 lines of code):
 * 
 * const router = useRouter();
 * const { testSeriesData, updateField, updateFormData } = useTestSeries();
 * const { campaignId } = router.query;
 * 
 * const selectCourserout = testSeriesData?.courseObj;
 * const basicPlanObj = testSeriesData?.basicPlan;
 * const selectScheduleContentObj = testSeriesData?.selectScheduleContent;
 * const selectedPlanDataObj = testSeriesData?.selectedPlanData;
 * const selectedScheduleObj = testSeriesData?.selectedSchedule;
 * 
 * // That's it!
 */

// ============================================================================
// INTEGRATION CHECKLIST FOR foundation-test-series.js
// ============================================================================

/**
 * [ ] Step 1: Add imports for Context Hook
 * [ ] Step 2: Add hook call at component start
 * [ ] Step 3: Replace data initialization code
 * [ ] Step 4: Update handleNextBrowse function
 * [ ] Step 5: Update handleBack function
 * [ ] Step 6: Update form persistence useEffect
 * [ ] Step 7: Remove Base64 import
 * [ ] Step 8: Remove unnecessary window checks
 * [ ] Step 9: Test navigation and data flow
 * [ ] Step 10: Verify cart functionality still works
 * [ ] Step 11: Commit with message:
 *             "refactor: migrate foundation-test-series to Context API"
 */

export default {};
