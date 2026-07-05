import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { syncEvents, syncKpis } from '@/mock-server/data/analytics/growthMetrics';
import { useState } from 'react';
import { RefreshCcw, Sheet, AlertTriangle, CheckCircle2 } from 'lucide-react';

const sheetTabMappings = [
    { source: 'Habit logs', sheetTab: 'Habits', columns: 'Date, habit, value, unit' },
    { source: 'Focus sessions', sheetTab: 'Focus Sessions', columns: 'Start, duration, habit link' },
    { source: 'Goals', sheetTab: 'Goals', columns: 'Cadence, target, progress, status' },
    { source: 'Weekly reviews', sheetTab: 'Weekly Reviews', columns: 'Step, completion, confidence' }
];

export const SyncCenter = () => {
    const [telemetry, setTelemetry] = useState(syncKpis);
    const [eventLog, setEventLog] = useState(syncEvents);

    const successProgress = Math.max(0, Math.min(100, Math.round(telemetry.successRate)));

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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Sync Mode</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Select value={telemetry.mode} onValueChange={(value) => setTelemetry({ ...telemetry, mode: value as 'manual' | 'near-real-time' })}>
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

            <Card>
                <CardHeader>
                    <CardTitle>Sync Tables</CardTitle>
                    <CardDescription>
                        Detailed tabular logs for event-level tracking, KPI auditing, and destination planning.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Sheets Tab Mapping Preview</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Sheet Tab</TableHead>
                                        <TableHead>Preview Columns</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sheetTabMappings.map((mapping) => (
                                        <TableRow key={mapping.source}>
                                            <TableCell className="font-medium">{mapping.source}</TableCell>
                                            <TableCell>{mapping.sheetTab}</TableCell>
                                            <TableCell className="text-muted-foreground">{mapping.columns}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Event Log Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Event ID</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Occurred At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {eventLog.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">{event.id}</TableCell>
                                            <TableCell className="capitalize">{event.source.replace('-', ' ')}</TableCell>
                                            <TableCell className="capitalize">{event.state}</TableCell>
                                            <TableCell>{new Date(event.occurredAt).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">KPI Audit Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Metric</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Target</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Success Rate</TableCell>
                                        <TableCell>{telemetry.successRate}%</TableCell>
                                        <TableCell>{'>='} 99%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Freshness (p95)</TableCell>
                                        <TableCell>{telemetry.freshnessSecondsP95}s</TableCell>
                                        <TableCell>{'<='} 10s</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Queued Events</TableCell>
                                        <TableCell>{telemetry.queuedEvents}</TableCell>
                                        <TableCell>0</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Failed Events</TableCell>
                                        <TableCell>{telemetry.failedEvents}</TableCell>
                                        <TableCell>0</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sheet size={18} />
                        Reliability Controls
                    </CardTitle>
                    <CardDescription>Frontend mock actions for replay/retry workflows.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button className="gap-2" onClick={retryFailedEvents}>
                        <RefreshCcw size={15} />
                        Retry Failed (Mock)
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={forceResync}>
                        <CheckCircle2 size={15} />
                        Force Full Resync (Mock)
                    </Button>
                    <Button variant="ghost" className="gap-2">
                        <AlertTriangle size={15} />
                        Download Error Log (Mock)
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
