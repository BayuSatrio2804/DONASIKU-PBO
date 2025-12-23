'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function DetailDonasiPage() {
  const router = useRouter();
  const params = useParams();
  const donasi_id = params.id;

  const [donasi, setDonasi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taking, setTaking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (donasi_id) {
      fetchDonasiDetail();
    }
  }, [donasi_id]);

  const fetchDonasiDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/donasi/${donasi_id}`);
      if (response.ok) {
        const data = await response.json();
        setDonasi(data);
      } else {
        setError('Donasi tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal mengambil detail donasi');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmbilDonasi = async () => {
    try {
      // Get user data from localStorage
      const sessionStr = localStorage.getItem('userSession');
      if (!sessionStr) {
        setError('Anda harus login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const user = JSON.parse(sessionStr);
      if (user.role !== 'penerima') {
        alert("Hanya penerima yang bisa mengambil donasi");
        return;
      }

      setTaking(true);
      // Call Claim API
      // POST /api/donasi/{id}/claim?userId=...
      const response = await fetch(`http://localhost:8080/api/donasi/${donasi_id}/claim?userId=${user.userId}`, {
        method: 'POST'
      });

      if (response.ok) {
        setSuccess(true);
        // Alert and Redirect equivalent to "Ambil" in dashboard
        alert('Berhasil mengklaim donasi! Menunggu persetujuan donatur.');
        router.push('/dashboard');
      } else {
        const txt = await response.text();
        setError('Gagal mengklaim: ' + txt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Error:', err);
    } finally {
      setTaking(false);
    }
  };

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Load User Session
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('userSession');
      if (sessionStr) {
        setCurrentUser(JSON.parse(sessionStr));
      }
    }
  }, []);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus donasi ini?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/donasi/${donasi_id}?userId=${currentUser.userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Donasi berhasil dihapus');
        router.push('/dashboard');
      } else {
        const txt = await response.text();
        alert('Gagal menghapus: ' + txt);
      }
    } catch (e) {
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!donasi) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donasi Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/dashboard" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && donasi.donatur && currentUser.userId === donasi.donatur.userId;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-primary text-white pt-6 pb-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ← Kembali
          </button>
          <h1 className="text-xl font-bold">Detail Donasi</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Section */}
          {donasi.gambar && (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
              <img
                src={donasi.gambar}
                alt={donasi.namaBarang}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✓ Berhasil! Mengalihkan ke form permintaan...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                ✗ {error}
              </div>
            )}

            {/* Nama Barang */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {donasi.namaBarang || donasi.kategori}
              </h2>
              <div className="flex gap-2">
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Tersedia
                </span>
                {isOwner && (
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Milik Anda
                  </span>
                )}
              </div>
            </div>

            {/* Informasi Donatur */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">👤 Informasi Donatur</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Nama:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    {donasi.donatur?.username || 'Donatur'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    {donasi.donatur?.email || '-'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">No. Telp:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    {donasi.donatur?.noTelepon || '-'}
                  </span>
                </p>
              </div>
            </div>

            {/* Lokasi Pengambilan */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">📍 Lokasi Pengambilan</h3>
              <p className="text-gray-700 text-lg">
                {donasi.lokasi?.alamatLengkap || donasi.lokasi || 'Lokasi tidak tersedia'}
              </p>
            </div>

            {/* Deskripsi Barang */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">📝 Deskripsi Barang</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {donasi.deskripsi || 'Tidak ada deskripsi'}
              </p>
            </div>

            {/* Info Pengajuan */}
            {!isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">ℹ️ Informasi Pengajuan</h3>
                <p className="text-sm text-gray-700">
                  Dengan mengklik tombol "Ambil Donasi", Anda akan diarahkan ke halaman Permintaan Barang untuk mengajukan permintaan barang ini.
                </p>
              </div>
            )}

            {/* Kondisi Barang */}
            {donasi.kondisi && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">🔍 Kondisi Barang</h3>
                <p className="text-gray-700 capitalize">{donasi.kondisi}</p>
              </div>
            )}

            {/* Tanggal Donasi */}
            <div className="text-sm text-gray-500">
              📅 Didonasikan pada {new Date(donasi.createdAt).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {isOwner ? (
                <>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    🗑 Hapus Donasi
                  </button>
                  {/* Placeholder for Edit feature if pages exists
                    <button
                        onClick={() => router.push(`/donasi/edit/${donasi_id}`)}
                        className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
                    >
                        ✏️ Edit Donasi
                    </button>
                    */}
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.back()}
                    className="flex-1 border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAmbilDonasi}
                    disabled={taking}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {taking ? '⏳ Memproses...' : '✓ Ambil Donasi'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
