import { WeeklyReviewWizard } from './WeeklyReviewWizard';

export const WeeklyReview = () => {
    return (
        <div className="space-y-6" data-testid="weekly-review-page">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Weekly Review</h1>
                <p className="text-muted-foreground">
                    Run your structured weekly reflection and keep state saved between sessions.
                </p>
            </div>
            <WeeklyReviewWizard />
        </div>
    );
};
