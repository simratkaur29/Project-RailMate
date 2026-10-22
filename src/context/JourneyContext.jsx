import { createContext, useContext, useState, useEffect } from 'react';

const JourneyContext = createContext(null);

export function useJourney() {
  return useContext(JourneyContext);
}


export const BERTH_OPTIONS = [
  { value: 'No Preference', label: 'No Preference' },
  { value: 'Lower Berth', label: 'Lower Berth' },
  { value: 'Middle Berth', label: 'Middle Berth' },
  { value: 'Upper Berth', label: 'Upper Berth' },
  { value: 'Side Lower', label: 'Side Lower' },
  { value: 'Side Upper', label: 'Side Upper' },
  { value: 'Window', label: 'Window Seat' },
];

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export function JourneyProvider({ children }) {


/**
 * JourneyProvider — Global state for the current journey, saved attractions, and travel checklist.
 * Wraps the application to share journey data across Train Search, Destination Guide,
 * Travel Assistant, and My Trips pages.
 */
export function JourneyProvider({ children }) {
  // ---- Journey state (selected source, destination, train, etc.) ----
  const [journey, setJourney] = useState(() => {
    const saved = localStorage.getItem('railmate_journey');
    return saved
      ? JSON.parse(saved)
      : {
        source: '',
        destination: '',
        tripType: 'oneWay',
        selectedTrain: null,
        returnTrain: null,
        travelDate: '',
        returnDate: '',
        arrivalTime: '',
        travelPurpose: '',
        interests: [],
      };
  });


          source: '',
          destination: '',
          selectedTrain: null,
          travelDate: '',
          arrivalTime: '',
          travelPurpose: '',
          interests: [],
        };
  });

  // ---- Saved attractions (from Destination Guide) ----
  const [savedAttractions, setSavedAttractions] = useState(() => {
    const saved = localStorage.getItem('railmate_saved_attractions');
    return saved ? JSON.parse(saved) : [];
  });


  // ---- Travel checklist (items + checked state) ----
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('railmate_checklist');
    return saved ? JSON.parse(saved) : [];
  });


  // Persist journey to localStorage
  useEffect(() => {
    localStorage.setItem('railmate_journey', JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    localStorage.setItem('railmate_saved_attractions', JSON.stringify(savedAttractions));
  }, [savedAttractions]);

  // Persist saved attractions to localStorage
  useEffect(() => {
    localStorage.setItem(
      'railmate_saved_attractions',
      JSON.stringify(savedAttractions)
    );
  }, [savedAttractions]);

  // Persist checklist to localStorage
  useEffect(() => {
    localStorage.setItem('railmate_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const updateJourney = (data) => {
    setJourney((prev) => ({ ...prev, ...data }));
  // ---------- Journey updaters ----------

  const updateJourney = (updates) => {
    setJourney((prev) => ({ ...prev, ...updates }));
  };

  const setSelectedTrain = (train) => {
    if (!train) {
      updateJourney({ selectedTrain: null });
      return;
    }
    updateJourney({
      selectedTrain: train,
      source: train.source,
      destination: train.destination,
      arrivalTime: train.arrival || '',
    });
  };

  const setReturnTrain = (train) => {
    updateJourney({ returnTrain: train || null });
  };

  const resetJourney = () => {
    setJourney({
      source: '',
      destination: '',
      tripType: 'oneWay',
      selectedTrain: null,
      returnTrain: null,
      travelDate: '',
      returnDate: '',
  const clearJourney = () => {
    setJourney({
      source: '',
      destination: '',
      selectedTrain: null,
      travelDate: '',
      arrivalTime: '',
      travelPurpose: '',
      interests: [],
    });
  };


  const addAttraction = (attraction) => {
    setSavedAttractions((prev) => {
      if (prev.some((a) => a.name === attraction.name)) return prev;
      return [...prev, attraction];
    });
  };

  const removeAttraction = (attractionName) => {
    setSavedAttractions((prev) => prev.filter((a) => a.name !== attractionName));
  };

  const isAttractionSaved = (attractionName) => {
    return savedAttractions.some((a) => a.name === attractionName);
  };


  const setFullChecklist = (items) => {
  // ---------- Saved attractions helpers ----------

  const addAttraction = (attraction, destinationName) => {
    setSavedAttractions((prev) => {
      // Prevent duplicates using attraction id + destination
      const exists = prev.some(
        (a) => a.id === attraction.id && a.destination === destinationName
      );
      if (exists) return prev;
      return [...prev, { ...attraction, destination: destinationName }];
    });
  };

  const removeAttraction = (attractionId, destinationName) => {
    setSavedAttractions((prev) =>
      prev.filter(
        (a) => !(a.id === attractionId && a.destination === destinationName)
      )
    );
  };

  const isAttractionSaved = (attractionId, destinationName) => {
    return savedAttractions.some(
      (a) => a.id === attractionId && a.destination === destinationName
    );
  };

  // ---------- Checklist helpers ----------

  const setFullChecklist = (items) => {
    // items: array of { id, text, checked }
    setChecklist(items);
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <JourneyContext.Provider
      value={{
        journey,
        updateJourney,
        setSelectedTrain,
        setReturnTrain,
        resetJourney,
        savedAttractions,
        addAttraction,
        removeAttraction,
        isAttractionSaved,
        checklist,
        setFullChecklist,
        toggleChecklistItem,
      }}
    >
  const value = {
    journey,
    updateJourney,
    setSelectedTrain,
    clearJourney,
    savedAttractions,
    addAttraction,
    removeAttraction,
    isAttractionSaved,
    checklist,
    setFullChecklist,
    toggleChecklistItem,
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

/**
 * Custom hook for accessing the JourneyContext.
 * Must be used inside a JourneyProvider.
 */
export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}

export default JourneyContext;
