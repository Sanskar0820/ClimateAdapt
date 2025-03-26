import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Import JSON translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';

// Define resources object
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  mr: { translation: mr },
};

// Detect language function
const detectLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    if (savedLanguage) return savedLanguage;

    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    return Object.keys(resources).includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Fallback in case of an error
  }
};

// Async initialization function
const initializeI18n = async () => {
  const lng = await detectLanguage();
  
  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
};

// Run the initialization
initializeI18n();

export const changeLanguage = async (lng: string) => {
  await AsyncStorage.setItem('language', lng);
  i18n.changeLanguage(lng);
};

export default i18n;
