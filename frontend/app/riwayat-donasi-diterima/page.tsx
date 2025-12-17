'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RiwayatDonasiDiterimaPage() {
  const router = useRouter();
  const [donasi, setDonasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('semua');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth - must be penerima
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(sessionStr);
    if (userData.role?.toLowerCase() !== 'penerima') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    fetchDonasi(userData.userId);
  }, [router]);

  const fetchDonasi = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter donasi yang diterima oleh user
        const donasiDiterima = data.filter((item: any) =>
          item.penerima?.userId === userId
        );
        setDonasi(donasiDiterima);
      } else {
        setError('Gagal mengambil data donasi');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['semua', 'pending', 'dikonfirmasi', 'diterima'];

  const filteredDonasi = filter === 'semua'
    ? donasi
    : donasi.filter((item) =>
        item.statusDonasi?.status?.toLowerCase().includes(filter.toLowerCase())
      );

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'diterima':
        return <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">✓ Diterima</span>;
      case 'dikonfirmasi':
        return <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">✓ Dikonfirmasi</span>;
      case 'pending':
      default:
        return <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">⏳ Perlu Konfirmasi</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white pt-6 pb-8 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ← Kembali
          </button>
          <h1 className="text-xl font-bold">Riwayat Donasi Diterima</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Memuat riwayat donasi...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Filter Status</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition ${
                      filter === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'semua' ? 'Semua' : status === 'dikonfirmasi' ? 'Dikonfirmasi' : status === 'diterima' ? 'Diterima' : 'Perlu Konfirmasi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600">
              Menampilkan {filteredDonasi.length} donasi
            </div>

            {filteredDonasi.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  📦
                </div>
                <p className="font-bold text-xl text-gray-900 mb-2">Belum ada donasi yang diterima</p>
                <p className="text-gray-600">Donasi yang Anda ambil akan tampil di sini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonasi.map((item: any) => (
                  <div
                    key={item.donasiId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              {item.namaBarang || item.kategori}
                            </h3>
                            {getStatusBadge(item.statusDonasi?.status)}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p>👤 Dari: <span className="font-semibold">{item.donatur?.username}</span></p>
                            <p>📍 Lokasi: <span className="font-semibold">{item.lokasi?.alamatLengkap || item.lokasi}</span></p>
                          </div>

                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                            {item.deskripsi}
                          </p>

                          <div className="flex gap-2 text-xs">
                            <span className="text-gray-500">📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Action */}
                        <div>
                          {item.statusDonasi?.status?.toLowerCase() === 'pending' ||
                           item.statusDonasi?.status?.toLowerCase() === 'tersedia' ? (
                            <Link href={`/konfirmasi-donasi/${item.donasiId}`}>
                              <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition whitespace-nowrap">
                                Konfirmasi ✓
                              </button>
                            </Link>
                          ) : (
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">Dikonfirmasi pada</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date().toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
