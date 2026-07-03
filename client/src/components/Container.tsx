import { ReactNode } from 'react';
import { SideBarNav, Header } from './';

export const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-background relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsl(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_85%_0%,hsl(var(--warning)/0.08),transparent_32%)]" />
            <SideBarNav />
            <div className="relative flex flex-col md:pl-[296px] lg:pl-[336px]">
                <Header />
                <main className="flex flex-1 flex-col gap-6 p-5 lg:gap-8 lg:p-8">
                    <div className="mx-auto w-full max-w-[1380px] animate-in fade-in-50 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};