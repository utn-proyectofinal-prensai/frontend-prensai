import type { LoginFormData, ValidationResult } from '../types/auth';
import { AUTH_MESSAGES } from '../constants/messages';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return AUTH_MESSAGES.VALIDATION.EMAIL_INVALID_FORMAT;
  }
  
  if (email.length > 254) {
    return AUTH_MESSAGES.VALIDATION.EMAIL_TOO_LONG;
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED;
  }
  
  if (password.length < 6) {
    return AUTH_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT;
  }
  
  if (password.length > 128) {
    return AUTH_MESSAGES.VALIDATION.PASSWORD_TOO_LONG;
  }
  
  return null;
};

export const validateLoginForm = (formData: LoginFormData): ValidationResult => {
  const errors: string[] = [];
  
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.push(emailError);
  }
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.push(passwordError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
