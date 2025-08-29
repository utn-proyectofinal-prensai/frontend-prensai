export const AUTH_CONFIG = {
  ANIMATION_DELAYS: {
    LOGO: 0,
    TITLE: 0.2,
    FORM: 0.1,      // Más rápido para el formulario
    PASSWORD: 0.2,   // Más rápido para el segundo campo
    BUTTON: 0.4      // Más rápido para el botón
  },
  PLACEHOLDERS: {
    EMAIL: 'Ingresa tu email',
    PASSWORD: 'Ingresa tu contraseña'
  }
} as const;
