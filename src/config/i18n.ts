// Configuración de internacionalización
// Permite cambiar entre diferentes idiomas y manejar traducciones

export type SupportedLanguage = 'es' | 'en';

export interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  fallbackLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
}

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'es',
  fallbackLanguage: 'es',
  supportedLanguages: ['es', 'en']
};

// Función para obtener el idioma actual del navegador
export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split('-')[0];
  return i18nConfig.supportedLanguages.includes(browserLang as SupportedLanguage) 
    ? browserLang as SupportedLanguage 
    : i18nConfig.defaultLanguage;
};

// Función para obtener el idioma del localStorage o del navegador
export const getCurrentLanguage = (): SupportedLanguage => {
  const storedLang = localStorage.getItem('app-language') as SupportedLanguage;
  if (storedLang && i18nConfig.supportedLanguages.includes(storedLang)) {
    return storedLang;
  }
  return getBrowserLanguage();
};

// Función para cambiar el idioma
export const setLanguage = (language: SupportedLanguage): void => {
  if (i18nConfig.supportedLanguages.includes(language)) {
    localStorage.setItem('app-language', language);
    // Aquí se podría disparar un evento para notificar el cambio de idioma
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { language } }));
  }
};

// Hook para detectar cambios de idioma
export const useLanguageChange = (callback: (language: SupportedLanguage) => void) => {
  const handleLanguageChange = (event: CustomEvent) => {
    callback(event.detail.language);
  };

  window.addEventListener('language-changed', handleLanguageChange as EventListener);
  
  return () => {
    window.removeEventListener('language-changed', handleLanguageChange as EventListener);
  };
};
