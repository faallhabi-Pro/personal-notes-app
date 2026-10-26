import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import translations from '../utils/translations';

const STORAGE_KEY = 'language';

export const SUPPORTED_LANGUAGES = [
  { code: 'id', label: 'Indonesia', nativeLabel: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', flag: '🇹🇷' },
];

const DATE_LOCALES = {
  id: 'id-ID',
  en: 'en-US',
  ar: 'ar-SA',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  pt: 'pt-BR',
  ru: 'ru-RU',
  hi: 'hi-IN',
  tr: 'tr-TR',
};

const RTL_LANGUAGES = ['ar'];

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const validCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
  return validCodes.includes(saved) ? saved : 'id';
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const changeLanguage = useCallback((code) => {
    const validCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    if (validCodes.includes(code)) {
      setLanguage(code);
    }
  }, []);

  // Keep toggleLanguage for backward compatibility (cycles through id → en → id)
  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'id' ? 'en' : 'id'));
  }, []);

  const t = useCallback((key, params = {}) => {
    const text = translations[language]?.[key] ?? translations.en?.[key] ?? key;
    return Object.entries(params).reduce(
      (result, [name, val]) => result.replace(`{${name}}`, val),
      text,
    );
  }, [language]);

  const currentLangMeta = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0],
    [language],
  );

  const isRTL = RTL_LANGUAGES.includes(language);

  const value = useMemo(() => ({
    language,
    changeLanguage,
    toggleLanguage,
    t,
    dateLocale: DATE_LOCALES[language] ?? 'en-US',
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLangMeta,
    isRTL,
  }), [language, changeLanguage, toggleLanguage, t, currentLangMeta, isRTL]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage harus dipakai di dalam LanguageProvider');
  return context;
}

export { LanguageProvider, useLanguage };
