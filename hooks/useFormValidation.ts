import { useState } from "react";
import { ValidationError } from "@/utils/validation";

interface FormErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const setValidationErrors = (validationErrors: ValidationError[]) => {
    const errorMap: FormErrors = {};
    validationErrors.forEach((error) => {
      errorMap[error.field] = error.message;
    });
    setErrors(errorMap);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field];
  };

  return {
    errors,
    setValidationErrors,
    clearErrors,
    clearFieldError,
    getFieldError,
  };
}
