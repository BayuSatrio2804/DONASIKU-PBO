import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiUser, FiPhone, FiMail, FiMessageSquare, FiCheckCircle, FiX, FiLoader, FiTruck, FiClock } from 'react-icons/fi';
import API from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetalert';

const PermintaanMasukDonatur = () => {
  const navigate = useNavigate();
  const [permintaan, setPermintaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPermintaan, setSelectedPermintaan] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPermintaan = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch permintaan yang masuk untuk donatur
      const response = await API.get('/permintaan-sayas');

      if (response.data && response.data.data) {
        let data = response.data.data;

        // Filter berdasarkan status_permohonan
        if (filter !== 'semua') {
          if (filter === 'pending') {
            data = data.filter(p => p.status_permohonan === 'pending');
          } else if (filter === 'approved') {
            data = data.filter(p => p.status_permohonan === 'approved');
          } else if (filter === 'rejected') {
            data = data.filter(p => p.status_permohonan === 'rejected');
          }
        }

        setPermintaan(data);
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
      setLoading(true);
      await API.patch(`/permintaan-sayas/${permintaanId}/approve`);
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
      await API.patch(`/permintaan-sayas/${permintaanId}/reject`);
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
      await API.patch(`/permintaan-sayas/${permintaanId}/sent`);
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
                          (p.image || p.donation?.image)?.startsWith('data:')
                            ? (p.image || p.donation.image)
                            : (p.image || p.donation?.image)?.startsWith('http')
                              ? (p.image || p.donation.image)
                              : (p.image || p.donation?.image)?.startsWith('storage/')
                                ? `http://localhost:8000/${p.image || p.donation.image}`
                                : `http://localhost:8000/storage/${p.image || p.donation.image}`
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
                      style={{ display: p.image ? 'none' : 'flex' }}
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
                      <span>{p.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-green-500" />
                      <span>Jumlah: {p.target_jumlah}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status_permohonan === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : p.status_permohonan === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {p.status_permohonan === 'pending' ? '⏳ Menunggu' : p.status_permohonan === 'approved' ? '✓ Disetujui' : '✕ Ditolak'}
                    </span>
                    {p.status_permohonan === 'approved' && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status_pengiriman === 'draft'
                          ? 'bg-blue-100 text-blue-700'
                          : p.status_pengiriman === 'sent'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                          }`}
                      >
                        {p.status_pengiriman === 'draft' ? '📦 Disiapkan' : p.status_pengiriman === 'sent' ? '🚚 Dikirim' : '📍 Diterima'}
                      </span>
                    )}
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
              {/* Image Display */}
              {(selectedPermintaan.image || selectedPermintaan.donation?.image) && (
                <div className="flex justify-center">
                  <img
                    src={
                      (selectedPermintaan.image || selectedPermintaan.donation?.image)?.startsWith('data:')
                        ? (selectedPermintaan.image || selectedPermintaan.donation.image)
                        : (selectedPermintaan.image || selectedPermintaan.donation?.image)?.startsWith('http')
                          ? (selectedPermintaan.image || selectedPermintaan.donation.image)
                          : (selectedPermintaan.image || selectedPermintaan.donation?.image)?.startsWith('storage/')
                            ? `http://localhost:8000/${selectedPermintaan.image || selectedPermintaan.donation.image}`
                            : `http://localhost:8000/storage/${selectedPermintaan.image || selectedPermintaan.donation.image}`
                    }
                    alt={selectedPermintaan.judul}
                    className="max-w-sm max-h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Info Utama */}
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FiPackage className="text-blue-500" />
                  {selectedPermintaan.judul} (Penerima: {selectedPermintaan.user?.name})
                </h3>
                <p className="text-gray-600">{selectedPermintaan.deskripsi}</p>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                    <FiMapPin /> Alamat Tujuan (Penerima)
                  </div>
                  <p>{selectedPermintaan.lokasi}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">
                    <FiPackage /> Jumlah Target
                  </div>
                  <p>{selectedPermintaan.target_jumlah}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-600 font-semibold mb-1">
                    <FiPackage /> Kategori
                  </div>
                  <p className="capitalize">{selectedPermintaan.kategori}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600 font-semibold mb-1">
                    <FiClock /> Status Permohonan
                  </div>
                  <p className="capitalize font-semibold text-purple-700">
                    {selectedPermintaan.status_permohonan === 'pending' ? '⏳ Menunggu Persetujuan' : selectedPermintaan.status_permohonan === 'approved' ? '✓ Disetujui' : '✕ Ditolak'}
                  </p>
                  {selectedPermintaan.approved_at && (
                    <p className="text-sm text-gray-500 mt-1">Disetujui: {new Date(selectedPermintaan.approved_at).toLocaleDateString('id-ID')}</p>
                  )}
                </div>

                {selectedPermintaan.status_permohonan === 'approved' && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-pink-600 font-semibold mb-1">
                      <FiTruck /> Status Pengiriman
                    </div>
                    <p className="capitalize font-semibold text-pink-700">
                      {selectedPermintaan.status_pengiriman === 'draft' ? '📦 Disiapkan' : selectedPermintaan.status_pengiriman === 'sent' ? '🚚 Dikirim' : '📍 Diterima'}
                    </p>
                    {selectedPermintaan.sent_at && (
                      <p className="text-sm text-gray-500 mt-1">Dikirim: {new Date(selectedPermintaan.sent_at).toLocaleDateString('id-ID')}</p>
                    )}
                    {selectedPermintaan.received_at && (
                      <p className="text-sm text-gray-500 mt-1">Diterima: {new Date(selectedPermintaan.received_at).toLocaleDateString('id-ID')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Bukti Kebutuhan - Gambar atau Teks */}
              <div>
                <h4 className="font-bold mb-2">Bukti Kebutuhan</h4>

                {/* Jika ada file bukti kebutuhan (upload image) */}
                {selectedPermintaan.bukti_kebutuhan && (
                  <img
                    src={`http://localhost:8000/${selectedPermintaan.bukti_kebutuhan}`}
                    alt="Bukti Kebutuhan"
                    className="w-full max-h-80 object-cover rounded-lg mb-3"
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Jika ada gambar dari donasi (fallback) */}
                {!selectedPermintaan.bukti_kebutuhan && selectedPermintaan.image && (
                  <img
                    src={`http://localhost:8000/${selectedPermintaan.image}`}
                    alt="Gambar Barang"
                    className="w-full max-h-80 object-cover rounded-lg"
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Jika tidak ada keduanya */}
                {!selectedPermintaan.bukti_kebutuhan && !selectedPermintaan.image && (
                  <p className="text-gray-500 italic">Belum ada bukti kebutuhan yang diunggah</p>
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
              {selectedPermintaan.status_permohonan === 'approved' && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      // Close modal and navigate
                      setSelectedPermintaan(null);
                      // Navigate to chat
                      navigate('/donatur/chat', { state: { peerId: selectedPermintaan.user_id } });
                      // Wait, this component doesn't have useNavigate imported? Let's check imports.
                    }}
                    // It seems this component does not use useNavigate. I should add it.
                    className="w-full bg-blue-100 hover:bg-blue-200 text-[#00306C] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FiMessageSquare /> Chat Penerima
                  </button>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'approved' && selectedPermintaan.status_pengiriman === 'draft' && (
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    onClick={() => handleMarkSent(selectedPermintaan.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiTruck />} Tandai Sudah Dikirim
                  </button>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'approved' && selectedPermintaan.status_pengiriman === 'sent' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800">
                    ℹ️ Donasi sedang dalam perjalanan. Penerima akan mengkonfirmasi ketika sudah diterima.
                  </p>
                </div>
              )}

              {selectedPermintaan.status_permohonan === 'approved' && selectedPermintaan.status_pengiriman === 'received' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800">
                    ✓ Donasi telah diterima oleh penerima.
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
