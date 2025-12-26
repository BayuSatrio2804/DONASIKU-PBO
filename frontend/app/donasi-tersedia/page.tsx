'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DonasiTersediaPage() {
  const router = useRouter();
  const [donasi, setDonasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [lokasiFilter, setLokasiFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    fetchDonasi();
  }, [kategoriFilter, lokasiFilter, availableOnly, router]);

  const fetchDonasi = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query params
      const params = new URLSearchParams();
      if (kategoriFilter) params.append('kategori', kategoriFilter);
      if (lokasiFilter) params.append('lokasi', lokasiFilter);
      if (availableOnly) params.append('availableOnly', 'true');

      const url = `http://localhost:8080/api/donasi${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setDonasi(data);
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

  // Client-side search by search query (deskripsi, namaBarang)
  const filteredDonasi = donasi.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.kategori?.toLowerCase() || '').includes(query) ||
      (item.deskripsi?.toLowerCase() || '').includes(query) ||
      (item.namaBarang?.toLowerCase() || '').includes(query)
    );
  });

  const categories = ['Makanan', 'Pakaian', 'Elektronik', 'Buku', 'Perabotan', 'Mainan', 'Lainnya'];

  const handleResetFilter = () => {
    setKategoriFilter('');
    setLokasiFilter('');
    setSearchQuery('');
    setAvailableOnly(true);
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
          <h1 className="text-xl font-bold">Donasi Tersedia</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg mb-4">🔍 Cari & Filter Donasi</h3>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari Donasi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nama barang, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>

          {/* Kategori Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setKategoriFilter('')}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition ${kategoriFilter === ''
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setKategoriFilter(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition ${kategoriFilter === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lokasi Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Lokasi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan lokasi (contoh: Lampung, Bandung...)"
              value={lokasiFilter}
              onChange={(e) => setLokasiFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>

          {/* Available Only Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="availableOnly"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="availableOnly" className="text-sm font-semibold text-gray-700">
              Hanya tampilkan donasi yang tersedia (belum diambil)
            </label>
          </div>

          {/* Reset Button */}
          {(kategoriFilter || lokasiFilter || searchQuery || !availableOnly) && (
            <button
              onClick={handleResetFilter}
              className="text-sm text-primary hover:text-primary/80 font-semibold transition"
            >
              🔄 Reset semua filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat donasi...</p>
            </div>
          </div>
        ) : filteredDonasi.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
              📦
            </div>
            <p className="font-bold text-xl text-gray-900 mb-2">Tidak ada donasi ditemukan</p>
            <p className="text-gray-600 mb-6">
              {kategoriFilter || lokasiFilter || searchQuery
                ? 'Coba ubah filter pencarian Anda.'
                : 'Belum ada donasi tersedia saat ini.'}
            </p>
            {(kategoriFilter || lokasiFilter || searchQuery) && (
              <button
                onClick={handleResetFilter}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition inline-block"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Info */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Menampilkan <span className="font-bold text-gray-900">{filteredDonasi.length}</span> donasi
                {kategoriFilter && <span> · Kategori: <span className="font-semibold">{kategoriFilter}</span></span>}
                {lokasiFilter && <span> · Lokasi: <span className="font-semibold">{lokasiFilter}</span></span>}
              </p>
            </div>

            {/* Donasi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonasi.map((item: any) => (
                <Link key={item.donasiId} href={`/detail-donasi/${item.donasiId}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    {item.foto && (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.foto.startsWith('http') ? item.foto : `http://localhost:8080/uploads/${item.foto}`}
                          alt={item.kategori}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!item.foto && (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">
                          {item.kategori}
                        </h3>
                        {item.jumlah && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                            {item.jumlah}x
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mb-2">
                        👤 {item.donatur?.nama || item.donatur?.username || 'Donatur'}
                      </p>

                      <p className="text-xs text-gray-500 mb-3">
                        📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}
                      </p>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {item.deskripsi || 'Tidak ada deskripsi'}
                      </p>

                      <div className="flex gap-2 items-center mt-auto flex-wrap">
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                          ✓ {item.statusDonasi?.status || 'Tersedia'}
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
