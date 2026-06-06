import { useState, useCallback } from 'react';

export type ValidationRule = (value: unknown) => string | null;

export interface ValidationRules {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

export interface FormValidationState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

export interface FormValidationHelpers extends FormValidationState {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleChangeValue: (fieldName: string, value: unknown) => void;
  resetForm: () => void;
  setFieldValue: (fieldName: string, value: unknown) => void;
  setFieldError: (fieldName: string, error: string | null) => void;
  validateField: (fieldName: string) => string | null;
}

export const useFormValidation = (
  initialValues: Record<string, unknown>,
  validationRules: ValidationRules = {}
): FormValidationHelpers => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (fieldName: string): string | null => {
      const fieldRules = validationRules[fieldName];
      if (!fieldRules) return null;

      const fieldValue = values[fieldName];
      const rulesToValidate = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

      for (const rule of rulesToValidate) {
        const error = rule(fieldValue);
        if (error) return error;
      }

      return null;
    },
    [values, validationRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      let parsedValue: unknown = value;
      if (type === 'number') {
        parsedValue = parseFloat(value) || '';
      } else if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
      }

      setValues((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));

      // Validate on change if field has been touched
      if (touched[name]) {
        const error = validateField(name);
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate on blur
      const error = validateField(name);
      setErrors((prev) => ({
        ...prev,
        [name]: error || '',
      }));
    },
    [validateField]
  );

  const handleChangeValue = useCallback(
    (fieldName: string, value: unknown) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      if (touched[fieldName]) {
        const error = validateField(fieldName);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error || '',
        }));
      }
    },
    [touched, validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((fieldName: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error || '',
    }));
  }, []);

  // Validate all fields on initial mount if rules exist
  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleChangeValue,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
  };
};

// Common validation rules
export const validationRules = {
  required: (fieldName = 'This field') => (value: unknown): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: unknown): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(String(value))) {
      return 'Invalid email address';
    }
    return null;
  },

  minLength: (min: number) => (value: unknown): string | null => {
    if (typeof value === 'string' && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max: number) => (value: unknown): string | null => {
    if (typeof value === 'string' && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  minValue: (min: number) => (value: unknown): string | null => {
    if (typeof value === 'number' && value < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },

  maxValue: (max: number) => (value: unknown): string | null => {
    if (typeof value === 'number' && value > max) {
      return `Must be no more than ${max}`;
    }
    return null;
  },

  match: (matchValue: unknown) => (value: unknown): string | null => {
    if (value !== matchValue) {
      return 'Fields do not match';
    }
    return null;
  },
};
