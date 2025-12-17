'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string, userId?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [permintaan, setPermintaan] = useState<any[]>([]);
  const [donasiSaya, setDonasiSaya] = useState<any[]>([]);
  const [allPermintaan, setAllPermintaan] = useState<any[]>([]);

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
      
      // Fetch permintaan untuk penerima
      if (userData.role?.toLowerCase() === 'penerima' && userData.userId) {
        fetchPermintaan();
      }
      
      // Fetch data untuk donatur
      if (userData.role?.toLowerCase() === 'donatur' && userData.userId) {
        fetchDonasiSaya(userData.userId);
        fetchAllPermintaan();
      }
    } catch (e) {
      console.error("Invalid session", e);
      // router.push('/auth/login');
      // Fallback for dev if needed
      setUser({ username: 'Zunadea', role: 'donatur' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchPermintaan = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permintaan');
      if (response.ok) {
        const data = await response.json();
        setPermintaan(data);
      }
    } catch (err) {
      console.error('Error fetching permintaan:', err);
    }
  };

  const fetchDonasiSaya = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter donasi yang dibuat oleh user (donatur)
        const userDonasi = data.filter((donasi: any) => donasi.donatur?.userId === userId);
        setDonasiSaya(userDonasi);
      }
    } catch (err) {
      console.error('Error fetching donasi saya:', err);
    }
  };

  const fetchAllPermintaan = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permintaan');
      if (response.ok) {
        const data = await response.json();
        setAllPermintaan(data);
      }
    } catch (err) {
      console.error('Error fetching all permintaan:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const isPenerima = user?.role === 'penerima';
  
  // Redirect admin ke admin dashboard
  if (user?.role === 'admin') {
    router.push('/admin/dashboard');
    return null;
  }

  return (
    <div className="md:container md:mx-auto pb-20">

      {/* HEADER SECTION */}
      <div className="bg-primary text-white pt-8 pb-8 rounded-t-3xl">
        <div className="px-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Selamat Datang,</p>
            <h2 className="text-2xl font-bold text-white">{user?.username || 'User'}!</h2>
            <span className="inline-block mt-1 bg-white/15 px-3 py-1 rounded-full text-xs border border-white/30 backdrop-blur-sm">
              Role: {isPenerima ? 'Penerima Donasi' : 'Donatur'}
            </span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
            {isPenerima ? '🤲' : '👨‍💼'}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 bg-gray-50/50 rounded-b-3xl pt-6 -mx-6">
        {/* Action Card - Donatur & Penerima only */}
        <div className="-mt-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between border border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {isPenerima ? 'Butuh Bantuan?' : 'Siap Berbagi?'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {isPenerima ? 'Ajukan permintaan barang' : 'Donasikan barang layak pakai'}
              </p>
            </div>
            <Link href={isPenerima ? "/permintaan" : "/donasi"} className="bg-primary text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all">
              {isPenerima ? '+ Minta' : '+ Donasi'}
            </Link>
          </div>
        </div>

        {/* PENERIMA VIEW SPECIFIC */}
        {isPenerima && (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">Permintaan Saya</h3>
                <Link href="/riwayat?tab=permintaan" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {/* List Permintaan atau Empty State */}
              {permintaan.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    🗳️
                  </div>
                  <p className="font-medium text-gray-900">Belum ada permintaan aktif</p>
                  <p className="text-sm text-gray-500 mt-2 mb-4">Buat permintaan baru jika Anda membutuhkan bantuan.</p>
                  <Link href="/permintaan" className="text-primary font-semibold border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 inline-block">
                    Buat Permintaan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {permintaan.map((item: any) => (
                    <Link key={item.permintaanId} href={`/permintaan/${item.permintaanId}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.jenisBarang}</h4>
                            <p className="text-xs text-gray-500 mt-1">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.deskripsiKebutuhan}</p>
                            <div className="flex gap-2 mt-3">
                              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                                {item.jumlah}x
                              </span>
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 text-xl">→</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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

            {/* DONASI SAYA SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">📦 Donasi Saya</h3>
                <Link href="/donasi" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {donasiSaya.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    📦
                  </div>
                  <p className="font-medium text-gray-900">Belum ada donasi</p>
                  <p className="text-sm text-gray-500 mt-2 mb-4">Mulai berbagi barang berkualitas untuk membantu sesama.</p>
                  <Link href="/donasi" className="text-primary font-semibold border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 inline-block">
                    Buat Donasi
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiSaya.slice(0, 3).map((item: any) => (
                    <Link key={item.donasiId} href={`/donasi/${item.donasiId}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.kategori || 'Donasi'}</h4>
                            <p className="text-xs text-gray-500 mt-1">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.deskripsi || 'Tidak ada deskripsi'}</p>
                            <div className="flex gap-2 mt-3">
                              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                                {item.statusDonasi?.status || 'Pending'}
                              </span>
                              <span className="inline-block bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                {item.penerima ? '✓ Ada Penerima' : 'Menunggu'}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 text-xl">→</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* PERMINTAAN BARANG SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">🤲 Permintaan Barang</h3>
                <Link href="/permintaan" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {allPermintaan.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    🤲
                  </div>
                  <p className="font-medium text-gray-900">Tidak ada permintaan saat ini</p>
                  <p className="text-sm text-gray-500 mt-2">Cek kembali nanti untuk melihat permintaan dari penerima manfaat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allPermintaan.slice(0, 3).map((item: any) => (
                    <Link key={item.permintaanId} href={`/permintaan/${item.permintaanId}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-500/50 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">{item.jenisBarang}</h4>
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                x{item.jumlah}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">👤 {item.penerima?.username || 'Penerima'}</p>
                            <p className="text-xs text-gray-500">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.deskripsiKebutuhan}</p>
                            <div className="flex gap-2 mt-3">
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                                {item.status || 'Buka'}
                              </span>
                              <span className="inline-block text-green-600 text-xs">
                                📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 text-xl">→</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
