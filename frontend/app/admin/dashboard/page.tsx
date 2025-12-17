'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerifikasiCount, setPendingVerifikasiCount] = useState(0);

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionStr);
      // Protect: only admin can access
      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(userData);
      fetchPendingCount();
    } catch (e) {
      console.error("Invalid session", e);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/verifikasi/admin/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingVerifikasiCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Failed to fetch pending count', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="md:container md:mx-auto pb-20">

      {/* HEADER SECTION */}
      <div className="bg-primary text-white pt-8 pb-8 rounded-3xl">
        <div className="px-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Selamat Datang,</p>
            <h2 className="text-2xl font-bold text-white">{user?.username || 'User'}!</h2>
            <span className="inline-block mt-1 bg-white/15 px-3 py-1 rounded-full text-xs border border-white/30 backdrop-blur-sm">
              Role: Administrator
            </span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
            👑
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 bg-gray-50/50 pt-6 -mx-6">
        {/* Overview Cards */}
        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Ringkasan Sistem</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
              <h4 className="text-primary font-bold text-2xl mb-1">0</h4>
              <p className="text-primary/70 text-xs font-medium">Total Donasi</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-2xl border border-primary/30">
              <h4 className="text-primary font-bold text-2xl mb-1">0</h4>
              <p className="text-primary/70 text-xs font-medium">Total Donatur</p>
            </div>
            <div className="bg-primary/15 p-4 rounded-2xl border border-primary/40">
              <h4 className="text-primary font-bold text-2xl mb-1">0</h4>
              <p className="text-primary/70 text-xs font-medium">Total Penerima</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <h4 className="text-red-900 font-bold text-2xl mb-1">{pendingVerifikasiCount}</h4>
              <p className="text-red-700 text-xs font-medium">Menunggu Verifikasi</p>
            </div>
          </div>
        </section>

        {/* Management Sections */}
        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Kelola Sistem</h3>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/admin/verifikasi')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                  ✓
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Verifikasi Penerima</h4>
                  <p className="text-xs text-gray-500">
                    {pendingVerifikasiCount > 0 
                      ? `${pendingVerifikasiCount} dokumen menunggu verifikasi`
                      : 'Semua dokumen terverifikasi'
                    }
                  </p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
            </button>

            <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                  📋
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Kelola Donasi</h4>
                  <p className="text-xs text-gray-500">Monitor semua data donasi</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
            </button>

            <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                  👥
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Kelola Pengguna</h4>
                  <p className="text-xs text-gray-500">Atur data donatur dan penerima</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
            </button>

            <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                  📊
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Laporan & Analitik</h4>
                  <p className="text-xs text-gray-500">Lihat statistik dan laporan sistem</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
            </button>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Aktivitas Terbaru</h3>
            <Link href="#" className="text-primary text-sm font-semibold">Lihat Semua</Link>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
          </div>
        </section>
      </div>
    </div>
  );
}
