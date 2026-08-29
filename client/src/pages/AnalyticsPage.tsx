import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Statistics } from '@/features/Analytics/Statistics';
import { YearlyRetrospective } from '@/features/Analytics/YearlyRetrospective';
import { ActivityGridContainer } from '@/features/Analytics/ActivityGrid';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type THubTab = 'statistics' | 'activity' | 'retrospective';

const validTabs: THubTab[] = ['statistics', 'activity', 'retrospective'];

export const PerformanceHub = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = useMemo<THubTab>(() => {
        const tab = searchParams.get('tab');
        if (tab && validTabs.includes(tab as THubTab)) {
            return tab as THubTab;
        }

        return 'statistics';
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value }, { replace: true });
    };

    return (
        <div className="space-y-4" data-testid="analytics-hub-page">
            <div className="tt-panel p-5 md:p-6">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Analytics Hub</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    One place for KPI overview, activity, and yearly retrospective.
                </p>
                <div className="mt-4">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="h-auto w-full justify-start rounded-xl bg-muted/60 p-1">
                            <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="statistics">Overview</TabsTrigger>
                                <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="activity">Activity</TabsTrigger>
                            <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="retrospective">Retrospective</TabsTrigger>
                        </TabsList>

                        <TabsContent value="statistics">
                            <Statistics />
                        </TabsContent>
                        <TabsContent value="activity">
                            <ActivityGridContainer showCard={false} />
                        </TabsContent>
                        <TabsContent value="retrospective">
                            <YearlyRetrospective />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};