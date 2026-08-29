import { syncEvents, syncKpis } from '@/mock-server/data/analytics/growthMetrics';
import { useState } from 'react';
import { SyncReliabilityControls } from '@/features/Sync/SyncReliabilityControls';
import { SyncStatusCards } from '@/features/Sync/SyncStatusCards';
import { SyncTables } from '@/features/Sync/SyncTables';

export const SyncCenter = () => {
    const [telemetry, setTelemetry] = useState(syncKpis);
    const [eventLog, setEventLog] = useState(syncEvents);

    const stampNow = () => new Date().toISOString();

    const retryFailedEvents = () => {
        setTelemetry((current) => ({
            ...current,
            failedEvents: Math.max(0, current.failedEvents - 1),
            queuedEvents: Math.max(0, current.queuedEvents - 1),
            successRate: Math.min(100, Number((current.successRate + 0.4).toFixed(1))),
            freshnessSecondsP95: Math.max(1, Number((current.freshnessSecondsP95 - 0.8).toFixed(1))),
            lastSyncedAt: stampNow()
        }));

        setEventLog((current) => current.map((event) => (
            event.state === 'failed' ? { ...event, state: 'synced', occurredAt: stampNow() } : event
        )));
    };

    const forceResync = () => {
        setTelemetry((current) => ({
            ...current,
            successRate: 100,
            queuedEvents: 0,
            failedEvents: 0,
            freshnessSecondsP95: 2.1,
            lastSyncedAt: stampNow()
        }));

        setEventLog((current) => current.map((event) => ({
            ...event,
            state: 'synced',
            occurredAt: stampNow()
        })));
    };

    return (
        <div className="space-y-6" data-testid="sync-center-page">
            <div className="tt-panel relative overflow-hidden p-6 lg:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-primary/10" />
                <div className="absolute left-0 bottom-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-warning/10" />
                <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight tt-section-title md:text-4xl">Google Sheets Sync Center</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">Mock near real-time sync status, event feed, reliability controls, and destination mapping.</p>
                </div>
            </div>

            <SyncStatusCards
                telemetry={telemetry}
                onModeChange={(mode) => setTelemetry((current) => ({ ...current, mode }))}
            />
            <SyncTables telemetry={telemetry} eventLog={eventLog} />
            <SyncReliabilityControls
                onRetryFailedEvents={retryFailedEvents}
                onForceResync={forceResync}
            />
        </div>
    );
};
