import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { CheckCircle2, RefreshCcw, Sheet } from 'lucide-react';

interface ISyncReliabilityControlsProps {
    onRetryFailedEvents: () => void;
    onForceResync: () => void;
}

export const SyncReliabilityControls = ({
    onRetryFailedEvents,
    onForceResync
}: ISyncReliabilityControlsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sheet size={18} />
                    Reliability Controls
                </CardTitle>
                <CardDescription>Frontend mock actions for replay and retry workflows.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
                <Button className="gap-2" onClick={onRetryFailedEvents}>
                    <RefreshCcw size={15} />
                    Retry Failed (Mock)
                </Button>
                <Button variant="outline" className="gap-2" onClick={onForceResync}>
                    <CheckCircle2 size={15} />
                    Force Full Resync (Mock)
                </Button>
            </CardContent>
        </Card>
    );
};
