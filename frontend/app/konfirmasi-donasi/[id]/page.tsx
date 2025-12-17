'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function KonfirmasiDonasiPage() {
  const router = useRouter();
  const params = useParams();
  const donasi_id = params.id;

  const [donasi, setDonasi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kondisi, setKondisi] = useState('baik');
  const [catatan, setCatatan] = useState('');
  const [fotoBukti, setFotoBukti] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check auth
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

    if (donasi_id) {
      fetchDonasiDetail();
    }
  }, [donasi_id, router]);

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

  const handleKonfirmasi = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');

      const sessionStr = localStorage.getItem('userSession');
      if (!sessionStr) {
        setError('Session tidak valid');
        return;
      }

      const userData = JSON.parse(sessionStr);

      // Create FormData untuk upload foto
      const formData = new FormData();
      formData.append('donasi_id', donasi_id as string);
      formData.append('penerima_id', userData.userId);
      formData.append('kondisi_barang', kondisi);
      formData.append('catatan', catatan);
      
      if (fotoBukti) {
        formData.append('foto_bukti', fotoBukti);
      }

      const response = await fetch('http://localhost:8080/api/donasi/konfirmasi', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/riwayat-donasi-diterima');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal mengkonfirmasi donasi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
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
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Konfirmasi Penerimaan</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Donasi */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {donasi.gambar && (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={donasi.gambar}
                    alt={donasi.namaBarang}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {donasi.namaBarang || donasi.kategori}
                  </h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Dari:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {donasi.donatur?.username}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Lokasi:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {donasi.lokasi?.alamatLengkap || donasi.lokasi}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Deskripsi:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {donasi.deskripsi}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Konfirmasi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Konfirmasi berhasil! Mengalihkan...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ✗ {error}
                </div>
              )}

              <form onSubmit={handleKonfirmasi} className="space-y-6">
                {/* Kondisi Barang */}
                <div>
                  <label className="block font-bold text-gray-900 mb-3">
                    Kondisi Barang 🔍
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" style={{borderColor: kondisi === 'baik' ? '#1e40af' : '#d1d5db'}}>
                      <input
                        type="radio"
                        value="baik"
                        checked={kondisi === 'baik'}
                        onChange={(e) => setKondisi(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">✅ Baik & Sesuai</p>
                        <p className="text-sm text-gray-600">Barang diterima dengan kondisi yang baik</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" style={{borderColor: kondisi === 'sebagian' ? '#1e40af' : '#d1d5db'}}>
                      <input
                        type="radio"
                        value="sebagian"
                        checked={kondisi === 'sebagian'}
                        onChange={(e) => setKondisi(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">⚠️ Sebagian Baik</p>
                        <p className="text-sm text-gray-600">Ada bagian barang yang sedikit rusak</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" style={{borderColor: kondisi === 'rusak' ? '#1e40af' : '#d1d5db'}}>
                      <input
                        type="radio"
                        value="rusak"
                        checked={kondisi === 'rusak'}
                        onChange={(e) => setKondisi(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">❌ Rusak</p>
                        <p className="text-sm text-gray-600">Barang datang dalam kondisi rusak</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label className="block font-bold text-gray-900 mb-2">
                    Catatan Tambahan 📝
                  </label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Jelaskan kondisi barang secara detail, atau masalah yang ditemukan..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimal 10 karakter</p>
                </div>

                {/* Foto Bukti */}
                <div>
                  <label className="block font-bold text-gray-900 mb-2">
                    Foto Bukti (Opsional) 📷
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFotoBukti(e.target.files?.[0] || null)}
                      className="hidden"
                      id="foto-bukti"
                    />
                    <label htmlFor="foto-bukti" className="cursor-pointer">
                      <p className="text-2xl mb-2">📸</p>
                      <p className="text-gray-900 font-semibold">
                        {fotoBukti ? fotoBukti.name : 'Pilih foto atau drag & drop'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || catatan.length < 10}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? '⏳ Memproses...' : '✓ Konfirmasi Penerimaan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
