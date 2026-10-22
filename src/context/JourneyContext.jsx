import { createContext, useContext, useState } from 'react';

const JourneyContext = createContext();

export function useJourney() {
  return useContext(JourneyContext);
}

export function JourneyProvider({ children }) {
  const [journeyData, setJourneyData] = useState({
    source: '',
    destination: '',
    date: '',
    selectedTrain: null,
  });

  const updateJourney = (data) => {
    setJourneyData((prev) => ({ ...prev, ...data }));
  };

  const resetJourney = () => {
    setJourneyData({
      source: '',
      destination: '',
      date: '',
      selectedTrain: null,
    });
  };

  return (
    <JourneyContext.Provider value={{ journeyData, updateJourney, resetJourney }}>
      {children}
    </JourneyContext.Provider>
  );
}
