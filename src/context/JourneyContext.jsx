import { createContext, useContext, useState, useEffect } from 'react';

const JourneyContext = createContext(null);

// Shared option constants for booking forms
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

// Safely read and parse localStorage data
function getStoredData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

// Initial journey data
const getInitialJourney = () => ({
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
});

export function useJourney() {
  const context = useContext(JourneyContext);

  if (context === null) {
    throw new Error('useJourney must be used inside a JourneyProvider');
  }

  return context;
}

export function JourneyProvider({ children }) {
  // Journey state
  const [journey, setJourney] = useState(() => {
    const saved = getStoredData('railmate_journey', null);
    return saved && typeof saved === 'object' && !Array.isArray(saved)
      ? { ...getInitialJourney(), ...saved }
      : getInitialJourney();
  });

  // Saved attractions
  const [savedAttractions, setSavedAttractions] = useState(() => {
    const saved = getStoredData('railmate_saved_attractions', []);
    return Array.isArray(saved) ? saved : [];
  });

  // Travel checklist
  const [checklist, setChecklist] = useState(() => {
    const saved = getStoredData('railmate_checklist', []);
    return Array.isArray(saved) ? saved : [];
  });

  // Safely persist data to localStorage
  const saveStoredData = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  useEffect(() => {
    saveStoredData('railmate_journey', journey);
  }, [journey]);

  useEffect(() => {
    saveStoredData('railmate_saved_attractions', savedAttractions);
  }, [savedAttractions]);

  useEffect(() => {
    saveStoredData('railmate_checklist', checklist);
  }, [checklist]);

  // Update journey details
  const updateJourney = (data) => {
    setJourney((prev) => ({ ...prev, ...data }));
  };

  // Select an outbound train
  const setSelectedTrain = (train) => {
    if (!train) {
      updateJourney({
        selectedTrain: null,
        arrivalTime: '',
      });
      return;
    }

    updateJourney({
      selectedTrain: train,
      source: train.source ?? '',
      destination: train.destination ?? '',
      arrivalTime: train.arrival ?? '',
    });
  };

  // Select a return train
  const setReturnTrain = (train) => {
    updateJourney({ returnTrain: train || null });
  };

  // Reset journey details
  const resetJourney = () => {
    setJourney(getInitialJourney());
  };

  // Attraction helpers
  const addAttraction = (attraction) => {
    if (!attraction || !attraction.name) {
      return;
    }

    setSavedAttractions((prev) => {
      if (prev.some((item) => item.name === attraction.name)) {
        return prev;
      }

      return [...prev, attraction];
    });
  };

  const removeAttraction = (attractionName) => {
    setSavedAttractions((prev) =>
      prev.filter((item) => item.name !== attractionName)
    );
  };

  const isAttractionSaved = (attractionName) => {
    return savedAttractions.some((item) => item.name === attractionName);
  };

  // Checklist helpers
  const setFullChecklist = (items) => {
    setChecklist(Array.isArray(items) ? items : []);
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, checked: !item.checked }
          : item
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
      {children}
    </JourneyContext.Provider>
  );
}