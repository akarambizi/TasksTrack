import React from 'react';

interface CategoryDisplayProps {
    category: {
        id: number;
        name: string;
        color?: string;
        icon?: string;
    };
    size?: 'sm' | 'md';
    className?: string;
}

export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
    category,
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5 text-xs',
        md: 'w-6 h-6 text-xs'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'font-medium'
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium`}
                style={{ backgroundColor: category.color }}
            >
                {category.icon?.charAt(0) || category.name.charAt(0)}
            </div>
            <span className={textSizeClasses[size]}>{category.name}</span>
        </div>
    );
};