import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ISyncEvent, ISyncKpis } from '@/types';

const sheetTabMappings = [
    { source: 'Habit logs', sheetTab: 'Habits', columns: 'Date, habit, value, unit' },
    { source: 'Focus sessions', sheetTab: 'Focus Sessions', columns: 'Start, duration, habit link' }
];

interface ISyncTablesProps {
    telemetry: ISyncKpis;
    eventLog: ISyncEvent[];
}

export const SyncTables = ({ telemetry, eventLog }: ISyncTablesProps) => {
    return (
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
                                        <TableCell className="capitalize">{event.source.replace(/-/g, ' ')}</TableCell>
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
    );
};
