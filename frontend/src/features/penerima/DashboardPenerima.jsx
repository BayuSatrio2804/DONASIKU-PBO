import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCalendar, FiSearch, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import { getAllDonasi } from '../../services/donasiService';
import { getMyPermintaanSaya } from '../../services/permintaanService';

const DashboardPenerima = () => {
  const user = getAuthData();
  const navigate = useNavigate();

  const [allDonations, setAllDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]); // State for user's requests
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'pakaian', label: 'Pakaian' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'buku', label: 'Buku' },
    { value: 'mainan', label: 'Mainan' },
    { value: 'perabotan', label: 'Perabotan' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load donations and requests in parallel
        const [donasiList, permintaanList] = await Promise.all([
          getAllDonasi(),
          getMyPermintaanSaya()
        ]);

        console.log('All donations:', donasiList);
        console.log('My requests:', permintaanList);

        const availableDonations = donasiList.filter(d => d.status === 'aktif' && d.jumlah > 0);
        setAllDonations(availableDonations);
        setFilteredDonations(availableDonations);
        setMyRequests(permintaanList);

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = allDonations;

    if (category !== 'all') {
      result = result.filter(d => d.kategori?.toLowerCase() === category.toLowerCase());
    }

    if (searchTerm) {
      result = result.filter(d =>
        d.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDonations(result);
  }, [searchTerm, category, allDonations]);

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

  const getStatusBadge = (req) => {
    // Priority: Received -> Sent -> Approved (Fulfilled) -> Pending -> Rejected
    if (req.status_pengiriman === 'received') {
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiCheckCircle /> Diterima</span>;
    }
    if (req.status_pengiriman === 'sent') {
      return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiPackage /> Dikirim</span>;
    }
    if (req.status_permohonan === 'approved') {
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiCheckCircle /> Disetujui</span>;
    }
    if (req.status_permohonan === 'rejected') {
      return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiAlertCircle /> Ditolak</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiClock /> Menunggu</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-xl text-white/80">
              Temukan dan ajukan donasi yang Anda butuhkan
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari donasi berdasarkan nama, deskripsi, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 border-2 border-transparent focus:border-white focus:ring-0"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">





        {/* SECTION: DAFTAR DONASI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Donasi Tersedia</h2>
            <p className="text-gray-600">Pilih donasi yang paling sesuai dengan kebutuhan Anda</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/penerima/ajukan-permintaan')}
              className="bg-white text-[#00306C] border font-bold px-6 py-3 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
            >
              <FiPackage /> Ajukan Permintaan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-2 shadow-md">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${category === cat.value
                ? 'bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Donasi Tidak Ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                  {donation.image ? (
                    <img
                      src={
                        donation.image.startsWith('http') || donation.image.startsWith('data:')
                          ? donation.image
                          : donation.image.startsWith('storage/')
                            ? `http://localhost:8000/${donation.image}`
                            : `http://localhost:8000/storage/${donation.image}`
                      }
                      alt={donation.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(donation.kategori)}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                      {getCategoryIcon(donation.kategori)} {donation.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {donation.nama}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {donation.deskripsi}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiPackage className="text-[#007EFF]" />
                        <span>Jumlah: <span className="font-semibold">{donation.jumlah} pcs</span></span>
                      </div>
                      {donation.jumlah <= 0 ? (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                          Habis
                        </span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                          Tersedia
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiMapPin className="text-[#007EFF]" />
                      <span className="line-clamp-1">{donation.lokasi}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#007EFF]" />
                      <span>{donation.createdAt ? new Date(donation.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => donation.jumlah > 0 && navigate(`/donasi/detail/${donation.id}`)}
                      disabled={donation.jumlah <= 0}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 font-semibold rounded-xl transition-all ${donation.jumlah <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white hover:shadow-xl hover:shadow-[#007EFF]/30 hover:scale-105'
                        }`}
                    >
                      <span>{donation.jumlah <= 0 ? 'Donasi Habis' : 'Lihat Detail & Ajukan'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION: PERMINTAAN SAYA (ACTIVE) */}
        {myRequests.filter(req => !['received', 'rejected'].includes(req.status_pengiriman) && req.status_permohonan !== 'rejected').length > 0 && (
          <div className="mb-12 mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Permintaan Saya</h2>
                <p className="text-gray-600">Status permintaan yang sedang berjalan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.filter(req => !['received', 'rejected'].includes(req.status_pengiriman) && req.status_permohonan !== 'rejected').map((req) => (
                <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 bg-gray-100 relative">
                    {req.image ? (
                      <img
                        src={
                          req.image.startsWith('http') || req.image.startsWith('data:')
                            ? req.image
                            : req.image.startsWith('storage/')
                              ? `http://localhost:8000/${req.image}`
                              : `http://localhost:8000/storage/${req.image}`
                        }
                        alt={req.judul}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getCategoryIcon(req.kategori)}
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(req)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1 truncate">{req.judul}</h3>
                    <p className="text-sm text-gray-500 mb-3 truncate">{req.deskripsi}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        Target: {req.target_jumlah} Pcs
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {req.status_pengiriman === 'sent' && (
                      <button
                        onClick={() => navigate('/penerima/konfirmasi-terima/' + req.id)}
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                      >
                        Konfirmasi Terima
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: RIWAYAT PERMINTAAN (COMPLETED/REJECTED) */}
        {myRequests.filter(req => ['received'].includes(req.status_pengiriman) || req.status_permohonan === 'rejected').length > 0 && (
          <div className="mb-12 mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Permintaan Selesai</h2>
                <p className="text-gray-600">Permintaan yang sudah diterima atau ditolak</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.filter(req => ['received'].includes(req.status_pengiriman) || req.status_permohonan === 'rejected').map((req) => (
                <div key={req.id} className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all opacity-80 hover:opacity-100">
                  <div className="h-40 bg-gray-200 relative grayscale">
                    {req.image ? (
                      <img
                        src={
                          req.image.startsWith('http') || req.image.startsWith('data:')
                            ? req.image
                            : req.image.startsWith('storage/')
                              ? `http://localhost:8000/${req.image}`
                              : `http://localhost:8000/storage/${req.image}`
                        }
                        alt={req.judul}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getCategoryIcon(req.kategori)}
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(req)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-700 mb-1 truncate">{req.judul}</h3>
                    <p className="text-sm text-gray-500 mb-3 truncate">{req.deskripsi}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                        Target: {req.target_jumlah} Pcs
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPenerima;