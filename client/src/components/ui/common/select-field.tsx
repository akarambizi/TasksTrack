import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ISelectOption {
    value: string;
    label: string;
}

interface ISelectFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    value: string | undefined;
    onValueChange: (value: string) => void;
    options: ISelectOption[];
    error?: string;
    required?: boolean;
    className?: string;
    testId?: string;
}

export const SelectField: React.FC<ISelectFieldProps> = ({
    id,
    label,
    placeholder,
    value,
    onValueChange,
    options,
    error,
    required = false,
    className = "",
    testId
}) => {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={onValueChange} data-testid={testId}>
                <SelectTrigger id={id}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};