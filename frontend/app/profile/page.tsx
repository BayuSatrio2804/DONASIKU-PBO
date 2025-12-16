'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-3xl shrink-0">
              👨‍💼
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Donatur
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Zunadea Kusmiandita
              </h2>
              <div className="flex items-center gap-1 text-sm text-blue-600 mb-3">
                <span>✓</span>
                <span>Sudah Terverifikasi</span>
              </div>
              <button
                onClick={() => router.push('/detail-akun')}
                className="text-sm font-semibold text-blue-900 px-4 py-1 border border-blue-900 rounded-full hover:bg-blue-50 transition-colors"
              >
                Detail
              </button>
            </div>
          </div>

          {/* Change Role Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 text-blue-900 font-semibold border-t border-gray-200">
            <span>👥</span>
            <span>Cek Ketentuan Role</span>
          </button>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="flex items-center gap-3 font-bold text-gray-900 text-lg mb-4">
            <span>⚙️</span>
            Pengaturan Akun
          </h3>

          {/* Kebijakan dan Ketentuan */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-blue-900">ℹ️</span>
              <span className="font-semibold text-gray-900">Kebijakan dan Ketentuan</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>

          <div className="border-b border-gray-200"></div>

          {/* Pusat Bantuan */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <span className="font-semibold text-gray-900">Pusat Bantuan</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>

          <div className="border-b border-gray-200"></div>

          {/* Versi Aplikasi */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="font-semibold text-gray-900">Versi Aplikasi</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-blue-900 text-white font-bold py-3 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-8">
          <span>→</span>
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-around">
          <Link
            href="/dashboard"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </Link>

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
            onClick={() => setActiveTab('profile')}
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
