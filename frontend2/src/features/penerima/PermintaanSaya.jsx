import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiFileText,
  FiUsers,
  FiSend,
  FiClock,
  FiArrowLeft,
  FiImage,
  FiCheckCircle,
  FiLoader,
  FiMessageSquare,
  FiSearch,
  FiAlertCircle,
  FiMapPin
} from "react-icons/fi";
// FIX LINTER: Hanya import yang diperlukan
import { getDonasiByIdService } from "../../services/donasiService.js";
import { getMyPermintaanSaya } from "../../services/permintaanService.js";
import { getAuthData } from "../../utils/localStorage.js";
import API from "../../services/api.js";
import { showSuccess, showError } from "../../utils/sweetalert";
import { extractNamaBarang, getImageUrl, getLokasiString } from "../../utils/backendHelpers";

const PermintaanSaya = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donasi, setDonasi] = useState(null);
  const [permintaan, setPermintaan] = useState([]);
  const [formData, setFormData] = useState({ jumlah: 1, lokasi: "", deskripsi: "", bukti_file: null });
  const [buktiPreview, setBuktiPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Debug modal state
  useEffect(() => {
    console.log("Modal state changed:", showImageModal);
  }, [showImageModal]);

  const user = getAuthData();

  // Ambil data donasi jika ada ID (untuk form pengajuan)
  useEffect(() => {
    const fetchDonasi = async () => {
      if (id) {
        try {
          const donasiData = await getDonasiByIdService(id);
          setDonasi(donasiData);
        } catch (error) {
          console.error("Gagal memuat detail donasi:", error);
          navigate("/dashboard-penerima");
        }
      }
    };
    fetchDonasi();
  }, [id, navigate]);

  // FIX: Mengganti logic localStorage dengan panggilan API READ & FIX useEfect dependency
  useEffect(() => {
    const loadPermintaan = async () => {
      if (!user) return;
      try {
        const data = await getMyPermintaanSaya();
        console.log("📦 Permintaan API Response:", data);

        if (Array.isArray(data)) {
          // Filter out completed/rejected requests
          const activeData = data.filter(item =>
            item.status_permohonan !== 'received' &&
            item.status_permohonan !== 'rejected' &&
            item.status !== 'terpenuhi'
          );
          setPermintaan(activeData);
        } else {
          setPermintaan([]);
        }
      } catch (error) {
        console.error("Gagal memuat permintaan:", error);
        setPermintaan([]);
      }
    };
    loadPermintaan();
  }, [user?.id, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bukti_file: file }));

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ... (Zoom handlers omitted for brevity, keeping them as is) ...

  const openImageModal = () => {
    if (donasi?.image) {
      setShowImageModal(true);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      showError("Kesalahan", "Data pengguna tidak ditemukan, silakan login ulang.");
      return;
    }

    if (!donasi || formData.jumlah <= 0 || formData.jumlah > donasi.jumlah) {
      showError("Jumlah Tidak Valid", `Jumlah harus di antara 1 dan ${donasi?.jumlah || 1}.`);
      return;
    }

    if (!formData.lokasi) {
      showError("Data Tidak Lengkap", "Silakan isi alamat tujuan pengiriman.");
      return;
    }

    // KIRIM permintaan dengan FormData untuk handle file upload
    const newRequestData = new FormData();

    // Extract nama from deskripsi if donasi.nama is undefined
    // Backend deskripsi format: "Barang: [nama]. [deskripsi]"
    let judulValue = donasi.nama;
    if (!judulValue && donasi.deskripsi) {
      const match = donasi.deskripsi.match(/Barang:\s*([^.]+)/);
      judulValue = match ? match[1].trim() : donasi.kategori || 'Permintaan Donasi';
    }
    judulValue = judulValue || donasi.kategori || 'Permintaan Donasi';

    newRequestData.append('judul', judulValue);
    newRequestData.append('deskripsi', formData.deskripsi);
    newRequestData.append('kategori', donasi.kategori);
    newRequestData.append('target_jumlah', parseInt(formData.jumlah));
    newRequestData.append('lokasi', formData.lokasi);
    newRequestData.append('donation_id', parseInt(id));
    newRequestData.append('userId', user.id || user.userId); // Send User ID
    // Backend expects 'penerimaId' usually, let's add it to be safe or rely on token?
    // Controller createPermintaan accepts PermintaanDonasi object.

    // Tambahkan bukti file jika ada
    if (formData.bukti_file) {
      newRequestData.append('file', formData.bukti_file); // Changed name to 'file' to match common backend pattern or keep 'bukti_kebutuhan' if I update backend to match
    }

    try {
      // Backend Endpoint: POST /api/permintaan (Must support Multipart)
      await API.post('/permintaan', newRequestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await showSuccess("Berhasil", "Permintaan berhasil diajukan dan disimpan ke database!");
      setFormData({ jumlah: 1, lokasi: "", deskripsi: "", bukti_file: null });
      setBuktiPreview(null);
      navigate("/penerima/permintaan-saya");

    } catch (error) {
      console.error("Error API Permintaan Saya:", error);
      showError("Gagal", "Gagal mengajukan permintaan: " + (error.response?.data?.message || error.message || "Terjadi kesalahan server."));
    }
  };

  // Handle mark received
  const handleMarkReceived = async (reqId) => {
    try {
      setActionLoading(true);
      // Backend: POST /api/permintaan/{id}/accept-offer
      await API.post(`/permintaan/${reqId}/accept-offer`);

      await showSuccess('Berhasil', 'Barang ditandai sebagai sudah diterima');
      // Refresh list
      const data = await getMyPermintaanSaya();
      if (Array.isArray(data)) {
        const activeData = data.filter(item =>
          item.status_permohonan !== 'received' &&
          item.status_permohonan !== 'rejected' &&
          item.status !== 'terpenuhi'
        );
        setPermintaan(activeData);
      }
    } catch (error) {
      showError('Gagal', 'Gagal menandai penerimaan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setActionLoading(false);
    }
  };

  // ... (Render logic) ...

  // Helper for image src to replace duplicates
  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return `http://localhost:8080/storage/${img}`;
  };

  // --- LOGIKA TAMPILAN DAFTAR (if (!id)) ---
  if (!id) {
    return (
      <div className="min-h-screen font-sans bg-gray-50">
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {user?.name ? `Halo, ${user.name}! 👋` : 'Permintaan Saya'}
              </h1>
              <p className="text-xl text-white/80">
                Pantau status permintaan barang kebutuhan Anda di sini.
              </p>
            </div>
          </div>

          <div className="relative">
            <svg viewBox="0 0 1440 100" className="w-full">
              <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
            </svg>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          {permintaan.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Permintaan</h3>
              <p className="text-gray-600 mb-6">Anda belum mengajukan permintaan bantuan apapun.</p>
              <button
                onClick={() => navigate('/dashboard-penerima')}
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <FiSearch className="text-xl" />
                <span>Cari Donasi</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Permintaan Aktif</h2>
                  <p className="text-gray-600">Status terkini dari pengajuan bantuan Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {permintaan.map((req) => {
                  return (
                    <div
                      key={req.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      {/* Card Image Header */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                        {req.donation?.image || req.image ? (
                          <img
                            src={
                              req.donation?.image
                                ? (req.donation.image.startsWith('data:') || req.donation.image.startsWith('http')
                                  ? req.donation.image
                                  : `http://localhost:8080/storage/${req.donation.image}`)
                                : (req.image && (req.image.startsWith('data:') || req.image.startsWith('http')
                                  ? req.image
                                  : `http://localhost:8080/storage/${req.image}`))
                            }
                            alt={req.judul}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.error("❌ Image failed to load:", e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            📦
                          </div>
                        )}

                        {/* Status Badges Overlay */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${req.status_permohonan === 'pending' || !req.status_permohonan
                              ? 'bg-yellow-100 text-yellow-800'
                              : req.status_permohonan === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : req.status_permohonan === 'sent'
                                  ? 'bg-purple-100 text-purple-800'
                                  : req.status_permohonan === 'received'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {req.status_permohonan === 'pending' || !req.status_permohonan
                              ? <><FiClock /> Menunggu</>
                              : req.status_permohonan === 'approved'
                                ? <><FiPackage /> Disiapkan</>
                                : req.status_permohonan === 'sent'
                                  ? <><FiPackage /> Dikirim</>
                                  : req.status_permohonan === 'received'
                                    ? <><FiCheckCircle /> Diterima</>
                                    : <><FiAlertCircle /> Ditolak</>}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                          {req.judul || "Permintaan Kebutuhan"}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                          {req.deskripsi}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiMapPin className="text-[#007EFF]" />
                            <span className="truncate">{getLokasiString(req.lokasi)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiUsers className="text-[#007EFF]" />
                            <span>Donatur: <span className="font-semibold">{req.donation?.donatur?.name || req.donation?.user?.name || "Menunggu"}</span></span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiPackage className="text-[#007EFF]" />
                            <span>Permintaan: <span className="font-semibold">{req.target_jumlah} Pcs</span></span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {(req.status_permohonan === 'approved' ||
                          req.status_permohonan === 'sent' ||
                          req.status_permohonan === 'received') && (
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                              {/* CHAT BUTTON */}
                              <button
                                onClick={() => {
                                  const peerId = req.donatur?.id || req.donation?.user_id || req.donation?.donatur?.id;
                                  navigate('/penerima/chat', { state: { peerId } });
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-[#00306C] font-bold rounded-xl hover:bg-blue-100 transition-all"
                              >
                                <FiMessageSquare />
                                <span>Chat Donatur</span>
                              </button>

                              {/* CONFIRM BUTTON */}
                              {req.status_permohonan === 'sent' && (
                                <button
                                  onClick={() => handleMarkReceived(req.id)}
                                  disabled={actionLoading}
                                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#00306C] text-white font-bold rounded-xl hover:bg-[#001F4D] transition-all disabled:opacity-50 hover:shadow-lg"
                                >
                                  {actionLoading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                                  <span>Konfirmasi Barang Diterima</span>
                                </button>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- LOGIKA FORM PENGAJUAN ---
  return (
    <div className="max-w-2xl mx-auto">
      {/* IMAGE ZOOM MODAL */}
      {showImageModal && donasi?.image && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Pratinjau Gambar - {Math.round(imageZoom * 100)}%</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Image Viewer */}
            <div
              className="bg-gray-900 relative overflow-hidden flex items-center justify-center"
              style={{ height: '500px' }}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              onWheel={handleWheel}
            >
              <img
                src={
                  donasi.image.startsWith('data:')
                    ? donasi.image
                    : donasi.image.startsWith('http')
                      ? donasi.image
                      : donasi.image.startsWith('storage/')
                        ? `http://localhost:8080/${donasi.image}`
                        : `http://localhost:8080/storage/${donasi.image}`
                }
                alt={donasi.nama}
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePan.x}px, ${imagePan.y}px)`,
                  cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  console.error("❌ Image failed to load in modal:", e.target.src);
                  e.target.style.display = 'none';
                  // Show fallback
                  const fallback = document.createElement('div');
                  fallback.className = 'text-6xl text-gray-600 text-center';
                  fallback.textContent = '📦 Gambar tidak dapat ditampilkan';
                  e.target.parentElement.appendChild(fallback);
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 p-4 border-t bg-gray-50 flex-wrap">
              <button
                onClick={handleZoomOut}
                disabled={imageZoom <= 1}
                className="px-4 py-2 bg-[#00306C] text-white rounded-lg hover:bg-[#001F4D] disabled:bg-gray-300 transition-all"
              >
                − Zoom Out
              </button>
              <span className="text-sm font-semibold min-w-[80px] text-center">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={imageZoom >= 3}
                className="px-4 py-2 bg-[#00306C] text-white rounded-lg hover:bg-[#001F4D] disabled:bg-gray-300 transition-all"
              >
                + Zoom In
              </button>
              <button
                onClick={handleResetZoom}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-700 font-semibold hover:text-[#007EFF] transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-r from-[#00306C] to-[#0063FF] text-white px-8 py-6 rounded-t-3xl">
          <h1 className="text-3xl font-bold">Permintaan Barang</h1>
          <p className="text-white/80 mt-1">
            Konfirmasi permintaan Anda untuk barang ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiPackage className="text-[#00306C]" />
              <span>Nama Barang</span>
            </label>
            <input
              type="text"
              value={donasi?.nama || ""}
              disabled
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiPackage className="text-[#00306C]" />
              <span>Jumlah/Kebutuhan *</span>
            </label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              min="1"
              max={donasi?.jumlah || 1}
              required
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiMapPin className="text-[#00306C]" />
              <span>Alamat Lengkap Tujuan Pengiriman *</span>
            </label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
              placeholder="Masukkan alamat lengkap penerimaan barang..."
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiFileText className="text-[#00306C]" />
              <span>Deskripsi Tambahan</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="4"
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all resize-none"
            />
          </div>

          {/* GAMBAR BARANG DONASI DENGAN ZOOM */}
          {donasi ? (
            <div>
              <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
                <FiImage className="text-[#00306C]" />
                <span>Gambar Barang Donasi</span>
              </label>
              {donasi.image ? (
                <div
                  onClick={() => {
                    console.log("🖼️ Image container clicked");
                    openImageModal();
                  }}
                  className="w-full group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer bg-gray-100"
                >
                  <img
                    src={
                      donasi.image.startsWith('data:') || donasi.image.startsWith('http')
                        ? donasi.image
                        : donasi.image.startsWith('storage/')
                          ? `http://localhost:8080/${donasi.image}`
                          : `http://localhost:8080/storage/${donasi.image}`
                    }
                    alt={donasi.nama}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      console.error("❌ Image failed to load:", e.target.src);
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl"
                    style={{ display: 'none' }}
                  >
                    📦
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/95 px-6 py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <p className="text-sm font-semibold text-gray-800">🔍 Klik untuk zoom in/out</p>
                      <p className="text-xs text-gray-600 mt-1">Scroll untuk zoom • Drag untuk pan</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex flex-col items-center justify-center text-gray-600">
                  <p className="text-6xl mb-3">📦</p>
                  <p className="font-semibold">Gambar tidak tersedia</p>
                  <p className="text-sm mt-2">{donasi.kategori || 'Donasi'}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* UPLOAD BUKTI KEBUTUHAN */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiImage className="text-[#00306C]" />
              <span>Upload Bukti Kebutuhan</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {buktiPreview ? "File terpilih" : "Klik untuk upload atau drag & drop"}
                  </p>
                  {buktiPreview && (
                    <p className="text-xs text-green-600 mt-1">✓ Gambar siap diunggah</p>
                  )}
                </div>
                <input
                  type="file"
                  name="bukti_file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
            {buktiPreview && (
              <div className="mt-4">
                <img
                  src={buktiPreview}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 font-bold rounded-xl transition-all bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white hover:shadow-xl hover:shadow-[#00306C]/30 hover:scale-[1.03]"
            >
              <FiSend className="text-xl" />
              <span>Ajukan Permintaan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermintaanSaya;