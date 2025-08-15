export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
