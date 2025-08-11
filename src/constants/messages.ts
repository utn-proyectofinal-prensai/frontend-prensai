// Constantes de mensajes para toda la aplicación
// Centraliza todos los textos para facilitar mantenimiento e internacionalización

export const AUTH_MESSAGES = {
  // Mensajes de validación
  VALIDATION: {
    EMAIL_REQUIRED: 'El email es requerido',
    EMAIL_INVALID_FORMAT: 'El formato del email no es válido',
    EMAIL_TOO_LONG: 'El email es demasiado largo',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
    PASSWORD_TOO_LONG: 'La contraseña es demasiado larga',
    CREDENTIALS_INVALID: 'Credenciales inválidas. Inténtalo de nuevo.',
    AUTHENTICATION_ERROR: 'Error de autenticación',
    SESSION_EXPIRED: 'Sesión expirada'
  },
  
  // Mensajes de estado
  STATUS: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Cierre de sesión exitoso',
    LOGIN_ERROR: 'Error al iniciar sesión',
    LOGOUT_ERROR: 'Error al cerrar sesión'
  }
} as const;

export const DASHBOARD_MESSAGES = {
  ERRORS: {
    LOAD_DATA_ERROR: 'Error al cargar los datos del dashboard',
    GENERAL_ERROR: 'Error al cargar los datos'
  },
  SUCCESS: {
    DATA_LOADED: 'Datos cargados correctamente'
  },
  COMMON: {
    LOADING: 'Cargando dashboard...'
  }
} as const;

export const ADMIN_MESSAGES = {
  ERRORS: {
    INVALID_CREDENTIALS: 'Credenciales de administrador incorrectas',
    ACCESS_DENIED: 'Acceso denegado'
  },
  SUCCESS: {
    LOGIN_SUCCESS: 'Acceso de administrador concedido'
  }
} as const;

export const UPLOAD_MESSAGES = {
  ERRORS: {
    URL_ALREADY_EXISTS: 'Esta URL ya ha sido agregada',
    INVALID_URL: 'URL inválida',
    INVALID_FILE_TYPE: 'Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV'
  },
  SUCCESS: {
    UPLOAD_SUCCESS: 'Archivo subido correctamente'
  }
} as const;

export const NOT_FOUND_MESSAGES = {
  TITLE: 'Página no encontrada',
  DESCRIPTION: 'La página que buscas no existe o ha sido movida.',
  CONTACT_ADMIN: 'Si crees que esto es un error, contacta al administrador del sistema.',
  GO_HOME: 'Ir al inicio'
} as const;

export const API_MESSAGES = {
  ERRORS: {
    HTTP_ERROR: 'HTTP error! status:',
    REQUEST_ERROR: 'Error en API request:',
    IMPORT_ERROR: 'Error importando noticias:',
    LOGIN_ERROR: 'Error en login:',
    LOGOUT_ERROR: 'Error en logout:'
  }
} as const;

// Función helper para obtener mensajes con parámetros
export const formatMessage = (message: string, params: Record<string, string | number>): string => {
  let formattedMessage = message;
  Object.entries(params).forEach(([key, value]) => {
    formattedMessage = formattedMessage.replace(`{${key}}`, String(value));
  });
  return formattedMessage;
};

// Función helper para obtener mensajes de error específicos
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  // Mensajes de validación de formularios
  VALIDATION: {
    EMAIL: {
      REQUIRED: 'Por favor, ingresa tu dirección de email',
      INVALID_FORMAT: 'Ingresa una dirección de email válida (ejemplo: usuario@empresa.com)',
      MISSING_AT: 'Falta el símbolo @ en tu email',
      MISSING_DOMAIN: 'Tu email debe incluir un dominio válido',
      TOO_SHORT: 'Tu email parece ser muy corto'
    },
    PASSWORD: {
      REQUIRED: 'Por favor, ingresa tu contraseña',
      TOO_SHORT: 'Tu contraseña debe tener al menos 8 caracteres',
      WEAK: 'Considera usar una contraseña más segura'
    }
  },
  
  // Mensajes de éxito
  SUCCESS: {
    EMAIL_VALID: '¡Email válido!',
    PASSWORD_VALID: '¡Contraseña válida!',
    FORM_VALID: '¡Formulario completo!'
  },
  
  // Mensajes de error generales
  ERROR: {
    NETWORK: 'Error de conexión. Verifica tu internet e intenta nuevamente',
    SERVER: 'Error del servidor. Intenta nuevamente en unos minutos',
    UNKNOWN: 'Algo salió mal. Intenta nuevamente'
  }
};
