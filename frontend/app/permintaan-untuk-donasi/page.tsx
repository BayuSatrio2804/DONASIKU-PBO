'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PermintaanUntukDonasiPage() {
  const router = useRouter();
  const [permintaan, setPermintaan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermintaan, setSelectedPermintaan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth - must be donatur
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(sessionStr);
    if (userData.role?.toLowerCase() !== 'donatur') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    fetchPermintaan();
  }, [router]);

  const fetchPermintaan = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/permintaan');
      if (response.ok) {
        const data = await response.json();
        // Filter hanya permintaan yang belum dipenuhi (status Open/Urgent)
        const openPermintaan = data.filter((item: any) =>
          item.status === 'Open' || item.status === 'Urgent'
        );
        setPermintaan(openPermintaan);
      } else {
        setError('Gagal mengambil data permintaan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['semua', 'Pakaian', 'Elektronik', 'Perabotan', 'Makanan', 'Lainnya'];

  const filteredPermintaan = permintaan.filter((item) => {
    const matchCategory = filter === 'semua' || item.jenisBarang.toLowerCase().includes(filter.toLowerCase());
    const matchSearch = item.jenisBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.deskripsiKebutuhan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.penerima?.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handlePilihPermintaan = (item: any) => {
    setSelectedPermintaan(item);
    setShowModal(true);
  };

  const handleConfirmPilih = async () => {
    try {
      setError('');
      
      // Buka halaman untuk membuat donasi yang match dengan permintaan ini
      router.push(`/donasi?permintaan=${selectedPermintaan.permintaanId}&barang=${encodeURIComponent(selectedPermintaan.jenisBarang)}&jumlah=${selectedPermintaan.jumlah}`);
      
      setShowModal(false);
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error('Error:', err);
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
          <h1 className="text-xl font-bold">Permintaan Barang</h1>
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
            <p className="text-gray-600">Memuat permintaan...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <input
                type="text"
                placeholder="🔍 Cari permintaan barang, nama penerima..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
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
              Menampilkan {filteredPermintaan.length} permintaan barang
            </div>

            {filteredPermintaan.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  🤲
                </div>
                <p className="font-bold text-xl text-gray-900 mb-2">Belum ada permintaan</p>
                <p className="text-gray-600">Saat ini tidak ada permintaan barang yang sesuai dengan kriteria Anda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPermintaan.map((item: any) => (
                  <div
                    key={item.permintaanId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-gray-900">
                              {item.jenisBarang}
                            </h3>
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                              x{item.jumlah}
                            </span>
                            {item.status === 'Urgent' && (
                              <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                🚨 Urgent
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p>👤 Dari: <span className="font-semibold">{item.penerima?.username || 'Penerima'}</span></p>
                            <p>📍 Lokasi: <span className="font-semibold">{item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</span></p>
                          </div>

                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                            {item.deskripsiKebutuhan}
                          </p>

                          <div className="flex gap-2">
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {item.status}
                            </span>
                            <span className="inline-block text-gray-500 text-xs">
                              📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePilihPermintaan(item)}
                          className="ml-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition whitespace-nowrap"
                        >
                          Pilih ✓
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Confirm */}
      {showModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Permintaan Ini?</h2>
              <p className="text-gray-600">Anda akan membuat donasi untuk memenuhi permintaan barang ini.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Barang:</span> {selectedPermintaan.jenisBarang}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Jumlah:</span> {selectedPermintaan.jumlah}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Untuk:</span> {selectedPermintaan.penerima?.username}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Lokasi:</span> {selectedPermintaan.lokasi?.alamatLengkap}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPilih}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Lanjut Buat Donasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
