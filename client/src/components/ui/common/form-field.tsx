import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IFormFieldProps {
    id: string;
    name: string;
    type?: string;
    label: string;
    placeholder?: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    className?: string;
    labelAction?: React.ReactNode;
    testId?: string;
    min?: string;
    max?: string;
    step?: string;
}

export const FormField: React.FC<IFormFieldProps> = ({
    id,
    name,
    type = "text",
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    className = "",
    labelAction,
    testId,
    min,
    max,
    step
}) => {
    return (
        <div className={`grid gap-2 ${className}`}>
            <div className="flex items-center">
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {labelAction}
            </div>
            <Input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                required={required}
                data-testid={testId}
                min={min}
                max={max}
                step={step}
            />
            {error && (
                <p className="text-red-500 text-sm" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};