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
