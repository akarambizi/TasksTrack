import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ITextareaFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    required?: boolean;
    className?: string;
    rows?: number;
    testId?: string;
}

export const TextareaField: React.FC<ITextareaFieldProps> = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    className = "",
    rows = 3,
    testId
}) => {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
                id={id}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                rows={rows}
                data-testid={testId}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};