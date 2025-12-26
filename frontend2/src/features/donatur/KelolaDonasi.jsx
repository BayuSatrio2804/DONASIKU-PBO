import { useEffect, useState } from "react";
import { FiClock, FiPackage, FiMapPin, FiUser, FiEdit, FiTrash2, FiX, FiLoader } from "react-icons/fi";
import { getAuthData } from "../../utils/localStorage";
import { getMyDonasi, updateDonasiService, deleteDonasiService } from "../../services/donasiService";
import Swal from 'sweetalert2';
import { showSuccess, showError, showConfirm } from "../../utils/sweetalert";
import { extractNamaBarang, getLokasiString, getImageUrl } from "../../utils/backendHelpers";

const KelolaDonasi = () => {
  const user = getAuthData();
  const [donasiList, setDonasiList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: null, nama: '', jumlah: 0, deskripsi: '' });
  const [editLoading, setEditLoading] = useState(false);

  const handleEditClick = (donasi) => {
    setEditData({
      id: donasi.id,
      nama: donasi.nama || donasi.namaBarang || '',
      jumlah: donasi.jumlah,
      deskripsi: donasi.deskripsi
    });
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      await updateDonasiService(editData.id, editData);
      await showSuccess("Berhasil", "Data donasi berhasil diperbarui");
      setIsEditing(false);
      const refreshed = await getMyDonasi();
      setDonasiList(refreshed || []);
    } catch (err) {
      showError("Gagal Update", err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDonasi = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus Donasi?',
      text: "Donasi ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Hapus'
    });

    if (confirm.isConfirmed) {
      try {
        setProcessing(true);
        await deleteDonasiService(id);
        await showSuccess("Terhapus", "Donasi berhasil dihapus");
        const refreshed = await getMyDonasi();
        setDonasiList(refreshed || []);
      } catch (err) {
        showError("Gagal", err.message);
      } finally {
        setProcessing(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const myDonasi = await getMyDonasi();
        setDonasiList(myDonasi || []);

        const allReq = JSON.parse(localStorage.getItem("requests_db") || "[]");
        const donasiIds = (myDonasi || []).map((d) => String(d.id));
        const incoming = allReq.filter((r) => donasiIds.includes(String(r.donasiId)));
        setRequests(incoming);
      } catch (err) {
        console.error("Gagal mengambil data kelola donasi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAccept = async (req) => {
    if (processing) return;

    const result = await showConfirm("Konfirmasi", "Terima permintaan ini dan kurangi jumlah donasi?");
    if (!result.isConfirmed) return;

    const donasi = donasiList.find((d) => String(d.id) === String(req.donasiId));
    if (!donasi) {
      showError("Kesalahan", "Donasi tidak ditemukan.");
      return;
    }

    const newJumlah = Math.max(0, Number(donasi.jumlah) - Number(req.jumlahDiminta));

    setProcessing(true);
    try {
      await updateDonasiService(donasi.id, { jumlah: newJumlah });

      const allReq = JSON.parse(localStorage.getItem("requests_db") || "[]");
      const updatedReq = allReq.map((r) =>
        String(r.id) === String(req.id)
          ? { ...r, status: "accepted", updatedAt: new Date().toISOString() }
          : r
      );
      localStorage.setItem("requests_db", JSON.stringify(updatedReq));

      const donasiIds = donasiList.map((d) => String(d.id));
      setRequests(updatedReq.filter((r) => donasiIds.includes(String(r.donasiId))));

      const refreshed = await getMyDonasi();
      setDonasiList(refreshed || []);

      showSuccess("Berhasil", "Permintaan diterima. Jumlah donasi diperbarui.");
    } catch (err) {
      console.error(err);
      showError("Gagal", "Gagal memproses permintaan.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (req) => {
    if (processing) return;

    const result = await showConfirm("Konfirmasi", "Tolak permintaan ini?");
    if (!result.isConfirmed) return;

    setProcessing(true);
    try {
      const allReq = JSON.parse(localStorage.getItem("requests_db") || "[]");
      const updatedReq = allReq.map((r) =>
        String(r.id) === String(req.id)
          ? { ...r, status: "rejected", updatedAt: new Date().toISOString() }
          : r
      );
      localStorage.setItem("requests_db", JSON.stringify(updatedReq));

      const donasiIds = donasiList.map((d) => String(d.id));
      setRequests(updatedReq.filter((r) => donasiIds.includes(String(r.donasiId))));

      showSuccess("Berhasil", "Permintaan telah ditolak.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSend = async (req) => {
    if (processing) return;

    const result = await showConfirm("Konfirmasi", "Tandai permintaan ini sebagai sudah dikirim/diambil?");
    if (!result.isConfirmed) return;

    setProcessing(true);
    try {
      const allReq = JSON.parse(localStorage.getItem("requests_db") || "[]");
      const updatedReq = allReq.map((r) =>
        String(r.id) === String(req.id)
          ? { ...r, status: "sent", updatedAt: new Date().toISOString() }
          : r
      );
      localStorage.setItem("requests_db", JSON.stringify(updatedReq));

      const donasiIds = donasiList.map((d) => String(d.id));
      setRequests(updatedReq.filter((r) => donasiIds.includes(String(r.donasiId))));

      showSuccess("Berhasil", "Permintaan ditandai sebagai dikirim. Penerima dapat menandai selesai setelah menerima barang.");
    } finally {
      setProcessing(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      pakaian: "👕",
      elektronik: "💻",
      buku: "📚",
      mainan: "🧸",
      perabotan: "🛋️",
      lainnya: "📦",
    };
    return icons[category?.toLowerCase()] || "📦";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Memuat permintaan...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0 && donasiList.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Kelola Donasi</h1>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Donasi</h3>
          <p className="text-gray-600">Anda belum membuat donasi apapun.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Donasi</h3>
              <button onClick={() => setIsEditing(false)}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nama Barang</label>
                <input type="text" className="w-full border p-2 rounded-lg" value={editData.nama} onChange={e => setEditData({ ...editData, nama: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Jumlah</label>
                <input type="number" className="w-full border p-2 rounded-lg" value={editData.jumlah} onChange={e => setEditData({ ...editData, jumlah: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Deskripsi</label>
                <textarea className="w-full border p-2 rounded-lg h-24" value={editData.deskripsi} onChange={e => setEditData({ ...editData, deskripsi: e.target.value })} required />
              </div>
              <button type="submit" disabled={editLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                {editLoading ? <FiLoader className="animate-spin inline mr-2" /> : ''} Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kelola Donasi & Permintaan</h1>

      {/* SECTION 1: MY DONATIONS (CRUD) */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FiPackage /> Donasi Aktif Saya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donasiList.map(donasi => (
            <div key={donasi.id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden group">
              <div className="h-48 bg-gray-100 relative">
                {donasi.image ? (
                  <img src={getImageUrl(donasi.image)} className="w-full h-full object-cover" alt={donasi.nama} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-blue-50 text-blue-300">
                    {getCategoryIcon(donasi.kategori)}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(donasi)} className="p-2 bg-white rounded-full shadow hover:bg-yellow-50 text-yellow-600"><FiEdit /></button>
                  <button onClick={() => handleDeleteDonasi(donasi.id)} className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-600"><FiTrash2 /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{donasi.nama || donasi.namaBarang}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{donasi.deskripsi}</p>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Stok: <b className="text-[#00306C]">{donasi.jumlah}</b></span>
                  <span>{getLokasiString(donasi.lokasi)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        <FiUser /> Permintaan Masuk
      </h2>

      {requests.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
          Tidak ada permintaan masuk saat ini.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => {
            const donasi = donasiList.find((d) => String(d.id) === String(req.donasiId));
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 flex-shrink-0">
                    {donasi?.image ? (
                      <img
                        src={getImageUrl(donasi.image)}
                        alt={donasi.nama}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center text-5xl">
                        {getCategoryIcon(donasi?.kategori)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-bold text-xl mb-3 text-gray-900">
                      {donasi?.nama || "Barang tidak ditemukan"}
                    </h2>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiPackage className="text-blue-500" />
                        <span>
                          Diminta: <span className="font-semibold">{req.jumlahDiminta} pcs</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiUser className="text-blue-500" />
                        <span>
                          Dari: <span className="font-semibold">{req.asalPenerima}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMapPin className="text-blue-500" />
                        <span className="line-clamp-1">{getLokasiString(donasi?.lokasi)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiClock className="text-blue-500" />
                        <span>
                          {new Date(req.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {req.deskripsiPermintaan && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{req.deskripsiPermintaan}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(req)}
                            disabled={processing}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => handleReject(req)}
                            disabled={processing}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            Tolak
                          </button>
                        </>
                      )}

                      {req.status === "accepted" && (
                        <button
                          onClick={() => handleSend(req)}
                          disabled={processing}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          Tandai Dikirim
                        </button>
                      )}

                      {req.status === "sent" && (
                        <span className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 font-semibold">
                          Menunggu Konfirmasi Penerima
                        </span>
                      )}

                      {req.status === "rejected" && (
                        <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">
                          Ditolak
                        </span>
                      )}

                      {req.status === "completed" && (
                        <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KelolaDonasi;