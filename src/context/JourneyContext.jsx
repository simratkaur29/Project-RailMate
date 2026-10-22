import { createContext, useContext, useState, useEffect } from 'react';

const JourneyContext = createContext(null);

export function useJourney() {
  return useContext(JourneyContext);
}

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState(() => {
    const saved = localStorage.getItem('railmate_journey');
    return saved
      ? JSON.parse(saved)
      : {
          source: '',
          destination: '',
          selectedTrain: null,
          travelDate: '',
          travelPurpose: '',
          interests: [],
        };
  });

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('railmate_checklist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('railmate_journey', JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    localStorage.setItem('railmate_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const updateJourney = (data) => {
    setJourney((prev) => ({ ...prev, ...data }));
  };

  const resetJourney = () => {
    setJourney({
      source: '',
      destination: '',
      selectedTrain: null,
      travelDate: '',
      travelPurpose: '',
      interests: [],
    });
  };

  const setFullChecklist = (items) => {
    setChecklist(items);
  };

  return (
    <JourneyContext.Provider
      value={{ journey, updateJourney, resetJourney, checklist, setFullChecklist }}
    >
      {children}
    </JourneyContext.Provider>
  );
}
