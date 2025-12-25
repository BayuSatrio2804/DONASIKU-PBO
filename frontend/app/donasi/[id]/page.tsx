// c:\Users\Ichsan\Documents\GitHub\DONASIKU-PBO\frontend\app\donasi\[id]\page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DetailDonasiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/donasi/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Gagal mengambil data donasi');
          return res.json();
        })
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <p className="text-gray-400 mt-2">Memuat data donasi...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error || 'Data tidak ditemukan'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Helper function untuk memperbaiki URL gambar
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Tambahkan host backend jika path bersifat relative
    return `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            ←
          </button>
          <h1 className="font-semibold text-lg text-gray-900">
            Detail Donasi
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {data.foto || data.imageUrl ? (
                <img
                  src={getImageUrl(data.foto || data.imageUrl)}
                  alt={data.namaBarang}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <span className="text-6xl mb-2">📦</span>
                  <span className="text-sm">Tidak ada gambar</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {data.namaBarang}
                    </h2>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="mr-2">📍</span>
                      {typeof data.lokasi === 'object' ? data.lokasi?.alamatLengkap : data.lokasi}
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Donasi
                  </span>
                </div>

                <div className="border-t border-b border-gray-100 py-6 my-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Jumlah</p>
                    <p className="font-semibold text-gray-900 text-xl">
                      {data.jumlah} Pcs
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                    <p className="font-semibold text-green-600 text-lg flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Tersedia
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Deskripsi Barang
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm">
                    {data.deskripsi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
