import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiUser, FiPhone, FiMail, FiMessageSquare, FiCheckCircle, FiX, FiLoader, FiTruck, FiClock } from 'react-icons/fi';
import API from '../../services/api';
import { approvePermintaan, rejectPermintaan, markPermintaanSent } from '../../services/permintaanService';
import { showSuccess, showError } from '../../utils/sweetalert';
import { getAuthData } from '../../utils/localStorage';

const PermintaanMasukDonatur = () => {
  const navigate = useNavigate();
  const user = getAuthData();
  const [permintaan, setPermintaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPermintaan, setSelectedPermintaan] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [actionLoading, setActionLoading] = useState(false);
  const [showProof, setShowProof] = useState(false);

  const fetchPermintaan = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch permintaan yang masuk untuk donatur
      // The endpoint might be different depending on backend implementation, but we'll stick to the one that seemed to work or use a service method if available.
      // Fetch permintaan yang masuk (all open requests for Donatur to see)
      const response = await API.get('/permintaan');

      // Handle both response.data.data and response.data array formats
      let data = Array.isArray(response.data) ? response.data : (response.data?.data || []);

      console.log('Raw permintaan data:', data);

      // Filter: Hanya tampilkan permintaan yang masih 'pending' (publik) 
      // ATAU permintaan yang diambil oleh donatur ini sendiri.
      const visibleData = data.filter(p => {
        const status = (p.status_permohonan || "").toLowerCase();
        const isPending = !status || status === 'pending' || status === 'open';

        if (isPending) return true;

        // Cek apakah donatur yang mengambil adalah user saat ini
        const donaturId = p.donatur?.userId || p.donatur?.id || p.donatur_id;
        return String(donaturId) === String(user.id || user.userId);
      });

      // Filter berdasarkan tab status di UI
      if (filter !== 'semua') {
        const filtered = visibleData.filter(p => p.status_permohonan === filter || (filter === 'pending' && !p.status_permohonan));
        setPermintaan(filtered);
      } else {
        setPermintaan(visibleData);
      }
    } catch (err) {
      console.error('Error fetching permintaan:', err);
      setError('Gagal memuat permintaan masuk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermintaan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleApprove = async (permintaanId) => {
    try {
      setActionLoading(true); // Fix loading state variable usage (was setLoading in original)
      await approvePermintaan(permintaanId);
      await showSuccess('Berhasil', 'Permintaan disetujui');
      fetchPermintaan();
      setSelectedPermintaan(null);
    } catch (err) {
      showError('Gagal', 'Gagal menyetujui permintaan: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (permintaanId) => {
    try {
      setActionLoading(true);
      // Pass a default reason if none provided by UI (though UI doesn't ask for it here yet)
      await rejectPermintaan(permintaanId, "Ditolak oleh donatur via dashboard");
      await showSuccess('Berhasil', 'Permintaan ditolak');
      fetchPermintaan();
      setSelectedPermintaan(null);
    } catch (err) {
      showError('Gagal', 'Gagal menolak permintaan: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkSent = async (permintaanId) => {
    try {
      setActionLoading(true);
      await markPermintaanSent(permintaanId);
      await showSuccess('Berhasil', 'Donasi ditandai sebagai sudah dikirim');
      fetchPermintaan();
      setSelectedPermintaan(null);
    } catch (err) {
      showError('Gagal', 'Gagal menandai pengiriman: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Permintaan Masuk</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['semua', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${filter === status
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {status === 'semua' ? 'Semua' : status === 'pending' ? 'Menunggu Disetujui' : status === 'approved' ? 'Sudah Disetujui' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* List Permintaan */}
      {permintaan.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg">Belum ada permintaan masuk</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {permintaan.map(p => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedPermintaan(p)}
            >
              <div className="flex items-start justify-between gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {p.image || p.donation?.image ? (
                      <img
                        src={
                          (p.donation?.image || p.image)?.startsWith('data:')
                            ? (p.donation?.image || p.image)
                            : (p.donation?.image || p.image)?.startsWith('http')
                              ? (p.donation?.image || p.image)
                              : (p.donation?.image || p.image)?.startsWith('storage/')
                                ? `http://localhost:8081/${p.donation?.image || p.image}`
                                : `http://localhost:8081/storage/${p.donation?.image || p.image}`
                        }
                        alt={p.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-3xl"
                      style={{ display: (p.donation?.image || p.image) ? 'none' : 'flex' }}
                    >
                      📦
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FiPackage className="text-blue-500" />
                    {p.judul}
                  </h3>
                  <p className="text-gray-600 mt-2">{p.deskripsi}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-orange-500" />
                      <span>{p.lokasi?.alamatLengkap || p.lokasi || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-green-500" />
                      <span>Jumlah: {p.jumlah || p.target_jumlah} Pcs</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status_permohonan === 'pending' || !p.status_permohonan
                        ? 'bg-yellow-100 text-yellow-700'
                        : p.status_permohonan === 'approved'
                          ? 'bg-blue-100 text-blue-700'
                          : p.status_permohonan === 'sent'
                            ? 'bg-purple-100 text-purple-700'
                            : p.status_permohonan === 'received'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {p.status_permohonan === 'pending' || !p.status_permohonan
                        ? '⏳ Menunggu'
                        : p.status_permohonan === 'approved'
                          ? '📦 Disiapkan'
                          : p.status_permohonan === 'sent'
                            ? '📦 Dikirim'
                            : p.status_permohonan === 'received'
                              ? '📍 Diterima'
                              : '✕ Ditolak'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Permintaan */}
      {selectedPermintaan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Detail Permintaan</h2>
              <button
                onClick={() => setSelectedPermintaan(null)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-all"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Image Display - Primary (Donation Item) or Fallback */}
              {(selectedPermintaan.donation?.image || selectedPermintaan.image) && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                    {selectedPermintaan.donation?.image ? "Foto Barang Donasi" : "Bukti Kebutuhan (Tanpa Foto Barang)"}
                  </span>
                  <img
                    src={
                      (selectedPermintaan.donation?.image || selectedPermintaan.image).startsWith('data:')
                        ? (selectedPermintaan.donation?.image || selectedPermintaan.image)
                        : (selectedPermintaan.donation?.image || selectedPermintaan.image).startsWith('http')
                          ? (selectedPermintaan.donation?.image || selectedPermintaan.image)
                          : (selectedPermintaan.donation?.image || selectedPermintaan.image).startsWith('storage/')
                            ? `http://localhost:8081/${selectedPermintaan.donation?.image || selectedPermintaan.image}`
                            : `http://localhost:8081/storage/${selectedPermintaan.donation?.image || selectedPermintaan.image}`
                    }
                    alt="Barang Donasi"
                    className="max-w-sm max-h-64 object-cover rounded-lg shadow-md border-2 border-blue-100"
                  />
                  {/* Debug Info (Visible only for verification) */}
                  <span className="text-[10px] text-gray-400">
                    Donasi: {selectedPermintaan.donation?.image ? "Ada" : "Tidak"} |
                    Bukti: {selectedPermintaan.image ? "Ada" : "Tidak"}
                  </span>
                </div>
              )}

              {/* Info Utama */}
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FiPackage className="text-blue-500" />
                  {selectedPermintaan.judul} (Penerima: {selectedPermintaan.penerima?.name || selectedPermintaan.user?.name || "Anonim"})
                </h3>
                <p className="text-gray-600">{selectedPermintaan.deskripsi}</p>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                    <FiMapPin /> Alamat Tujuan (Penerima)
                  </div>
                  <p>{selectedPermintaan.lokasi?.alamatLengkap || selectedPermintaan.lokasi || '-'}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">
                    <FiPackage /> Jumlah Target
                  </div>
                  <p>{selectedPermintaan.jumlah || selectedPermintaan.target_jumlah}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-600 font-semibold mb-1">
                    <FiPackage /> Kategori
                  </div>
                  <p className="capitalize">{selectedPermintaan.kategori}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                  <div className="flex items-center gap-2 text-purple-600 font-semibold mb-1">
                    <FiClock /> Status Permohonan & Pengiriman
                  </div>
                  <p className="capitalize font-bold text-purple-800 text-lg">
                    {selectedPermintaan.status_permohonan === 'pending' || !selectedPermintaan.status_permohonan
                      ? '⏳ Menunggu Persetujuan'
                      : selectedPermintaan.status_permohonan === 'approved'
                        ? '📦 Barang Sedang Disiapkan'
                        : selectedPermintaan.status_permohonan === 'sent'
                          ? '🚚 Barang Sedang Dikirim'
                          : selectedPermintaan.status_permohonan === 'received'
                            ? '✅ Selesai - Diterima'
                            : '✕ Ditolak'}
                  </p>
                </div>
              </div>

              {/* Bukti Kebutuhan Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" /> Bukti Kebutuhan Penerima
                  </h4>
                  {selectedPermintaan.image && (
                    <button
                      onClick={() => setShowProof(!showProof)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {showProof ? <FiX /> : <FiClock />} {showProof ? "Tutup Bukti" : "Lihat Bukti Kebutuhan"}
                    </button>
                  )}
                </div>

                {showProof && selectedPermintaan.image ? (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <img
                      src={
                        selectedPermintaan.image.startsWith('data:')
                          ? selectedPermintaan.image
                          : selectedPermintaan.image.startsWith('http')
                            ? selectedPermintaan.image
                            : selectedPermintaan.image.startsWith('storage/')
                              ? `http://localhost:8081/${selectedPermintaan.image}`
                              : `http://localhost:8081/storage/${selectedPermintaan.image}`
                      }
                      alt="Bukti Kebutuhan"
                      className="w-full max-h-96 object-contain rounded-xl shadow-inner bg-gray-100 border-2 border-dashed border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Diunggah oleh penerima sebagai bukti kebutuhan mendesak.</p>
                  </div>
                ) : (
                  !selectedPermintaan.image && <p className="text-gray-500 italic text-sm">Penerima belum mengunggah foto bukti kebutuhan.</p>
                )}
              </div>

              {/* Aksi */}
              {selectedPermintaan.status_permohonan === 'pending' && (
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    onClick={() => handleApprove(selectedPermintaan.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />} Setujui Permintaan
                  </button>
                  <button
                    onClick={() => handleReject(selectedPermintaan.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiX />} Tolak Permintaan
                  </button>
                </div>
              )}

              {/* Chat Button for Approved/Sent/Received */}
              {(selectedPermintaan.status_permohonan === 'approved' ||
                selectedPermintaan.status_permohonan === 'sent' ||
                selectedPermintaan.status_permohonan === 'received') && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        setSelectedPermintaan(null);
                        // Peer is the recipient (penerima)
                        const peerId = selectedPermintaan.penerima?.id || selectedPermintaan.user?.id || selectedPermintaan.user_id;
                        navigate('/donatur/chat', { state: { peerId } });
                      }}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-[#00306C] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FiMessageSquare /> Chat Penerima
                    </button>
                  </div>
                )}

              {selectedPermintaan.status_permohonan === 'approved' && (
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    onClick={() => handleMarkSent(selectedPermintaan.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiPackage />} Konfirmasi Barang Dikirim
                  </button>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'sent' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 font-semibold">
                    📦 Barang sedang dalam perjalanan. Menunggu konfirmasi penerimaan oleh penerima.
                  </p>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'received' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-bold">
                    ✅ Donasi telah selesai dan diterima oleh penerima.
                  </p>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'rejected' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-800">
                    ✕ Permintaan ini telah ditolak dan tidak dapat diubah.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermintaanMasukDonatur;
