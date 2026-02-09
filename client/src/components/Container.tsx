import { ReactNode } from 'react';
import { SideBarNav, Header } from './';

export const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            <SideBarNav />
            <div className="flex flex-col">
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