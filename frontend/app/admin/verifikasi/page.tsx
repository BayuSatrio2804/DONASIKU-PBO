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
  filePath?: string;
  tanggalPendaftaran: string;
  userId?: number;
}

export default function VerifikasiPenerimaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [penerima, setPenerima] = useState<Penerima[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPenerima, setSelectedPenerima] = useState<Penerima | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', title: string, message: string, penerimaNama?: string } | null>(null);

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
      fetchData();
    } catch (e) {
      console.error("Invalid session", e);
      router.push('/auth/login');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch Pending
      const res = await fetch('http://localhost:8080/api/verifikasi/admin/pending');
      if (res.ok) {
        const data = await res.json();
        console.log('[DEBUG] API Response data:', data);
        const formatted: Penerima[] = data.map((item: any) => {
          console.log('[DEBUG] Processing item filePath:', item.filePath);
          return {
            id: item.dokumenVerifikasiId,
            nama: item.username,
            email: item.email,
            noTelepon: item.noTelepon,
            alamat: item.alamat || '-',
            status: mapStatus(item.status),
            dokumen: item.namaFile,
            filePath: item.filePath, // Store file path for image preview
            tanggalPendaftaran: new Date(item.uploadedAt).toLocaleDateString(),
            userId: item.penerimaUserId
          };
        });
        console.log('[DEBUG] Formatted penerima list:', formatted);
        setPenerima(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (backendStatus: string): 'pending' | 'verified' | 'rejected' => {
    if (backendStatus === 'terverifikasi') return 'verified';
    if (backendStatus === 'ditolak') return 'rejected';
    return 'pending';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const filteredPenerima = filterStatus === 'all'
    ? penerima
    : penerima.filter(p => p.status === filterStatus);

  const pendingCount = penerima.filter(p => p.status === 'pending').length;

  const handleApprove = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menyetujui verifikasi ini?')) return;

    try {
      const penerimaNama = selectedPenerima?.nama || 'Penerima';
      const res = await fetch(`http://localhost:8080/api/verifikasi/admin/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'terverifikasi' })
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          title: '✅ Verifikasi Diterima',
          message: `${penerimaNama} telah berhasil diverifikasi. Status akun sudah diubah menjadi terverifikasi.`,
          penerimaNama
        });
        setPenerima(penerima.filter(p => p.id !== id)); // Remove from list as it's no longer pending
        setSelectedPenerima(null);
      } else {
        setNotification({
          type: 'error',
          title: '❌ Verifikasi Gagal',
          message: 'Terjadi kesalahan saat memproses persetujuan. Silahkan coba lagi.'
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        title: '❌ Error',
        message: 'Terjadi kesalahan jaringan. Silahkan coba lagi.'
      });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menolak verifikasi ini?')) return;

    try {
      const penerimaNama = selectedPenerima?.nama || 'Penerima';
      const res = await fetch(`http://localhost:8080/api/verifikasi/admin/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ditolak' })
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          title: '⚠️ Verifikasi Ditolak',
          message: `${penerimaNama} ditolak. Mereka dapat mengunggah ulang dokumen setelah perbaikan.`,
          penerimaNama
        });
        setPenerima(penerima.filter(p => p.id !== id)); // Remove from list
        setSelectedPenerima(null);
      } else {
        setNotification({
          type: 'error',
          title: '❌ Penolakan Gagal',
          message: 'Terjadi kesalahan saat memproses penolakan. Silahkan coba lagi.'
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        title: '❌ Error',
        message: 'Terjadi kesalahan jaringan. Silahkan coba lagi.'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        {/* Filter Tabs - Simply hidden or reduced because API only returns pending for now */}
        <section>
          <div className="flex gap-3 flex-wrap">
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-all bg-primary text-white shadow-md`}
            >
              Menunggu Verifikasi ({penerima.length})
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">* Saat ini hanya menampilkan yang berstatus Pending</p>
        </section>

        {/* List Penerima */}
        <section>
          {filteredPenerima.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                📭
              </div>
              <p className="font-medium text-gray-900">Tidak ada pengajuan pending</p>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 space-y-3">
                    {/* File Name */}
                    <p className="text-sm text-blue-900 font-medium">📄 {selectedPenerima.dokumen}</p>

                    {/* Image Preview */}
                    {selectedPenerima.filePath && (
                      <div className="mt-3">
                        {(() => {
                          // Normalize path: convert backslash to forward slash
                          let normalizedPath = (selectedPenerima.filePath || '')
                            .replace(/\\/g, '/') // Replace backslash with forward slash
                            .replace(/^\/+/, '/'); // Normalize multiple leading slashes

                          // Add leading slash if missing
                          if (!normalizedPath.startsWith('/')) {
                            normalizedPath = '/' + normalizedPath;
                          }

                          const imageUrl = `http://localhost:8080${normalizedPath}`;
                          console.log('[DEBUG] Original Path:', selectedPenerima.filePath);
                          console.log('[DEBUG] Normalized Path:', normalizedPath);
                          console.log('[DEBUG] Final Image URL:', imageUrl);

                          return (
                            <>
                              <img
                                src={imageUrl}
                                alt="Dokumen Verifikasi"
                                className="w-full max-h-96 rounded-lg border border-blue-300 object-cover cursor-pointer hover:opacity-90 transition-all"
                                onClick={() => window.open(imageUrl, '_blank')}
                                title="Klik untuk membuka gambar dalam ukuran penuh"
                                onError={(e) => {
                                  console.error('[ERROR] Image load failed');
                                  console.error('URL:', imageUrl);
                                  console.error('Error:', e);
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-2">💡 Klik gambar untuk lihat ukuran penuh</p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Tanggal Pengajuan</p>
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

      {/* Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className={`bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl ${
            notification.type === 'success' ? 'border-2 border-green-200' : 'border-2 border-red-200'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className="text-4xl">{notification.type === 'success' ? '✅' : '❌'}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{notification.title}</h3>
            <p className="text-gray-600 mb-6">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-colors ${
                notification.type === 'success'
                  ? 'bg-green-500 hover:bg-green-600 shadow-green-200'
                  : 'bg-red-500 hover:bg-red-600 shadow-red-200'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
