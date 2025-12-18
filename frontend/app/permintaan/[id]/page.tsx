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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const handleFulfill = async () => {
    if (!currentUser || currentUser.role !== 'donatur') return;
    if (!confirm("Apakah Anda yakin ingin menyalurkan bantuan untuk permintaan ini?")) return;

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/permintaan/${id}/fulfill?donaturId=${currentUser.userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        alert("Terima kasih! Permintaan berhasil diproses.");
        fetchDetail(); // Refresh data
      } else {
        const txt = await response.text();
        alert("Gagal memproses: " + txt);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!currentUser || currentUser.role !== 'penerima') return;
    if (!confirm("Apakah Anda yakin ingin menerima bantuan ini?")) return;

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/permintaan/${id}/accept-offer`, {
        method: 'POST'
      });
      if (response.ok) {
        alert("Berhasil! Bantuan telah diterima dan barang siap dikirim oleh donatur.");
        fetchDetail(); // Refresh data
      } else {
        const txt = await response.text();
        alert("Gagal memproses: " + txt);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setProcessing(false);
    }
  };

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
            <span className={`inline-block text-xs px-3 py-2 rounded-full font-semibold ${permintaan.status === 'Open' ? 'bg-blue-50 text-blue-700' :
                ['Offered', 'Diproses'].includes(permintaan.status) ? 'bg-yellow-50 text-yellow-700' :
                  'bg-green-50 text-green-700'
              }`}>
              {['Offered', 'Diproses'].includes(permintaan.status) ? 'Menunggu Persetujuan Anda' : permintaan.status}
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

            {permintaan.donatur && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Calon Donatur</h3>
                <p className="text-gray-900 mt-1 font-bold text-primary">{permintaan.donatur.username} 🤝</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {currentUser?.role === 'donatur' ? (
              <>
                {permintaan.status === 'Open' ? (
                  <button
                    onClick={handleFulfill}
                    disabled={processing}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                  >
                    {processing ? 'Memproses...' : '🤝 Salurkan Bantuan'}
                  </button>
                ) : (
                  <div className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl text-center border border-blue-100">
                    {['Offered', 'Diproses'].includes(permintaan.status) ? 'Menunggu Konfirmasi Penerima' : `Bantuan Disalurkan (${permintaan.status})`}
                  </div>
                )}
              </>
            ) : currentUser?.role === 'penerima' && currentUser?.userId === permintaan.penerima?.userId ? (
              <>
                {['Offered', 'Diproses'].includes(permintaan.status) ? (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-4">
                      <p className="font-bold text-yellow-800 mb-1">Ada Penawaran Bantuan!</p>
                      <p className="text-sm text-yellow-700">
                        Donatur <strong>{permintaan.donatur?.username}</strong> ingin membantu Anda.
                      </p>
                    </div>
                    <button
                      onClick={handleAcceptOffer}
                      disabled={processing}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                    >
                      {processing ? 'Memproses...' : '✅ Terima Bantuan'}
                    </button>
                  </div>
                ) : ['Fulfilled', 'Selesai'].includes(permintaan.status) ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="font-bold text-green-800 mb-2">🎉 Permintaan Berhasil!</p>
                    <p className="text-sm text-green-700 mb-3">
                      Bantuan telah disetujui. Silakan pantau pengiriman di dashboard.
                    </p>
                    <Link href="/dashboard" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition">
                      Cek Dashboard
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => alert("Fitur edit belum tersedia")}
                    className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    ✏️ Edit Permintaan
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
