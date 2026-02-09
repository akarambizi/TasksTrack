import { ReactNode } from 'react';
import { SideBarNav, Header } from './';

export const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-background">
            <SideBarNav />
            <div className="flex flex-col md:pl-[280px] lg:pl-[320px]">
                <Header />
                <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 bg-muted/30">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};