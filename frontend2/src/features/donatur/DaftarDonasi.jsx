import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDonasi, clearDonasiCache, deleteDonasiService } from "../../services/donasiService";
import { FiEdit2, FiPackage, FiMapPin, FiCalendar, FiAlertCircle, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { showConfirm, showSuccess, showError } from "../../utils/sweetalert";

const DaftarDonasi = () => {
  const [donasi, setDonasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDonasi = async () => {
    try {
      setLoading(true);
      const data = await getMyDonasi();
      setDonasi(data);
    } catch (error) {
      console.error("Gagal mengambil data donasi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear cache saat component mount untuk memastikan data terbaru
    clearDonasiCache();
    fetchDonasi();
  }, []);

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

  const handleDelete = async (id) => {
    const result = await showConfirm(
      "Hapus Donasi?",
      "Apakah Anda yakin ingin menghapus donasi ini? Data yang dihapus tidak dapat dikembalikan.",
      "Ya, Hapus",
      "Batal"
    );

    if (result.isConfirmed) {
      try {
        await deleteDonasiService(id);
        await showSuccess("Berhasil", "Donasi berhasil dihapus");
        // Refresh list
        clearDonasiCache();
        fetchDonasi();
      } catch (error) {
        showError("Gagal", error.message || "Gagal menghapus donasi");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Memuat data donasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Daftar Donasi Saya</h1>
        <button
          onClick={() => {
            clearDonasiCache();
            fetchDonasi();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          title="Refresh data donasi"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {donasi.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Donasi</h3>
          <p className="text-gray-600">Anda belum memiliki donasi yang aktif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donasi.map((item) => (
            <div key={item.id || item.donasiId} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                {item.image ? (
                  <img
                    src={item.image.startsWith('data:') || item.image.startsWith('http') ? item.image : `http://localhost:8081/storage/${item.image}`}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {getCategoryIcon(item.kategori)}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                    {getCategoryIcon(item.kategori)} {item.kategori}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg mt-2">{item.nama}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{item.deskripsi || "-"}</p>

                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiPackage className="text-[#007EFF]" />
                      <span>Jumlah: <span className="font-semibold">{item.jumlah} pcs</span></span>
                    </div>
                    {item.jumlah <= 0 ? (
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                        Habis
                      </span>
                    ) : item.jumlah < 5 ? (
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                        Terbatas
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        Tersedia
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiMapPin className="text-[#007EFF]" />
                    <span className="line-clamp-1">{item.lokasi?.alamatLengkap || item.lokasi || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiCalendar className="text-[#007EFF]" />
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-[#007EFF] font-semibold rounded-xl hover:bg-blue-100 transition-all"
                    onClick={() => navigate(`/donasi/edit/${item.id || item.donasiId}`)}
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all"
                    onClick={() => handleDelete(item.id || item.donasiId)}
                  >
                    <FiTrash2 />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarDonasi;