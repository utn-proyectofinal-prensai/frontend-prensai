// Exportar todos los hooks
// Hooks personalizados que encapsulan lógica de negocio reutilizable

// Hook para autenticación
export { useAuth } from './useAuth';
export { useIsAdmin } from './useAuth';

// Hook para manejo de formularios de login
export { useLoginForm } from './useLoginForm';

// Hook para internacionalización
export { useTranslations, useT } from './useTranslations';
export type { Translations } from './useTranslations';

// Hook para control de animaciones
export { useAnimationControl } from './useAnimationControl';

// Hook para manejo del dropdown del usuario
export { useUserDropdown } from './useUserDropdown';

// Hook para manejo de noticias
export { useNews, useNewsById } from './useNews';

// Hook para manejo de temas
export { useTopics, useEnabledTopics } from './useTopics';

// Hook para manejo de menciones
export { useMentions, useEnabledMentions } from './useMentions';

// Hook para configuraciones de IA
export { useAiConfigurations } from './useAiConfigurations';

// Hook para reportes de clippings
export { useClippingReport } from './useClippingReport';
export type { ClippingReport, ClippingReportResponse } from './useClippingReport';
