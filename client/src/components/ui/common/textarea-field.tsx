import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ITextareaFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<React.ComponentProps<'textarea'>, 'name'> {
    name: TName;
    control: Control<TFieldValues>;
    label: string;
    testId?: string;
    description?: string;
}

export function TextareaField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    name,
    control,
    label,
    required = false,
    className = "",
    testId,
    description,
    ...textareaProps
}: ITextareaFieldProps<TFieldValues, TName>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={`grid gap-2 ${className}`}>
                    <Label htmlFor={field.name}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Textarea
                        {...field}
                        id={field.name}
                        required={required}
                        data-testid={testId}
                        aria-invalid={fieldState.invalid}
                        {...textareaProps}
                    />
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}