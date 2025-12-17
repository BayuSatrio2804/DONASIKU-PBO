'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function DetailPermintaanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [permintaan, setPermintaan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/permintaan/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPermintaan(data);
      } else {
        setError('Permintaan tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal memuat data permintaan');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (error || !permintaan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-primary text-white pt-6 pb-6 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              ←
            </button>
            <h1 className="text-xl font-bold">Detail Permintaan</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <Link href="/dashboard" className="text-primary mt-4 inline-block font-semibold">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white pt-6 pb-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Detail Permintaan</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          
          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{permintaan.jenisBarang}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {permintaan.permintaanId}</p>
            </div>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-full font-semibold">
              {permintaan.status}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Detail Informasi */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Jumlah Dibutuhkan</h3>
              <p className="text-xl font-bold text-gray-900 mt-1">{permintaan.jumlah} unit</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Lokasi Pengiriman</h3>
              <p className="text-gray-900 mt-1 flex items-start gap-2">
                <span>📍</span>
                <span>{permintaan.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Deskripsi Kebutuhan</h3>
              <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                {permintaan.deskripsiKebutuhan || 'Tidak ada deskripsi'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dibuat Pada</h3>
              <p className="text-gray-900 mt-1">
                {new Date(permintaan.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {permintaan.penerima && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Penerima</h3>
                <p className="text-gray-900 mt-1">{permintaan.penerima.nama || permintaan.penerima.username}</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
              Lihat Penawaran Bantuan
            </button>
            <button className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all">
              Edit Permintaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
