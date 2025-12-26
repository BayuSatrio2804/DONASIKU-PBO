import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiPackage, FiClock, FiCheckCircle, FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import { getLokasiString, extractNamaBarang, extractDeskripsi, getImageUrl } from '../../utils/backendHelpers';
import { getMyDonasi, deleteDonasiService } from '../../services/donasiService';
import { getAllPermintaan } from '../../services/permintaanService';
import FulfillmentModal from '../../components/FulfillmentModal';
import { showSuccess, showError, showConfirm } from '../../utils/sweetalert';

const DashboardDonatur = () => {
  const navigate = useNavigate();
  const user = getAuthData();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [requests, setRequests] = useState([]); // Public requests
  const [incomingRequests, setIncomingRequests] = useState([]); // Direct requests for me
  const [fulfilledRequests, setFulfilledRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [userDonations, allRequests] = await Promise.all([
          getMyDonasi(),
          getAllPermintaan()
        ]);

        // Filter requests: show only pending ones (not yet fulfilled/rejected)
        const pendingRequests = allRequests.filter(r =>
          (r.status_permohonan === 'pending' || r.status_permohonan === 'Open' || !r.status_permohonan) &&
          !r.donation && !r.donation_id && !r.donatur // Must NOT have a target donation or donor
        );

        // Filter direct requests targeted to me
        const myDirectRequests = allRequests.filter(r => {
          const donaturId = r.donatur?.userId || r.donatur?.id;
          const isTargetedToMe = String(donaturId) === String(user.id || user.userId);
          return isTargetedToMe && (r.status_permohonan === 'pending' || r.status_permohonan === 'Open' || !r.status_permohonan);
        });

        const fulfilledReqs = allRequests.filter(r => {
          const donaturId = r.donatur?.userId || r.donatur?.id;
          const isMyFulfillment = String(donaturId) === String(user.id || user.userId);
          return isMyFulfillment &&
            (r.status_permohonan === 'approved' || r.status_permohonan === 'fulfilled' || r.status_permohonan === 'sent' || r.status_pengiriman === 'sent') &&
            r.status_permohonan !== 'received' && r.status_pengiriman !== 'received';
        });

        setRequests(pendingRequests);
        setIncomingRequests(myDirectRequests);
        setFulfilledRequests(fulfilledReqs);

        // Filter active donations: only show status 'aktif'/'available'/'tersedia' AND stock > 0
        const activeDonations = userDonations.filter(d => {
          const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
          return (status === 'aktif' || status === 'available' || status === 'tersedia') && d.jumlah > 0;
        });

        setDonations(activeDonations);

        setStats({
          total: userDonations.length,
          active: activeDonations.length,
          completed: userDonations.filter(d => {
            const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
            return status === 'selesai' || d.jumlah <= 0;
          }).length
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);




  const handleDelete = async (id) => {
    if (deleting) return;

    const result = await showConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus donasi ini?');
    if (!result.isConfirmed) return;

    setDeleting(true);
    try {
      await deleteDonasiService(id);
      await showSuccess('Berhasil', 'Donasi berhasil dihapus!');

      const userDonations = await getMyDonasi();
      const activeDonations = userDonations.filter(d => {
        const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
        return (status === 'aktif' || status === 'available' || status === 'tersedia') && d.jumlah > 0;
      });
      setDonations(activeDonations);
      setStats({
        total: userDonations.length,
        active: activeDonations.length,
        completed: userDonations.filter(d => {
          const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
          return status === 'selesai' || d.jumlah <= 0;
        }).length
      });
    } catch (error) {
      showError('Gagal', error.message || 'Gagal menghapus donasi');
    } finally {
      setDeleting(false);
    }
  };

  const filteredDonations = donations; // Already filtered in loadData/useEffect

  const getStatusBadge = (status) => {
    const badges = {
      'aktif': { bg: 'bg-green-100', text: 'text-green-700', label: 'Aktif', icon: <FiClock /> },
      'selesai': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Selesai', icon: <FiCheckCircle /> }
    };
    const badge = badges[status] || badges['aktif'];
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        <span>{badge.label}</span>
      </span>
    );
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Memuat donasi...</p>
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
              Selamat Datang, {user?.name}!
            </h1>
            <p className="text-xl text-white/80">
              Kelola donasi Anda dan lihat dampak kebaikan yang telah Anda buat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-3xl" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{stats.total}</div>
                  <div className="text-white/80 text-sm font-medium">Total Donasi</div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <FiClock className="text-3xl text-green-300" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{stats.active}</div>
                  <div className="text-white/80 text-sm font-medium">Donasi Aktif</div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="text-3xl text-blue-300" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{stats.completed}</div>
                  <div className="text-white/80 text-sm font-medium">Donasi Selesai</div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {/* SECTION: DAFTAR DONASI SAYA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Donasi Saya</h2>
            <p className="text-gray-600">Kelola dan pantau semua donasi Anda</p>
          </div>
          <Link
            to="/donasi/buat"
            className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#007EFF]/30 transition-all hover:scale-105"
          >
            <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
            <span>Buat Donasi Baru</span>
          </Link>
        </div>

        <div className="flex space-x-2 mb-6">
          <div className="bg-white rounded-xl p-2 shadow-md inline-flex">
            <div className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white shadow-lg">
              Donasi Aktif ({stats.active})
            </div>
          </div>
          <Link
            to="/donatur/riwayat"
            className="px-6 py-4 bg-white rounded-xl shadow-md text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <FiClock /> Lihat Riwayat ({stats.completed})
          </Link>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Donasi</h3>
            <p className="text-gray-600 mb-6">Mulai berbagi kebaikan dengan membuat donasi pertama Anda</p>
            <Link
              to="/donasi/buat"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl transition-all"
            >
              <FiPlus className="text-xl" />
              <span>Buat Donasi Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id || donation.donasiId}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                  {donation.image ? (
                    <img
                      src={
                        donation.image.startsWith('http') || donation.image.startsWith('data:')
                          ? donation.image
                          : donation.image.startsWith('storage/')
                            ? `http://localhost:8080/${donation.image}`
                            : `http://localhost:8080/storage/${donation.image}`
                      }
                      alt={extractNamaBarang(donation)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(donation.kategori)}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(donation.status)}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                      {getCategoryIcon(donation.kategori)} {donation.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {extractNamaBarang(donation)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {donation.deskripsi}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiPackage className="text-[#007EFF]" />
                      <span>Jumlah: <span className="font-semibold">{donation.jumlah} pcs</span></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiMapPin className="text-[#007EFF]" />
                      <span className="line-clamp-1">{getLokasiString(donation.lokasi)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#007EFF]" />
                      <span>{donation.created_at || donation.createdAt ? new Date(donation.created_at || donation.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/donasi/edit/${donation.id || donation.donasiId}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-[#007EFF] font-semibold rounded-xl hover:bg-blue-100 transition-all"
                    >
                      <FiEdit2 />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(donation.id || donation.donasiId)}
                      disabled={deleting}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
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

        {/* SECTION: PERMINTAAN MASUK (Direct Requests for My Donations) */}
        {incomingRequests.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FiPackage className="text-2xl text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Permintaan Masuk</h2>
                <p className="text-gray-600">Penerima yang meminta barang donasi Anda secara langsung</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incomingRequests.map(req => (
                <div
                  key={req.id}
                  onClick={() => navigate(`/donatur/permintaan/${req.id}`)}
                  className="bg-white border-2 border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer"
                >
                  <div className="h-48 w-full bg-indigo-50 relative overflow-hidden">
                    {req.donation?.image || req.image ? (
                      <img
                        src={getImageUrl(req.donation?.image || req.image)}
                        alt={req.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="text-6xl text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Permintaan Langsung
                      </span>
                    </div>
                  </div>

                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{req.judul}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{req.deskripsi}</p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiPackage className="text-indigo-500" />
                        <span className="font-semibold">{req.jumlah || req.target_jumlah} Pcs Diminta</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="text-indigo-500" />
                        <span className="truncate">{getLokasiString(req.lokasi)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                          setShowFulfillmentModal(true);
                        }}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle /> Setujui
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PERMINTAAN KEBUTUHAN (Open Requests) */}
        {requests.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FiAlertCircle className="text-2xl text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Permintaan Penerima</h2>
                <p className="text-gray-600">Bantu mereka yang sedang membutuhkan barang-barang ini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => (
                <div
                  key={req.id}
                  onClick={() => navigate(`/donatur/permintaan/${req.id}`)}
                  className="bg-white border border-yellow-100 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
                >
                  <div className="h-48 w-full bg-yellow-50 relative overflow-hidden">
                    {req.image ? (
                      <img
                        src={
                          req.image.startsWith('http') || req.image.startsWith('data:')
                            ? req.image
                            : req.image.startsWith('storage/')
                              ? `http://localhost:8080/${req.image}`
                              : `http://localhost:8080/storage/${req.image}`
                        }
                        alt={req.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="text-6xl text-yellow-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-700 shadow-sm">
                        {req.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{req.judul}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{req.deskripsi}</p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiPackage className="text-yellow-500" />
                        <span className="font-semibold">{req.jumlah || req.target_jumlah} Pcs Dibutuhkan</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="text-yellow-500" />
                        <span className="truncate">{getLokasiString(req.lokasi)}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        setSelectedRequest(req);
                        setShowFulfillmentModal(true);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle /> Bantu Penuhi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showFulfillmentModal && selectedRequest && (
        <FulfillmentModal
          request={selectedRequest}
          onClose={() => setShowFulfillmentModal(false)}
          onSuccess={() => {
            // Refresh data
            setLoading(true);
            Promise.all([getMyDonasi(), getAllPermintaan()])
              .then(([userDonations, allRequests]) => {
                const activeDonations = userDonations.filter(d => {
                  const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
                  return (status === 'aktif' || status === 'available' || status === 'tersedia') && d.jumlah > 0;
                });
                const pendingRequests = allRequests.filter(r =>
                  (r.status_permohonan === 'pending' || r.status_permohonan === 'Open' || !r.status_permohonan) &&
                  !r.donation && !r.donation_id && !r.donatur
                );
                const myDirectRequests = allRequests.filter(r => {
                  const donaturId = r.donatur?.userId || r.donatur?.id;
                  const isTargetedToMe = String(donaturId) === String(user.id || user.userId);
                  return isTargetedToMe && (r.status_permohonan === 'pending' || r.status_permohonan === 'Open' || !r.status_permohonan);
                });
                const fulfilledReqs = allRequests.filter(r => {
                  const donaturId = r.donatur?.userId || r.donatur?.id;
                  const isMyFulfillment = String(donaturId) === String(user.id || user.userId);
                  return isMyFulfillment &&
                    (r.status_permohonan === 'approved' || r.status_permohonan === 'fulfilled' || r.status_permohonan === 'sent' || r.status_pengiriman === 'sent') &&
                    r.status_permohonan !== 'received' && r.status_pengiriman !== 'received';
                });

                setDonations(activeDonations);
                setRequests(pendingRequests);
                setIncomingRequests(myDirectRequests);
                setFulfilledRequests(fulfilledReqs);

                setStats({
                  total: userDonations.length,
                  active: activeDonations.length,
                  completed: userDonations.filter(d => {
                    const status = (d.statusDonasi?.status || d.status || "").toLowerCase();
                    return status === 'selesai' || d.jumlah <= 0;
                  }).length
                });
                setLoading(false);
              });
          }}
        />
      )}
    </div>
  );
};

export default DashboardDonatur;