'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DonationItem {
  id: number;
  title: string;
  category: string;
  image: string;
  location: string;
  isBadged?: boolean;
}

const donationItems: DonationItem[] = [
  {
    id: 1,
    title: 'Baju Pria Dewasa',
    category: 'Baju',
    image: '/donation-1.jpg',
    location: 'Bojongsoang',
  },
  {
    id: 2,
    title: 'Sepatu Anak',
    category: 'Sepatu',
    image: '/donation-2.jpg',
    location: 'Bojongsoang',
  },
  {
    id: 3,
    title: 'Tas Sekolah Anak',
    category: 'Tas',
    image: '/donation-3.jpg',
    location: 'Bojongsoang',
  },
  {
    id: 4,
    title: 'Celana Pria',
    category: 'Celana',
    image: '/donation-4.jpg',
    location: 'Bojongsoang',
    isBadged: true,
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Header - Blue */}
      <div className="bg-blue-900 text-white pt-6 pb-12 relative">
        <div className="px-4 flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Halo Zunadea!</h2>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
            👨‍💼
          </div>
        </div>
        <div className="px-4">
          <p className="text-sm opacity-90">Donasi Apa Hari Ini ?</p>
        </div>

        {/* Donation Card */}
        <div className="absolute top-36 left-4 right-4 bg-white text-gray-900 rounded-3xl p-5 shadow-lg">
          <h3 className="text-lg font-bold mb-1">Donasi Sekarang</h3>
          <p className="text-sm text-gray-600 mb-4">Donasi untuk melanjutkan</p>
          <button className="bg-blue-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800 transition-colors">
            Donasi
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-40">
        {/* Salurkan Donasi Button */}
        <button className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between mb-8 hover:border-blue-900 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <span className="font-semibold text-gray-900">Salurkan Donasi Melalui</span>
          </div>
          <span className="text-gray-400">&gt;</span>
        </button>

        {/* Disekitar Mu Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Disekitar mu</h3>
            <Link href="#" className="text-blue-500 text-sm font-semibold">
              Lihat Semua
            </Link>
          </div>

          {/* Donations Grid */}
          <div className="grid grid-cols-2 gap-4">
            {donationItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow"
              >
                <div className="relative w-full h-40 bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.isBadged && (
                    <div className="absolute bottom-2 right-2 bg-blue-900 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>📍</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('donate')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'donate'
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">❤️</span>
            <span className="text-xs font-semibold">Donasi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('riwayat');
              router.push('/riwayat');
            }}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'riwayat'
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">⏱️</span>
            <span className="text-xs font-semibold">Riwayat</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              router.push('/profile');
            }}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
