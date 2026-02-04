/**
 * Form validation utilities following established project patterns
 */

export interface IValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    custom?: (value: string) => string | null;
}

export interface IValidationErrors {
    [key: string]: string;
}

/**
 * Validates email format
 * @param email Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object with validation result and feedback
 */
export const validatePassword = (password: string): { isValid: boolean; feedback: string[] } => {
    const feedback: string[] = [];
    
    if (password.length < 8) {
        feedback.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
        feedback.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        feedback.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
        feedback.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
        feedback.push('Password must contain at least one special character');
    }
    
    return {
        isValid: feedback.length === 0,
        feedback
    };
};

/**
 * Validates form field based on rules
 * @param value Field value
 * @param rules Validation rules
 * @param fieldName Field name for error messages
 * @returns Error message or null if valid
 */
export const validateField = (
    value: string,
    rules: IValidationRule,
    fieldName: string = 'Field'
): string | null => {
    const trimmedValue = value.trim();
    
    // Required check
    if (rules.required && !trimmedValue) {
        return `${fieldName} is required`;
    }
    
    // If empty and not required, skip other validations
    if (!trimmedValue && !rules.required) {
        return null;
    }
    
    // Length checks
    if (rules.minLength && trimmedValue.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
        return `${fieldName} must not exceed ${rules.maxLength} characters`;
    }
    
    // Email validation
    if (rules.email && !isValidEmail(trimmedValue)) {
        return `${fieldName} must be a valid email address`;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
        return `${fieldName} format is invalid`;
    }
    
    // Custom validation
    if (rules.custom) {
        const customError = rules.custom(trimmedValue);
        if (customError) {
            return customError;
        }
    }
    
    return null;
};

/**
 * Validates entire form based on rules
 * @param formData Form data object
 * @param validationRules Rules for each field
 * @returns Object with field errors
 */
export const validateForm = <T extends Record<string, string>>(
    formData: T,
    validationRules: Partial<Record<keyof T, IValidationRule>>
): IValidationErrors => {
    const errors: IValidationErrors = {};
    
    for (const [fieldName, value] of Object.entries(formData)) {
        const rules = validationRules[fieldName as keyof T];
        if (rules) {
            const error = validateField(value, rules, fieldName);
            if (error) {
                errors[fieldName] = error;
            }
        }
    }
    
    return errors;
};

/**
 * Debounces validation to avoid excessive validation calls
 * @param validationFn Validation function to debounce
 * @param delay Delay in milliseconds (default: 300)
 * @returns Debounced validation function
 */
export const debounceValidation = <T extends unknown[]>(
    validationFn: (...args: T) => void,
    delay: number = 300
): ((...args: T) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: T) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => validationFn(...args), delay);
    };
};

/**
 * Common validation rules for reuse across forms
 */
export const ValidationRules = {
    email: {
        required: true,
        email: true,
        maxLength: 254
    } as IValidationRule,
    
    password: {
        required: true,
        minLength: 8,
        maxLength: 128
    } as IValidationRule,
    
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/
    } as IValidationRule,
    
    habitName: {
        required: true,
        minLength: 1,
        maxLength: 100
    } as IValidationRule,
    
    description: {
        maxLength: 500
    } as IValidationRule
} as const;