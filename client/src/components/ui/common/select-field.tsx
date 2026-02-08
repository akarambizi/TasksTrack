
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ISelectOption {
    value: string;
    label: string;
    preview?: string; // Optional preview property for color options
}

interface ISelectFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    name: TName;
    control: Control<TFieldValues>;
    label: string;
    placeholder?: string;
    options: ISelectOption[];
    required?: boolean;
    className?: string;
    testId?: string;
    description?: string;
    valueType: 'string' | 'number';
}

export function SelectField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    name,
    control,
    label,
    placeholder,
    options,
    required = false,
    className = "",
    testId,
    description,
    valueType
}: ISelectFieldProps<TFieldValues, TName>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={cn("grid gap-2", className)}>
                    <Label htmlFor={field.name}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Select
                        value={field.value?.toString() || ''}
                        onValueChange={(value) => {
                            // Handle type conversion based on valueType prop
                            if (valueType === 'number') {
                                const numValue = value === '' ? undefined : Number(value);
                                field.onChange(numValue);
                            } else {
                                field.onChange(value);
                            }
                        }}
                        data-testid={testId}
                    >
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1" role="alert">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}