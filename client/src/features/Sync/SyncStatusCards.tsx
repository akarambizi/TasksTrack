import { Card, CardContent, CardHeader, CardTitle, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { ISyncKpis } from '@/types';

interface ISyncStatusCardsProps {
    telemetry: ISyncKpis;
    onModeChange: (mode: ISyncKpis['mode']) => void;
}

export const SyncStatusCards = ({ telemetry, onModeChange }: ISyncStatusCardsProps) => {
    const successProgress = Math.max(0, Math.min(100, Math.round(telemetry.successRate)));

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sync Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Select value={telemetry.mode} onValueChange={(value) => onModeChange(value as ISyncKpis['mode'])}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">manual</SelectItem>
                            <SelectItem value="near-real-time">near-real-time</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">UI simulation only in this phase.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Success Rate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-2xl font-bold">{telemetry.successRate}%</p>
                    <Progress value={successProgress} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Freshness (p95)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{telemetry.freshnessSecondsP95}s</p>
                    <p className="text-xs text-muted-foreground">Target: {'<='} 10s</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Queue Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p>Queued: {telemetry.queuedEvents}</p>
                    <p>Failed: {telemetry.failedEvents}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {new Date(telemetry.lastSyncedAt).toLocaleTimeString()}</p>
                </CardContent>
            </Card>
        </div>
    );
};
