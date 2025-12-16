'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DetailAkunPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
        <h1 className="text-xl font-bold text-gray-900">Detail Akun</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Informasi Akun Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun</h2>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center text-3xl shrink-0">
                👨‍💼
              </div>

              {/* Change Photo Button */}
              <div className="flex-1 flex flex-col gap-2">
                <button className="px-4 py-2 border-2 border-blue-900 text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-colors w-fit">
                  Ganti Foto
                </button>
                <p className="text-xs text-gray-500">Ukuran foto maksimal 5mb.</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              {/* Nama Akun */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Akun</p>
                <p className="font-semibold text-gray-900">Zunadea Kusmiandita</p>
              </div>

              {/* Role Akun */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Role Akun</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Donatur</span>
                  <span className="text-blue-600">✓ Sudah Verifikasi</span>
                </div>
              </div>

              {/* No Handphone */}
              <div>
                <p className="text-sm text-gray-600 mb-1">No Handphone</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">+6285*****56</p>
                  <span className="text-gray-400">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Lainnya Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Lainnya</h2>
          
          <button className="w-full bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center text-2xl shrink-0">
                👨‍💼
              </div>

              <div className="text-left">
                <p className="font-semibold text-gray-900">Informasi Pribadi</p>
                <p className="text-sm text-gray-600">Sudah Lengkap</p>
              </div>
            </div>
            <span className="text-gray-400 text-2xl">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
