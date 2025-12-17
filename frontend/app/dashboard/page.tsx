'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionStr);
      setUser(userData);
    } catch (e) {
      console.error("Invalid session", e);
      // router.push('/auth/login');
      // Fallback for dev if needed
      setUser({ username: 'Zunadea', role: 'donatur' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const isPenerima = user?.role === 'penerima';

  return (
    <div className="md:container md:mx-auto pb-20">

      {/* HEADER SECTION */}
      <div className={`${isPenerima ? 'bg-orange-600' : 'bg-primary'} text - white pt - 8 pb - 16 relative rounded - b - [2.5rem] md: rounded - b - none`}>
        <div className="px-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Selamat Datang,</p>
            <h2 className="text-2xl font-bold text-white">{user?.username || 'User'}!</h2>
            <span className="inline-block mt-1 bg-white/20 px-3 py-1 rounded-full text-xs border border-white/30 backdrop-blur-sm">
              Role: {isPenerima ? 'Penerima Donasi' : 'Donatur'}
            </span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
            {isPenerima ? '🤲' : '👨‍💼'}
          </div>
        </div>

        {/* Action Card Overlap */}
        <div className="absolute -bottom-16 left-6 right-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {isPenerima ? 'Butuh Bantuan?' : 'Siap Berbagi?'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {isPenerima ? 'Ajukan permintaan barang' : 'Donasikan barang layak pakai'}
              </p>
            </div>
            {isPenerima ? (
              <Link href="/permintaan" className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                + Minta
              </Link>
            ) : (
              <Link href="/donasi" className="bg-primary text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all">
                + Donasi
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-24 px-6 space-y-8">

        {/* PENERIMA VIEW SPECIFIC */}
        {isPenerima && (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">Permintaan Saya</h3>
                <Link href="/riwayat?tab=permintaan" className="text-orange-600 text-sm font-semibold">Lihat Semua</Link>
              </div>
              {/* Empty State / Mock List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  🗳️
                </div>
                <p className="font-medium text-gray-900">Belum ada permintaan aktif</p>
                <p className="text-sm text-gray-500 mt-2 mb-4">Buat permintaan baru jika Anda membutuhkan bantuan.</p>
                <Link href="/permintaan" className="text-orange-600 font-semibold border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 inline-block">
                  Buat Permintaan
                </Link>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-xl text-gray-800 mb-4">Status Terkini</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-900 font-bold text-2xl mb-1">0</h4>
                  <p className="text-blue-700 text-sm">Menunggu Verifikasi</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <h4 className="text-green-900 font-bold text-2xl mb-1">0</h4>
                  <p className="text-green-700 text-sm">Barang Diterima</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* DONATUR VIEW SPECIFIC */}
        {!isPenerima && (
          <div className="space-y-6">
            <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Salurkan Bantuan</h4>
                  <p className="text-xs text-gray-500">Lihat permintaan dari yang membutuhkan</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
            </button>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">Disekitar Anda</h3>
                <Link href="/donasi" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="h-32 bg-gray-200 relative">
                      {/* Placeholder Image */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl">📦</div>
                    </div>
                    <div className="p-3">
                      <h5 className="font-bold text-gray-900 text-sm truncate">Bantuan #12{i}</h5>
                      <p className="text-xs text-gray-500">📍 Bandung</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
