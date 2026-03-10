import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTestSeries } from './TestSeriesContext';

/**
 * Custom hook to handle test series navigation with proper data passing
 * Eliminates Base64 encoding and uses sessionStorage with Next.js router
 */
export const useTestSeriesNavigation = () => {
  const router = useRouter();
  const { setInitialData, persistToSessionStorage } = useTestSeries();

  /**
   * Navigate to test series page with data
   * @param {string} pageType - 'test-series' or 'foundation-test-series'
   * @param {Object} data - Data object containing courseObj, schedules, etc.
   */
  const navigateToTestSeries = useCallback(
    (pageType = 'foundation-test-series', data = {}) => {
      // Store data in context immediately
      setInitialData(data);

      // Also store in sessionStorage as backup for page refresh
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          pageType === 'foundation-test-series'
            ? 'foundationTestData'
            : 'testSeriesData',
          JSON.stringify(data)
        );
      }

      // Navigate using Next.js router (clean URL without parameters)
      router.push(`/${pageType}`);
    },
    [router, setInitialData]
  );

  /**
   * Navigate to course-drips page and back to test-series
   * Maintains form state during navigation
   */
  const navigateWithStatePreservation = useCallback(
    (pageType = 'foundation-test-series', formState = {}) => {
      persistToSessionStorage();

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `${pageType}FormState`,
          JSON.stringify(formState)
        );
      }

      router.push(`/${pageType}`);
    },
    [persistToSessionStorage, router]
  );

  /**
   * Simple router push to previous page
   */
  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    navigateToTestSeries,
    navigateWithStatePreservation,
    navigateBack,
  };
};
