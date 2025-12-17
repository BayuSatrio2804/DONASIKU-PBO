'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [role, setRole] = useState('donatur');

    useEffect(() => {
        const sessionStr = localStorage.getItem('userSession');
        if (sessionStr) {
            try {
                const userData = JSON.parse(sessionStr);
                setRole(userData.role || 'donatur');
            } catch (e) {
                console.error('Nav session invalid', e);
            }
        }
    }, []);

    const isPenerima = role === 'penerima';

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: '🏠' },
        // If Penerima, show 'Minta' which links to /permintaan
        // If Donatur, show 'Donasi' which links to /donasi
        // Actually, let's point both to a central place or keep them separate.
        isPenerima
            ? { name: 'Minta', path: '/permintaan', icon: '📦' }
            : { name: 'Donasi', path: '/donasi', icon: '❤️' },

        { name: 'Riwayat', path: '/riwayat', icon: '⏱️' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe md:hidden">
            <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive
                                ? 'text-primary font-semibold'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-[10px] sm:text-xs">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
