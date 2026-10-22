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


  const [savedAttractions, setSavedAttractions] = useState(() => {
    const saved = localStorage.getItem('railmate_saved_attractions');
    return saved ? JSON.parse(saved) : [];
  });


  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('railmate_checklist');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    localStorage.setItem('railmate_journey', JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    localStorage.setItem('railmate_saved_attractions', JSON.stringify(savedAttractions));
  }, [savedAttractions]);

  useEffect(() => {
    localStorage.setItem('railmate_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const updateJourney = (data) => {
    setJourney((prev) => ({ ...prev, ...data }));
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
      {children}
    </JourneyContext.Provider>
  );
}
