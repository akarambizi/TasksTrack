import React from 'react';

interface ILoadingSkeletonProps {
    className?: string;
}

export const LoadingSkeleton: React.FC<ILoadingSkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`flex-1 overflow-auto p-6 ${className}`}>
            <div className="animate-pulse space-y-6">
                {/* Header skeleton */}
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>

                {/* Stats grid skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        </div>
    );
};

interface ICardSkeletonProps {
    count?: number;
    height?: string;
    className?: string;
}

export const CardSkeleton: React.FC<ICardSkeletonProps> = ({
    count = 1,
    height = 'h-24',
    className = ''
}) => {
    return (
        <div className={`grid gap-4 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className={`${height} bg-slate-200 dark:bg-slate-700 rounded animate-pulse`}></div>
            ))}
        </div>
    );
};

interface IListSkeletonProps {
    count?: number;
    showAvatar?: boolean;
    className?: string;
}

export const ListSkeleton: React.FC<IListSkeletonProps> = ({
    count = 3,
    showAvatar = false,
    className = ''
}) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                    {showAvatar && (
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    )}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};