// ============================================================================
// BEFORE: Current course-drips.js (with Base64 encoding)
// ============================================================================

/**
 * Current handleSelectPlan implementation (OLD):
 * 
 * const handleSelectPlan = (contentId) => {
 *   if (((selectedContentId?.title === "Full Length Test Series" || 
 *        selectedContentId?.title === "Exam oriented Test Series") && 
 *       (courseObj?.title === "CA Final" || courseObj?.title === "CA Inter")) || 
 *      (selectedContentId?.title === "Portion WiseTest Series" && 
 *       courseObj?.title === "CA Final")) {
 *     let data = Base64.encode(JSON.stringify({
 *       courseObj: courseObj,
 *       selectedPlanData: "",
 *       selectedSchedule: selectedSchedule,
 *       selectScheduleContent: selectedContentId,
 *       basicPlan: contentId
 *     }), true)
 *     navigate('/test-series?data=' + data);
 *   } else if (selectedContentId?.title === "Full Length Test Series" && 
 *              courseObj?.title === "CA Foundation") {
 *     let data = Base64.encode(JSON.stringify({
 *       courseObj: courseObj,
 *       selectedPlanData: contentId,
 *       selectedSchedule: selectedSchedule,
 *       selectScheduleContent: selectedContentId,
 *       basicPlan: contentId
 *     }), true)
 *     navigate('/foundation-test-series?data=' + data)
 *   }
 * }
 */

// ============================================================================
// AFTER: Updated course-drips.js (with Context Hook)
// ============================================================================

/**
 * Changes to make in course-drips.js:
 * 
 * 1. REMOVE this import:
 *    - import { Base64 } from 'js-base64';
 * 
 * 2. ADD this import:
 *    + import { useTestSeriesNavigation } from '../hooks/useTestSeriesNavigation';
 * 
 * 3. ADD this hook call at the start of component:
 *    const { navigateToTestSeries } = useTestSeriesNavigation();
 * 
 * 4. REPLACE the handleSelectPlan function (see below)
 */

// REPLACE THIS FUNCTION:
export const handleSelectPlan_NEW = (
  contentId,
  courseObj,
  selectedContentId,
  selectedSchedule,
  navigateToTestSeries
) => {
  // Cleaner logic without Base64 encoding
  
  if (
    ((selectedContentId?.title === "Full Length Test Series" || 
      selectedContentId?.title === "Exam oriented Test Series") && 
     (courseObj?.title === "CA Final" || courseObj?.title === "CA Inter")) || 
    (selectedContentId?.title === "Portion WiseTest Series" && 
     courseObj?.title === "CA Final")
  ) {
    // Navigate to test-series with clean URL
    navigateToTestSeries('test-series', {
      courseObj: courseObj,
      selectedPlanData: "",
      selectedSchedule: selectedSchedule,
      selectScheduleContent: selectedContentId,
      basicPlan: contentId
    });
    
  } else if (
    selectedContentId?.title === "Full Length Test Series" && 
    courseObj?.title === "CA Foundation"
  ) {
    // Navigate to foundation-test-series with clean URL
    navigateToTestSeries('foundation-test-series', {
      courseObj: courseObj,
      selectedPlanData: contentId,
      selectedSchedule: selectedSchedule,
      selectScheduleContent: selectedContentId,
      basicPlan: contentId
    });
  }
};

// ============================================================================
// SIMILARLY, UPDATE handleTestDetail
// ============================================================================

/**
 * CURRENT (OLD):
 * 
 * const handleTestDetail = (item) => {
 *   if (courseObj?.title === "CA Foundation") {
 *     let data = Base64.encode(JSON.stringify({
 *       courseObj: courseObj,
 *       selectedPlanData: item,
 *       selectedSchedule: selectedSchedule,
 *       selectScheduleContent: selectedContentId,
 *       basicPlan: selectedPlan
 *     }), true)
 *     navigate('/foundation-test-series?data=' + data)
 *   } else {
 *     let data = Base64.encode(JSON.stringify({
 *       courseObj: courseObj,
 *       selectedPlanData: item,
 *       selectedSchedule: selectedSchedule,
 *       selectScheduleContent: selectedContentId,
 *       basicPlan: selectedPlan
 *     }), true)
 *     navigate('/test-series?data=' + data)
 *   }
 * }
 */

export const handleTestDetail_NEW = (
  item,
  courseObj,
  selectedSchedule,
  selectedContentId,
  selectedPlan,
  navigateToTestSeries
) => {
  const testData = {
    courseObj: courseObj,
    selectedPlanData: item,
    selectedSchedule: selectedSchedule,
    selectScheduleContent: selectedContentId,
    basicPlan: selectedPlan
  };

  const pageType = courseObj?.title === "CA Foundation" 
    ? 'foundation-test-series' 
    : 'test-series';
    
  navigateToTestSeries(pageType, testData);
};

// ============================================================================
// SIMILARLY, UPDATE handleContentClick
// ============================================================================

export const handleContentClick_NEW = (
  contentId,
  courseObj,
  selectedSchedule,
  navigateToTestSeries
) => {
  if (courseObj?.title === "CA Inter" && 
      contentId?.title === "Test Series Plus Mentorship") {
    
    navigateToTestSeries('test-series', {
      courseObj: courseObj,
      selectedPlanData: "",
      selectedSchedule: selectedSchedule,
      selectScheduleContent: contentId,
      basicPlan: ""
    });
  }
  // else: handle other logic (doesn't involve navigation)
};

// ============================================================================
// INTEGRATION CHECKLIST FOR course-drips.js
// ============================================================================

/**
 * Here's the exact sequence of changes:
 * 
 * 1. [ ] Remove import: import { Base64 } from 'js-base64';
 * 
 * 2. [ ] Add import: import { useTestSeriesNavigation } from '../hooks/useTestSeriesNavigation';
 * 
 * 3. [ ] Inside component, add hook:
 *        const { navigateToTestSeries } = useTestSeriesNavigation();
 * 
 * 4. [ ] Replace handleContentClick function body
 *        (Compare with handleContentClick_NEW above)
 * 
 * 5. [ ] Replace handleSelectPlan function body
 *        (Compare with handleSelectPlan_NEW above)
 * 
 * 6. [ ] Replace handleTestDetail function body
 *        (Compare with handleTestDetail_NEW above)
 * 
 * 7. [ ] Test navigation:
 *        - Click "Select Programme"
 *        - Verify URL is clean (/foundation-test-series not /foundation-test-series?data=...)
 *        - Verify data loads correctly on destination page
 *        - Check browser console for any errors
 * 
 * 8. [ ] Done! Commit changes with message:
 *        "refactor: replace Base64 URL encoding with Context API for test series"
 */

export default {};
