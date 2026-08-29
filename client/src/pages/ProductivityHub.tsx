import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { HabitsContainer } from '@/features/Habits/HabitsContainer';
import { FocusSessions } from '@/features/FocusSession';

type TProductivityTab = 'habits' | 'focus';

const validTabs: TProductivityTab[] = ['habits', 'focus'];

export const ProductivityHub = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = useMemo<TProductivityTab>(() => {
        const tab = searchParams.get('tab');
        if (tab && validTabs.includes(tab as TProductivityTab)) {
            return tab as TProductivityTab;
        }

        return 'habits';
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value }, { replace: true });
    };

    return (
        <div className="space-y-4" data-testid="productivity-hub-page">
            <div className="tt-panel p-5 md:p-6">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Productivity Hub</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Central workspace for habit management and focus sessions.
                </p>

                <div className="mt-4">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="h-auto w-full justify-start rounded-xl bg-muted/60 p-1">
                            <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="habits">Habits</TabsTrigger>
                            <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="focus">Focus Sessions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="habits">
                            <HabitsContainer />
                        </TabsContent>

                        <TabsContent value="focus">
                            <FocusSessions />
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </div>
    );
};