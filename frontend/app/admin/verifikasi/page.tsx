'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Penerima {
  id: string;
  nama: string;
  email: string;
  noTelepon: string;
  alamat: string;
  status: 'pending' | 'verified' | 'rejected';
  dokumen?: string;
  tanggalPendaftaran: string;
}

export default function VerifikasiPenerimaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [penerima, setPenerima] = useState<Penerima[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPenerima, setSelectedPenerima] = useState<Penerima | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionStr);
      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(userData);
    } catch (e) {
      console.error("Invalid session", e);
      router.push('/auth/login');
    }

    // Mock data - nanti ganti dengan API call
    const mockData: Penerima[] = [
      {
        id: '1',
        nama: 'Panti Asuhan Bahagia',
        email: 'panti@example.com',
        noTelepon: '08123456789',
        alamat: 'Jl. Pendidikan No. 45, Bandung',
        status: 'pending',
        dokumen: 'Sudah upload NPWP, Surat Pendirian',
        tanggalPendaftaran: '2024-12-10'
      },
      {
        id: '2',
        nama: 'Yayasan Sosial Maju',
        email: 'yayasan@example.com',
        noTelepon: '08987654321',
        alamat: 'Jl. Kemakmuran No. 12, Bandung',
        status: 'pending',
        dokumen: 'Sudah upload NPWP, SK Pengesahan',
        tanggalPendaftaran: '2024-12-12'
      },
      {
        id: '3',
        nama: 'Rumah Harapan',
        email: 'rumah@example.com',
        noTelepon: '08111222333',
        alamat: 'Jl. Kasih Sayang No. 78, Bandung',
        status: 'verified',
        dokumen: 'Sudah upload lengkap',
        tanggalPendaftaran: '2024-12-05'
      }
    ];

    setPenerima(mockData);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const filteredPenerima = filterStatus === 'all' 
    ? penerima 
    : penerima.filter(p => p.status === filterStatus);

  const pendingCount = penerima.filter(p => p.status === 'pending').length;

  const handleApprove = (id: string) => {
    setPenerima(penerima.map(p => 
      p.id === id ? { ...p, status: 'verified' } : p
    ));
    setSelectedPenerima(null);
  };

  const handleReject = (id: string) => {
    setPenerima(penerima.map(p => 
      p.id === id ? { ...p, status: 'rejected' } : p
    ));
    setSelectedPenerima(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✓ Terverifikasi</span>;
      case 'rejected':
        return <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">✗ Ditolak</span>;
      case 'pending':
        return <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">⏳ Menunggu</span>;
      default:
        return null;
    }
  };

  return (
    <div className="md:container md:mx-auto pb-20">
      {/* HEADER SECTION */}
      <div className="bg-primary text-white pt-8 pb-8 rounded-3xl">
        <div className="px-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Admin Dashboard</p>
            <h2 className="text-2xl font-bold text-white">Verifikasi Penerima</h2>
            {pendingCount > 0 && (
              <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {pendingCount} Menunggu Verifikasi
              </span>
            )}
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
            ✓
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 bg-gray-50/50 rounded-b-3xl pt-6 -mx-6 pb-6">
        {/* Filter Tabs */}
        <section>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: 'pending', label: `Menunggu (${penerima.filter(p => p.status === 'pending').length})` },
              { value: 'verified', label: `Terverifikasi (${penerima.filter(p => p.status === 'verified').length})` },
              { value: 'rejected', label: `Ditolak (${penerima.filter(p => p.status === 'rejected').length})` },
              { value: 'all', label: 'Semua' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value as any)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filterStatus === tab.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* List Penerima */}
        <section>
          {filteredPenerima.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                📭
              </div>
              <p className="font-medium text-gray-900">Tidak ada data</p>
              <p className="text-sm text-gray-500 mt-2">Belum ada penerima dengan status yang dipilih</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPenerima.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedPenerima(p)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{p.nama}</h3>
                        {getStatusBadge(p.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>📧 {p.email}</div>
                        <div>📞 {p.noTelepon}</div>
                        <div className="col-span-2">📍 {p.alamat}</div>
                        <div className="text-xs text-gray-500 col-span-2">Pendaftaran: {p.tanggalPendaftaran}</div>
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal Detail */}
      {selectedPenerima && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedPenerima.nama}</h2>
                <button
                  onClick={() => setSelectedPenerima(null)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2">
                {getStatusBadge(selectedPenerima.status)}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Data Detail */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Email</p>
                  <p className="text-gray-900">{selectedPenerima.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Nomor Telepon</p>
                  <p className="text-gray-900">{selectedPenerima.noTelepon}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Alamat</p>
                  <p className="text-gray-900">{selectedPenerima.alamat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Dokumen</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-blue-900">{selectedPenerima.dokumen}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Tanggal Pendaftaran</p>
                  <p className="text-gray-900">{selectedPenerima.tanggalPendaftaran}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedPenerima.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedPenerima.id)}
                    className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    ✕ Tolak
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPenerima.id)}
                    className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    ✓ Setujui
                  </button>
                </div>
              )}

              {selectedPenerima.status !== 'pending' && (
                <button
                  onClick={() => setSelectedPenerima(null)}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
