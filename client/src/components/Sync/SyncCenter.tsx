import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { syncEvents, syncKpis } from '@/mock-server/data/analytics/growthMetrics';
import { RefreshCcw, Sheet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SyncCenter = () => {
    const successProgress = Math.max(0, Math.min(100, Math.round(syncKpis.successRate)));

    return (
        <div className="space-y-6" data-testid="sync-center-page">
            <div className="tt-panel relative overflow-hidden p-6 lg:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-primary/10" />
                <div className="absolute left-0 bottom-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-warning/10" />
                <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight tt-section-title md:text-4xl">Google Sheets Sync Center</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">Mock near real-time sync status, event feed, and reliability controls.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Sync Mode</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Select defaultValue={syncKpis.mode}>
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
                        <p className="text-2xl font-bold">{syncKpis.successRate}%</p>
                        <Progress value={successProgress} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Freshness (p95)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{syncKpis.freshnessSecondsP95}s</p>
                        <p className="text-xs text-muted-foreground">Target: {'<='} 10s</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Queue Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p>Queued: {syncKpis.queuedEvents}</p>
                        <p>Failed: {syncKpis.failedEvents}</p>
                        <p className="text-xs text-muted-foreground">Last sync: {new Date(syncKpis.lastSyncedAt).toLocaleTimeString()}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sync Tables</CardTitle>
                    <CardDescription>
                        Detailed tabular logs for event-level tracking and KPI auditing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                    {syncEvents.map((event) => (
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
                                        <TableCell>{syncKpis.successRate}%</TableCell>
                                        <TableCell>{'>='} 99%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Freshness (p95)</TableCell>
                                        <TableCell>{syncKpis.freshnessSecondsP95}s</TableCell>
                                        <TableCell>{'<='} 10s</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Queued Events</TableCell>
                                        <TableCell>{syncKpis.queuedEvents}</TableCell>
                                        <TableCell>0</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Failed Events</TableCell>
                                        <TableCell>{syncKpis.failedEvents}</TableCell>
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
                    <Button className="gap-2">
                        <RefreshCcw size={15} />
                        Retry Failed (Mock)
                    </Button>
                    <Button variant="outline" className="gap-2">
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
