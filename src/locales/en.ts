// Traducciones en inglés
// Este archivo contiene todas las traducciones para el idioma inglés

export const enTranslations = {
  auth: {
    validation: {
      emailRequired: 'Email is required',
      emailInvalidFormat: 'Email format is not valid',
      emailTooLong: 'Email is too long',
      passwordRequired: 'Password is required',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordTooLong: 'Password is too long',
      credentialsInvalid: 'Invalid credentials. Please try again.',
      authenticationError: 'Authentication error',
      sessionExpired: 'Session expired'
    },
    status: {
      loginSuccess: 'Login successful',
      logoutSuccess: 'Logout successful',
      loginError: 'Login error',
      logoutError: 'Logout error'
    }
  },
  
  dashboard: {
    errors: {
      loadDataError: 'Error loading dashboard data',
      generalError: 'Error loading data'
    },
    success: {
      dataLoaded: 'Data loaded successfully'
    }
  },
  
  admin: {
    errors: {
      invalidCredentials: 'Invalid administrator credentials',
      accessDenied: 'Access denied'
    },
    success: {
      loginSuccess: 'Administrator access granted'
    }
  },
  
  upload: {
    errors: {
      urlAlreadyExists: 'This URL has already been added',
      invalidUrl: 'Invalid URL',
      invalidFileType: 'Please select an Excel file (.xlsx, .xls) or CSV'
    },
    success: {
      uploadSuccess: 'File uploaded successfully'
    }
  },
  
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    contactAdmin: 'If you think this is an error, contact the system administrator.',
    goHome: 'Go home'
  },
  
  api: {
    errors: {
      httpError: 'HTTP error! status:',
      requestError: 'API request error:',
      importError: 'Error importing news:',
      loginError: 'Login error:',
      logoutError: 'Logout error:'
    }
  },
  
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK'
  }
} as const;

export type EnglishTranslations = typeof enTranslations;
