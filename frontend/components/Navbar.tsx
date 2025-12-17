'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);

    useEffect(() => {
        const sessionStr = localStorage.getItem('userSession');
        if (sessionStr) {
            try {
                setUser(JSON.parse(sessionStr));
            } catch (e) {
                console.error('Nav session invalid', e);
            }
        }
    }, []);

    const isPenerima = user?.role === 'penerima';

    return (
        <nav className="bg-white border-b border-gray-100 hidden md:block sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/dashboard">
                            <Image
                                src="/f6b78b3278cda1016742221dca3c5b8cdbce72c9.png"
                                alt="Donasiku"
                                width={100}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Center Search (Optional) */}
                    <div className="flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari donasi..."
                                className="w-full bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center space-x-8">
                        <Link href="/dashboard" className="text-gray-600 hover:text-primary font-medium">
                            Beranda
                        </Link>

                        {isPenerima ? (
                            <Link href="/permintaan" className="text-gray-600 hover:text-primary font-medium">
                                Minta Barang
                            </Link>
                        ) : (
                            <Link href="/donasi" className="text-gray-600 hover:text-primary font-medium">
                                Donasi
                            </Link>
                        )}

                        <Link href="/riwayat" className="text-gray-600 hover:text-primary font-medium">
                            Riwayat
                        </Link>

                        {/* Profile Button */}
                        <Link href="/profile" className="flex items-center gap-2 pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                👤
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {user?.username || 'Guest'}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
