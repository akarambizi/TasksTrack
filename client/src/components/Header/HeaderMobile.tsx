import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, LineChart, Menu, Package, Package2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeaderMobile = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Tasks Tracker</span>
                    </Link>
                    <Link to="/dashboard" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link to="/tasks" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <Package className="h-5 w-5" />
                        Tasks
                    </Link>
                    <Link to="/analytics" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                        <LineChart className="h-5 w-5" />
                        Analytics
                    </Link>
                </nav>
                <div className="mt-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" className="w-full">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    );
};
