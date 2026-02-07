import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IFormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<InputProps, 'name'> {
    name: TName;
    control: Control<TFieldValues>;
    label: string;
    labelAction?: React.ReactNode;
    testId?: string;
    description?: string;
}

export function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    name,
    control,
    label,
    required = false,
    className = "",
    labelAction,
    testId,
    description,
    ...inputProps
}: IFormFieldProps<TFieldValues, TName>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={`grid gap-2 ${className}`}>
                    <div className="flex items-center">
                        <Label htmlFor={field.name}>
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {labelAction}
                    </div>
                    <Input
                        {...field}
                        id={field.name}
                        required={required}
                        data-testid={testId}
                        aria-invalid={fieldState.invalid}
                        {...inputProps}
                    />
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {fieldState.error && (
                        <p className="text-red-500 text-sm" role="alert">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}