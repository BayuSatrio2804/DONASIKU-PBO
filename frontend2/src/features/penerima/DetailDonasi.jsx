import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// --- SAYA PERBAIKI JALUR IMPORT DI BAWAH INI ---
import { getDonasiByIdService } from '../../services/donasiService.js';
import { FiArrowLeft, FiPackage, FiMapPin, FiCalendar, FiUser, FiFileText, FiAlertCircle, FiLoader, FiInbox } from 'react-icons/fi';
import { extractNamaBarang, getLokasiString, getImageUrl } from '../../utils/backendHelpers';

const DetailDonasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donasi, setDonasi] = useState(null);
  const [donatur, setDonatur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonasi = async () => {
      try {
        setLoading(true);
        const donasiData = await getDonasiByIdService(id);

        // Backend returns statusDonasi object with status field, or may not have status at all for new donations
        // Accept: undefined (new), 'Tersedia', 'aktif', or any status that isn't 'Selesai' or 'Dibatalkan'
        const statusValue = donasiData.statusDonasi?.status || donasiData.status || 'aktif';
        const unavailableStatuses = ['Selesai', 'Dibatalkan', 'selesai', 'dibatalkan'];

        if (unavailableStatuses.includes(statusValue)) {
          setError('Donasi ini sudah tidak tersedia.');
        } else {
          setDonasi(donasiData);
          setDonatur(donasiData.donatur);
        }

      } catch (err) {
        setError(err.message || 'Gagal memuat detail donasi.');
      }
      setLoading(false);
    };

    fetchDonasi();
  }, [id]);

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

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    return `http://localhost:8081/storage/${photoPath}`;
  };


  const handleAjukan = () => {
    // Navigate to permintaan form for this donasi
    navigate(`/penerima/permintaan-saya/${id}`);
  };



  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader className="text-4xl text-[#007EFF] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="text-5xl text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{error}</h3>
        <p className="text-gray-600 mb-6">Donasi yang Anda cari mungkin sudah diambil atau dihapus.</p>
        <button
          onClick={() => navigate('/dashboard-penerima')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white font-bold rounded-xl hover:shadow-xl transition-all"
        >
          <FiArrowLeft />
          <span>Kembali ke Pencarian</span>
        </button>
      </div>
    );
  }

  if (!donasi) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="inline-flex items-center space-x-2 text-gray-700 font-semibold hover:text-[#00306C] transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Kolom Gambar */}
          <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-blue-100 to-cyan-100">
            {(donasi.image || donasi.foto) ? (
              <img
                src={getPhotoUrl(donasi.image || donasi.foto)}
                alt={donasi.nama || 'Donasi'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-50">
                {getCategoryIcon(donasi.kategori)}
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-[#00306C] flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(donasi.kategori)}</span>
                <span>{donasi.kategori}</span>
              </span>
            </div>
          </div>

          {/* Kolom Info */}
          <div className="p-8 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{donasi.nama}</h1>

            <div className="mb-6">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-[#00306C]">
                <span>🔵</span>
                <span>Tersedia (Aktif)</span>
              </span>
            </div>

            {/* Info Donatur */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <label className="text-sm font-bold text-gray-900 mb-2 block">Donatur:</label>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00306C] to-[#001F4D] rounded-full flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  {donatur?.photo ? (
                    <img
                      src={getPhotoUrl(donatur.photo)}
                      alt={donatur.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">{donatur?.name?.charAt(0).toUpperCase() || 'D'}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{donatur?.name || 'Donatur'}</div>
                  <div className="text-xs text-gray-600">Terverifikasi</div>
                </div>
              </div>
            </div>

            {/* Detail Barang */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3 text-gray-700">
                <FiPackage className="text-[#00306C] text-xl flex-shrink-0 mt-1" />
                <span>Jumlah: <span className="font-semibold">{donasi.jumlah} pcs</span></span>
              </div>
              <div className="flex items-start space-x-3 text-gray-700">
                <FiMapPin className="text-[#00306C] text-xl flex-shrink-0 mt-1" />
                <span>Lokasi: <span className="font-semibold">{donasi.lokasi?.alamatLengkap || donasi.lokasi || '-'}</span></span>
              </div>
              <div className="flex items-start space-x-3 text-gray-700">
                <FiCalendar className="text-[#00306C] text-xl flex-shrink-0 mt-1" />
                <span>Di-posting: <span className="font-semibold">{new Date(donasi.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}</span></span>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-8">
              <h3 className="flex items-center space-x-2 text-lg font-bold text-gray-900 mb-3">
                <FiFileText />
                <span>Deskripsi Barang</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {donasi.deskripsi}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-auto">
              <button
                onClick={handleAjukan}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#00306C]/30 transition-all hover:scale-[1.03]"
              >
                <FiInbox className="text-xl" />
                <span>Ajukan Permintaan Donasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDonasi;