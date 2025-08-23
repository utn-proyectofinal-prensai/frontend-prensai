export const USER_MESSAGES = {
  // Títulos y subtítulos
  TITLES: {
    PAGE_TITLE: 'Gestión de Usuarios',
    PAGE_SUBTITLE: 'Administra y controla el acceso de usuarios al sistema de manera eficiente y segura',
    ADD_USER: 'Agregar Usuario',
    EDIT_USER: 'Editar Usuario',
    VIEW_USER: 'Ver Usuario',
    DELETE_USER: 'Eliminar Usuario'
  },

  // Estadísticas
  STATS: {
    TOTAL_USERS: 'Total de Usuarios',
    ADMINISTRATORS: 'Administradores',
    REGULAR_USERS: 'Usuarios Regulares',
    USERS_COUNT: 'usuario(s)'
  },

  // Filtros
  FILTERS: {
    SEARCH_PLACEHOLDER: 'Nombre, usuario o email...',
    ROLE_FILTERS: {
      ALL_ROLES: '🎯 Todos los roles',
      ADMIN: '👑 Administrador',
      USER: '👤 Usuario'
    },
    CLEAR_FILTERS: 'Limpiar',
    ADD_USER_BUTTON: 'Agregar'
  },

  // Acciones
  ACTIONS: {
    VIEW: 'Ver',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar',
    BACK: 'Volver'
  },

  // Mensajes de confirmación
  CONFIRMATIONS: {
    DELETE_USER: '¿Estás seguro de que quieres eliminar este usuario?',
    BULK_DELETE: '¿Estás seguro de que quieres eliminar los usuarios seleccionados?'
  },

  // Mensajes de éxito
  SUCCESS: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente'
  },

  // Mensajes de error
  ERRORS: {
    LOAD_USERS: 'Error al cargar los usuarios',
    CREATE_USER: 'Error al crear el usuario',
    UPDATE_USER: 'Error al actualizar el usuario',
    DELETE_USER: 'Error al eliminar el usuario',
    NO_PERMISSIONS: 'No tienes permisos para realizar esta acción',
    SESSION_EXPIRED: 'Tu sesión ha expirado',
    SERVER_ERROR: 'Error interno del servidor'
  },

  // Estados
  STATES: {
    LOADING: 'Cargando...',
    NO_USERS: 'No hay usuarios disponibles',
    NO_RESULTS: 'No se encontraron resultados',
    SELECTED_USERS: 'usuario(s) seleccionado(s)',
    DESELECT_ALL: 'Deseleccionar todo',
    USERS_COUNT: 'usuario(s)'
  },

  // Formularios
  FORMS: {
    USERNAME: 'Nombre de usuario',
    EMAIL: 'Correo electrónico',
    FIRST_NAME: 'Nombre',
    LAST_NAME: 'Apellido',
    ROLE: 'Rol',
    PASSWORD: 'Contraseña',
    CONFIRM_PASSWORD: 'Confirmar contraseña',
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    PASSWORDS_MATCH: 'Las contraseñas deben coincidir'
  }
} as const;

// Tipos para TypeScript
export type UserMessageKey = keyof typeof USER_MESSAGES;
export type UserMessageValue = typeof USER_MESSAGES[UserMessageKey];
