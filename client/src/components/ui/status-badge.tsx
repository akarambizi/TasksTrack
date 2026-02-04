import { Badge } from '@/components/ui/badge';

interface IStatusBadgeProps {
    status: string | number;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}

const statusVariants = {
    Active: 'default',
    'In Progress': 'default',
    Paused: 'secondary',
    Completed: 'default',
    Cancelled: 'destructive',
    Stopped: 'destructive'
} as const;

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ 
    status, 
    variant, 
    size = 'default' 
}) => {
    const statusString = typeof status === 'number' 
        ? getStatusLabel(status) 
        : status;
    
    const badgeVariant = variant || statusVariants[statusString as keyof typeof statusVariants] || 'outline';
    
    return (
        <Badge variant={badgeVariant} className={size === 'sm' ? 'text-xs' : ''}>
            {statusString}
        </Badge>
    );
};

// Helper function to convert numeric status to string label
function getStatusLabel(statusNumber: number): string {
    const statusMap = {
        0: 'Active',
        1: 'In Progress', 
        2: 'Paused',
        3: 'Completed',
        4: 'Cancelled',
        5: 'Stopped'
    } as const;
    
    return statusMap[statusNumber as keyof typeof statusMap] || 'Unknown';
}