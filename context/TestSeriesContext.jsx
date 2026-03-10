import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const TestSeriesContext = createContext();

// Provider component
export const TestSeriesProvider = ({ children }) => {
  const [testSeriesData, setTestSeriesData] = useState({
    courseObj: null,
    selectedPlanData: null,
    selectedSchedule: null,
    selectScheduleContent: null,
    basicPlan: null,
    // Additional state for form
    activeStep: 0,
    cartArray: [],
    purchaseArray: [],
    selectedTag: null,
    selectCourse: null,
    schedule: null,
    activeBtn: 'both',
    selectSubjectWise: [],
    addtoCartIds: [],
    addedCartPlans: [],
  });

  // Initialize data on mount from sessionStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const foundationTestData = sessionStorage.getItem('foundationTestData');
      const testSeriesStateData = sessionStorage.getItem('testSeriesState');
      
      if (foundationTestData) {
        const parsedData = JSON.parse(foundationTestData);
        setTestSeriesData(prev => ({ ...prev, ...parsedData }));
        sessionStorage.removeItem('foundationTestData');
      }
      
      if (testSeriesStateData) {
        const parsedState = JSON.parse(testSeriesStateData);
        setTestSeriesData(prev => ({ ...prev, ...parsedState }));
        sessionStorage.removeItem('testSeriesState');
      }
    }
  }, []);

  // Method to set initial data from course-drips page
  const setInitialData = useCallback((data) => {
    setTestSeriesData(prev => ({ ...prev, ...data }));
  }, []);

  // Method to update specific fields
  const updateField = useCallback((field, value) => {
    setTestSeriesData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Method to update form data
  const updateFormData = useCallback((updates) => {
    setTestSeriesData(prev => ({ ...prev, ...updates }));
  }, []);

  // Method to reset all data
  const resetTestSeriesData = useCallback(() => {
    setTestSeriesData({
      courseObj: null,
      selectedPlanData: null,
      selectedSchedule: null,
      selectScheduleContent: null,
      basicPlan: null,
      activeStep: 0,
      cartArray: [],
      purchaseArray: [],
      selectedTag: null,
      selectCourse: null,
      schedule: null,
      activeBtn: 'both',
      selectSubjectWise: [],
      addtoCartIds: [],
      addedCartPlans: [],
    });
  }, []);

  // Method to persist data to sessionStorage (for navigation)
  const persistToSessionStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('testSeriesState', JSON.stringify(testSeriesData));
    }
  }, [testSeriesData]);

  const value = {
    testSeriesData,
    setInitialData,
    updateField,
    updateFormData,
    resetTestSeriesData,
    persistToSessionStorage,
  };

  return (
    <TestSeriesContext.Provider value={value}>
      {children}
    </TestSeriesContext.Provider>
  );
};

// Custom hook to use the context
export const useTestSeries = () => {
  const context = useContext(TestSeriesContext);
  if (!context) {
    throw new Error('useTestSeries must be used within TestSeriesProvider');
  }
  return context;
};
