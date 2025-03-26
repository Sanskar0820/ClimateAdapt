import React, { createContext, useContext, useState, useEffect } from 'react';
import PlaceAttributes from '../../assets/PlaceAttributes.json';
import { useTranslation } from 'react-i18next';


const SelectedFeatureContext = createContext();

export function SelectedFeatureProvider({ children }) {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [tehsilList, setTehsilList] = useState([]);
  const { t } = useTranslation();
  

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedTehsil('');
    if (district) {
      const filteredTehsils = PlaceAttributes.filter(
        (item) => item.DISTRICT === district
      );
      setTehsilList(filteredTehsils);
    } else {
      setTehsilList([]);
    }
  };

  const handleTehsilSelect = (tehsil) => {
    setSelectedTehsil(tehsil);
  };

  return (
    <SelectedFeatureContext.Provider
      value={{
        selectedDistrict,
        selectedTehsil,
        tehsilList,
        handleDistrictSelect,
        handleTehsilSelect,
      }}
    >
      {children}
    </SelectedFeatureContext.Provider>
  );
}

export function useSelectedFeature() {
  const context = useContext(SelectedFeatureContext);
  if (context === undefined) {
    throw new Error('useSelectedFeature must be used within a SelectedFeatureProvider');
  }
  return context;
} 