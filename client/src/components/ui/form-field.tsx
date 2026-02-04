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
    labelAction
}) => {
    return (
        <div className={`grid gap-2 ${className}`}>
            <div className="flex items-center">
                <Label htmlFor={id}>{label}</Label>
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
            />
            {error && (
                <p className="text-red-500 text-sm" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};