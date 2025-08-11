// Traducciones en español
// Este archivo contiene todas las traducciones para el idioma español

export const esTranslations = {
  auth: {
    validation: {
      emailRequired: 'El email es requerido',
      emailInvalidFormat: 'El formato del email no es válido',
      emailTooLong: 'El email es demasiado largo',
      passwordRequired: 'La contraseña es requerida',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      passwordTooLong: 'La contraseña es demasiado larga',
      credentialsInvalid: 'Credenciales inválidas. Inténtalo de nuevo.',
      authenticationError: 'Error de autenticación',
      sessionExpired: 'Sesión expirada'
    },
    status: {
      loginSuccess: 'Inicio de sesión exitoso',
      logoutSuccess: 'Cierre de sesión exitoso',
      loginError: 'Error al iniciar sesión',
      logoutError: 'Error al cerrar sesión'
    }
  },
  
  dashboard: {
    errors: {
      loadDataError: 'Error al cargar los datos del dashboard',
      generalError: 'Error al cargar los datos'
    },
    success: {
      dataLoaded: 'Datos cargados correctamente'
    }
  },
  
  admin: {
    errors: {
      invalidCredentials: 'Credenciales de administrador incorrectas',
      accessDenied: 'Acceso denegado'
    },
    success: {
      loginSuccess: 'Acceso de administrador concedido'
    }
  },
  
  upload: {
    errors: {
      urlAlreadyExists: 'Esta URL ya ha sido agregada',
      invalidUrl: 'URL inválida',
      invalidFileType: 'Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV'
    },
    success: {
      uploadSuccess: 'Archivo subido correctamente'
    }
  },
  
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha sido movida.',
    contactAdmin: 'Si crees que esto es un error, contacta al administrador del sistema.',
    goHome: 'Ir al inicio'
  },
  
  api: {
    errors: {
      httpError: 'HTTP error! status:',
      requestError: 'Error en API request:',
      importError: 'Error importando noticias:',
      loginError: 'Error en login:',
      logoutError: 'Error en logout:'
    }
  },
  
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    refresh: 'Actualizar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar',
    reset: 'Restablecer',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    ok: 'OK'
  }
} as const;

export type SpanishTranslations = typeof esTranslations;
