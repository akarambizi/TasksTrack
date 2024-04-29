import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const HabitsCard = () => {
    return (
        <Card className="overflow-hidden" data-testid="habits-card">
            <CardHeader className='p-1'>
                <div className="grid gap-2" >
                    <img
                        alt="Product img"
                        className="aspect-square w-full rounded-md object-cover"
                        height="100"
                        src="https://www.pictoclub.com/wp-content/uploads/2021/09/painting-brushes-scaled.jpg"
                        width="100"
                    />
                </div>
            </CardHeader>
            <CardContent className='p-1'>
                <CardTitle className="text-sm mb-1">Observing</CardTitle>
                <CardDescription className="text-sm">07:00 - 07:30</CardDescription>
            </CardContent>
        </Card>
    );
};
