import { useState, useEffect, useCallback } from 'react';
import { esTranslations } from '../locales/es';
import type { SpanishTranslations } from '../locales/es';
import { enTranslations } from '../locales/en';
import type { EnglishTranslations } from '../locales/en';
import { getCurrentLanguage, setLanguage, useLanguageChange } from '../config/i18n';
import type { SupportedLanguage } from '../config/i18n';

// Tipo unión para todas las traducciones
export type Translations = SpanishTranslations | EnglishTranslations;

// Hook para manejar traducciones
export const useTranslations = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
  const [translations, setTranslations] = useState<Translations>(esTranslations);

  // Función para cambiar idioma
  const changeLanguage = useCallback((language: SupportedLanguage) => {
    setLanguage(language);
    setCurrentLanguage(language);
    
    // Actualizar traducciones
    if (language === 'en') {
      setTranslations(enTranslations);
    } else {
      setTranslations(esTranslations);
    }
  }, []);

  // Función para obtener traducción anidada
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    // Navegar por la estructura anidada
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Devolver la clave si no se encuentra la traducción
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    // Aplicar parámetros si existen
    if (params) {
      let result = value;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
      return result;
    }
    
    return value;
  }, [translations]);

  // Función para obtener traducción con fallback
  const tWithFallback = useCallback((key: string, fallback?: string, params?: Record<string, string | number>): string => {
    const translation = t(key, params);
    if (translation === key && fallback) {
      return fallback;
    }
    return translation;
  }, [t]);

  // Escuchar cambios de idioma
  useEffect(() => {
    const unsubscribe = useLanguageChange((language) => {
      setCurrentLanguage(language);
      if (language === 'en') {
        setTranslations(enTranslations);
      } else {
        setTranslations(esTranslations);
      }
    });

    return unsubscribe;
  }, []);

  // Inicializar idioma
  useEffect(() => {
    const initialLanguage = getCurrentLanguage();
    setCurrentLanguage(initialLanguage);
    if (initialLanguage === 'en') {
      setTranslations(enTranslations);
    } else {
      setTranslations(esTranslations);
    }
  }, []);

  return {
    currentLanguage,
    changeLanguage,
    t,
    tWithFallback,
    translations,
    isEnglish: currentLanguage === 'en',
    isSpanish: currentLanguage === 'es'
  };
};

// Hook simplificado para uso rápido
export const useT = () => {
  const { t, tWithFallback } = useTranslations();
  return { t, tWithFallback };
};
