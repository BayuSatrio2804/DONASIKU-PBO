'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DonasiBersediaPage() {
  const router = useRouter();
  const [donasi, setDonasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('semua');

  useEffect(() => {
    fetchDonasi();
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const fetchDonasi = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter donasi yang tersedia
        const availableDonasi = data.filter((item: any) =>
          item.statusDonasi?.status === 'Tersedia' || item.statusDonasi?.status === 'TERSEDIA'
        );
        setDonasi(availableDonasi);
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

  const categories = ['semua', 'Pakaian', 'Elektronik', 'Perabotan', 'Lainnya'];
  const filteredDonasi = filter === 'semua' 
    ? donasi 
    : donasi.filter((item) => item.kategori === filter);

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
          <h1 className="text-xl font-bold">Donasi Tersedia</h1>
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
            <p className="text-gray-600">Memuat donasi...</p>
          </div>
        ) : filteredDonasi.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
              📦
            </div>
            <p className="font-bold text-xl text-gray-900 mb-2">Belum ada donasi tersedia</p>
            <p className="text-gray-600 mb-6">Cek kembali nanti untuk melihat donasi terbaru.</p>
            <Link href="/dashboard" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition inline-block">
              Kembali ke Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Filter Kategori</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition ${
                      filter === cat
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'semua' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600">
              Menampilkan {filteredDonasi.length} donasi
            </div>

            {/* Donasi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonasi.map((item: any) => (
                <Link key={item.donasiId} href={`/detail-donasi/${item.donasiId}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    {item.gambar && (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.gambar}
                          alt={item.namaBarang}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {item.namaBarang || item.kategori}
                      </h3>

                      <p className="text-xs text-gray-500 mb-2">
                        👤 {item.donatur?.username || 'Donatur'}
                      </p>

                      <p className="text-xs text-gray-500 mb-3">
                        📍 {item.lokasi?.alamatLengkap || item.lokasi || 'Lokasi'}
                      </p>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {item.deskripsi}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                          ✓ Tersedia
                        </span>
                        <span className="inline-block text-gray-500 text-xs">
                          📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
