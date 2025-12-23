import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiUser, FiX, FiTruck } from 'react-icons/fi';
import { getAuthData, getUserRole } from '../../utils/localStorage';
import { getAllDonasi } from '../../services/donasiService';
import { getMyPermintaanSaya } from '../../services/permintaanService';
import API, { detailDonasiAPI } from '../../services/api';

const Riwayat = () => {
  const user = getAuthData();
  const role = getUserRole();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const [permintaanList, detailDonasiResponse] = await Promise.all([
          getMyPermintaanSaya(),
          detailDonasiAPI.getAll()
        ]);

        const detailDonasiList = detailDonasiResponse.data?.data || [];

        if (role === 'donatur') {
          // 1. Get traditional donations that are finished
          const allDonasi = await getAllDonasi();
          const myDonations = allDonasi.filter(
            d => d.user_id === user.id && d.status === 'selesai'
          ).map(d => ({
            ...d,
            sourceType: 'donasi_manual',
            donatur_name: user.name, // Self
            updatedAt: d.updated_at
          }));

          // 2. Get fulfilled requests that are received
          const fulfilledHistory = permintaanList.filter(
            req => req.donation?.user_id === user.id && req.status_pengiriman === 'received'
          ).map(req => ({
            ...req,
            nama: req.judul,
            jumlah: req.target_jumlah,
            updated_at: req.received_at || req.updated_at,
            updatedAt: req.received_at || req.updated_at,
            displayStatus: 'completed',
            sourceType: 'permintaan_terpenuhi',
            donatur_name: user.name, // Self as donatur
            penerima_name: req.user?.name || 'Penerima'
          }));

          setHistoryItems([...myDonations, ...fulfilledHistory]);
        } else if (role === 'penerima') {
          // Normalize items from PermintaanSaya
          const historyFromPermintaan = permintaanList.filter(
            req => req.status_pengiriman === 'received' || req.status_permohonan === 'rejected' || req.status === 'terpenuhi'
          ).map(req => ({
            ...req,
            nama: req.judul,
            jumlah: req.target_jumlah,
            displayStatus: (req.status_pengiriman === 'received' || req.status === 'terpenuhi') ? 'completed' : 'rejected',
            updatedAt: req.received_at || req.updated_at,
            // Extra details for modal
            deskripsi: req.deskripsi,
            lokasi: req.lokasi,
            donatur_name: req.donation?.donatur?.name || req.donation?.user?.name || 'Donatur',
            tanggal_disetujui: req.approved_at,
            tanggal_dikirim: req.sent_at,
            tanggal_diterima: req.received_at
          }));

          // Normalize items from DetailDonasi (Accepted donations)
          const historyFromDetail = detailDonasiList.filter(
            dd => dd.status_penerimaan === 'received' || dd.status_penerimaan === 'completed' || dd.status_penerimaan === 'selesai'
          ).map(dd => ({
            ...dd,
            nama: dd.donation?.nama || 'Donasi',
            jumlah: dd.jumlah || 1,
            kategori: dd.donation?.kategori || 'lainnya',
            image: dd.donation?.image,
            displayStatus: 'completed',
            updatedAt: dd.updated_at || dd.created_at,
            // Extra details
            deskripsi: dd.donation?.deskripsi,
            lokasi: dd.donation?.lokasi,
            donatur_name: dd.donation?.user?.name || 'Donatur',
            // Estimasi tanggal (backfill if missing)
            tanggal_disetujui: dd.created_at,
            tanggal_dikirim: dd.updated_at, // Asumsi
            tanggal_diterima: dd.updated_at
          }));

          const merged = [...historyFromPermintaan, ...historyFromDetail].sort((a, b) =>
            new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at)
          );

          setHistoryItems(merged);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      }
      setLoading(false);
    };

    loadHistory();
  }, [role, user.id]);

  const getCategoryIcon = (category) => {
    const icons = {
      'pakaian': '👕',
      'elektronik': '💻',
      'buku': '📚',
      'mainan': '🧸',
      'perabotan': '🛋️',
      'lainnya': '📦'
    };
    return icons[category?.toLowerCase()] || '📦';
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Stats Calculations
  const totalSelesai = historyItems.filter(item => item.displayStatus === 'completed' || item.status === 'selesai').length;
  const totalItem = historyItems.reduce((sum, item) => sum + (parseInt(item.jumlah) || 0), 0);
  const totalDitolak = historyItems.filter(item => item.displayStatus === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <FiClock className="inline-block mb-2 mr-3" />
            Riwayat {role === 'donatur' ? 'Donasi' : 'Penerimaan'}
          </h1>
          <p className="text-xl text-white/80">
            Daftar semua transaksi yang telah Anda selesaikan.
          </p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {/* Statistics Section (Only show if there is data) */}
        {!loading && historyItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">Total Transaksi Selesai</p>
                <h3 className="text-3xl font-bold text-[#00306C] mt-2">{totalSelesai}</h3>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                <FiCheckCircle />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">Total Ditolak</p>
                <h3 className="text-3xl font-bold text-red-600 mt-2">{totalDitolak}</h3>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl">
                <FiX />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">{role === 'donatur' ? 'Total Item Didonasikan' : 'Total Permintaan Barang'}</p>
                <h3 className="text-3xl font-bold text-[#00306C] mt-2">{totalItem}</h3>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                <FiPackage />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Memuat riwayat...</p>
          </div>
        )}

        {!loading && historyItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600 mb-6">
              {role === 'donatur'
                ? 'Anda belum memiliki donasi yang berstatus "Selesai".'
                : 'Anda belum memiliki riwayat penerimaan yang sudah selesai.'}
            </p>
            {role === 'penerima' && (
              <Link
                to="/penerima/permintaan-saya"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <span>Lihat Permintaan Saya</span>
              </Link>
            )}
          </div>
        )}

        {!loading && historyItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={
                        item.image.startsWith('http') || item.image.startsWith('data:')
                          ? item.image
                          : item.image.startsWith('storage/')
                            ? `http://localhost:8000/${item.image}`
                            : `http://localhost:8000/storage/${item.image}`
                      }
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                      {getCategoryIcon(item.kategori)}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-gray-100">
                      {getCategoryIcon(item.kategori)} {item.kategori || 'Umum'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${(item.displayStatus === 'completed' || item.status === 'selesai' || item.status === 'terpenuhi') ? 'bg-green-100 text-green-700' :
                      item.displayStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {(item.displayStatus === 'completed' || item.status === 'selesai' || item.status === 'terpenuhi') ? <FiCheckCircle /> : <FiAlertCircle />}
                      <span>
                        {(item.displayStatus === 'completed' || item.status === 'selesai' || item.status === 'terpenuhi') ? 'Selesai' :
                          item.displayStatus === 'rejected' ? 'Ditolak' :
                            'Proses'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.nama}
                  </h3>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <FiPackage className="text-[#007EFF]" />
                      <span>Jumlah: <span className="font-bold text-gray-800">{item.jumlah} pcs</span></span>
                    </div>
                    {item.lokasi && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
                        <FiMapPin className="text-[#007EFF] flex-shrink-0" />
                        <span className="line-clamp-1">{item.lokasi}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
                      <FiCalendar className="text-[#007EFF] flex-shrink-0" />
                      <span>{new Date(item.updatedAt || item.updated_at || item.createdAt || item.created_at || Date.now()).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#00306C] text-white font-bold rounded-xl hover:bg-[#001F4D] transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <FiClock />
                      <span>Lihat Detail Riwayat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#00306C] to-[#0063FF] p-6 text-white flex justify-between items-start sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedItem.nama}</h2>
                <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
                  <FiPackage /> {selectedItem.kategori || 'Donasi'} • {selectedItem.jumlah} Item
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Image */}
              {selectedItem.image && (
                <div className="rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200">
                  <img
                    src={
                      selectedItem.image.startsWith('http') || selectedItem.image.startsWith('data:')
                        ? selectedItem.image
                        : selectedItem.image.startsWith('storage/')
                          ? `http://localhost:8000/${selectedItem.image}`
                          : `http://localhost:8000/storage/${selectedItem.image}`
                    }
                    alt={selectedItem.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-[#00306C] mb-2 flex items-center gap-2">
                  <FiAlertCircle /> Deskripsi
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedItem.deskripsi || "Tidak ada deskripsi tambahan."}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Donatur</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-[#007EFF]" />
                    {selectedItem.donatur_name || 'Hamba Allah'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Lokasi</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiMapPin className="text-[#007EFF]" />
                    <span className="truncate">{selectedItem.lokasi || '-'}</span>
                  </p>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 mb-4">Jejak Waktu</h4>
                <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">

                  {/* Disetujui */}
                  {selectedItem.tanggal_disetujui && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                      <p className="text-xs text-gray-400 font-mono">
                        {new Date(selectedItem.tanggal_disetujui).toLocaleString('id-ID')}
                      </p>
                      <p className="font-bold text-gray-800">Permintaan Disetujui</p>
                      <p className="text-sm text-gray-500">Donatur menyetujui permintaan</p>
                    </div>
                  )}

                  {/* Dikirim */}
                  {selectedItem.tanggal_dikirim && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-sm" />
                      <p className="text-xs text-gray-400 font-mono">
                        {new Date(selectedItem.tanggal_dikirim).toLocaleString('id-ID')}
                      </p>
                      <p className="font-bold text-gray-800">Barang Dikirim</p>
                      <p className="text-sm text-gray-500">Donatur telah mengirim barang</p>
                    </div>
                  )}

                  {/* Diterima */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                    <p className="text-xs text-gray-400 font-mono">
                      {selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleString('id-ID') : '-'}
                    </p>
                    <p className="font-bold text-green-700">Selesai / Diterima</p>
                    <p className="text-sm text-gray-500">Transaksi selesai</p>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 text-center">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 font-semibold hover:text-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riwayat;