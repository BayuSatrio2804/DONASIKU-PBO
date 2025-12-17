'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Paths where navigation should be hidden
    // We hide on auth pages, onboard, and potential landing page if needed
    const isPublicPage = pathname.startsWith('/auth') || pathname.startsWith('/onboard');

    if (isPublicPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar />
            <main className="pb-24 md:pb-0 font-sans">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
