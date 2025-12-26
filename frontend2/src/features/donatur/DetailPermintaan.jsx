import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCalendar, FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { getPermintaanById, approvePermintaan, rejectPermintaan, markPermintaanSent } from '../../services/permintaanService';
import { showSuccess, showError, showConfirm } from '../../utils/sweetalert';
import Swal from 'sweetalert2';
import FulfillmentModal from '../../components/FulfillmentModal';
import { getAuthData } from '../../utils/localStorage';
import { getLokasiString, extractNamaBarang, extractDeskripsi } from '../../utils/backendHelpers';

const DetailPermintaan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFulfillmentModal, setShowFulfillmentModal] = useState(false);
    const [showProof, setShowProof] = useState(false);
    const user = getAuthData();

    useEffect(() => {
        const loadRequest = async () => {
            try {
                setLoading(true);
                const data = await getPermintaanById(id);

                // Privacy Check: Jika sudah bukan pending, hanya penolong (donatur) asli atau admin yang bisa lihat
                const status = (data.status_permohonan || "").toLowerCase();
                const isPending = !status || status === 'pending' || status === 'open';
                const donaturId = data.donatur?.userId || data.donatur?.id || data.donatur_id;
                const isMyFulfillment = String(donaturId) === String(user?.id || user?.userId);

                if (!isPending && user?.role === 'donatur' && !isMyFulfillment) {
                    throw new Error("Anda tidak memiliki akses untuk melihat detail bantuan ini.");
                }

                setRequest(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadRequest();
    }, [id]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"><FiPackage /> Disiapkan</span>;
            case 'sent':
                return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"><FiPackage /> Dikirim</span>;
            case 'received':
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"><FiCheckCircle /> Selesai</span>;
            case 'rejected':
                return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"><FiAlertCircle /> Ditolak</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"><FiClock /> Menunggu</span>;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00306C]"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#00306C] text-white rounded-lg font-medium hover:bg-[#00254a] transition-colors">
                    Kembali
                </button>
            </div>
        </div>
    );

    if (!request) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#00306C] font-medium transition-colors"
                >
                    <FiArrowLeft /> Kembali ke Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Image - Prioritize Donation Image if Available */}
                    <div className="h-64 sm:h-80 w-full bg-gray-200 relative">
                        {request.donation?.image || request.image ? (
                            <img
                                src={
                                    (request.donation?.image || request.image).startsWith('http') || (request.donation?.image || request.image).startsWith('data:')
                                        ? (request.donation?.image || request.image)
                                        : (request.donation?.image || request.image).startsWith('storage/')
                                            ? `http://localhost:8080/${request.donation?.image || request.image}`
                                            : `http://localhost:8080/storage/${request.donation?.image || request.image}`
                                }
                                alt={request.judul}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-[#00306C]">
                                <FiPackage className="text-6xl mb-4 opacity-50" />
                                <span className="text-lg font-medium opacity-75">Tidak ada visualisasi gambar</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-[#00306C] shadow-lg">
                                {request.kategori}
                            </span>
                            {request.donation?.image && (
                                <span className="bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                                    <FiPackage /> Foto Barang Donasi
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{request.judul}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(request.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    {request.donation_id && getStatusBadge(request.status_permohonan)}
                                </div>
                            </div>

                            {!request.donation_id && user?.role === 'donatur' && (
                                <button
                                    onClick={() => setShowFulfillmentModal(true)}
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <FiCheckCircle size={20} /> Bantu Penuhi
                                </button>
                            )}

                            {/* Tombol Konfirmasi Pengiriman (untuk donatur yang sudah approved) */}
                            {user?.role === 'donatur' && request.status_permohonan === 'approved' && (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={async () => {
                                            const res = await showConfirm('Konfirmasi', 'Apakah Anda yakin sudah mengirim barang ini?', 'Sudah Terkirim', 'Batal');
                                            if (res.isConfirmed) {
                                                try {
                                                    await markPermintaanSent(request.id);
                                                    await showSuccess('Berhasil', 'Status berhasil diperbarui! Terima kasih telah mengirim bantuan.');
                                                    // Refresh data
                                                    const updatedData = await getPermintaanById(request.id);
                                                    setRequest(updatedData);
                                                } catch (err) {
                                                    showError('Gagal', err.message);
                                                }
                                            }
                                        }}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiPackage size={20} /> Konfirmasi Pengiriman
                                    </button>
                                </div>
                            )}

                            {/* Tombol Chat (untuk kedua belah pihak jika sudah approved/sent/received) */}
                            {(request.status_permohonan === 'approved' || request.status_permohonan === 'sent' || request.status_permohonan === 'received') && (
                                <button
                                    onClick={() => {
                                        const path = user.role === 'donatur' ? '/donatur/chat' : '/penerima/chat';
                                        const peerId = user.role === 'donatur'
                                            ? (request.penerima?.id || request.user?.id)
                                            : (request.donatur?.id || request.donation?.user_id);
                                        navigate(path, { state: { peerId } });
                                    }}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-100 text-[#00306C] font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <FiMessageSquare size={20} /> Chat {user.role === 'donatur' ? 'Penerima' : 'Donatur'}
                                </button>
                            )}

                            {/* Tombol Approve/Reject (untuk donatur jika status pending) */}
                            {request.donation_id && user?.role === 'donatur' && request.status_permohonan === 'pending' && request.donation?.user_id === user.id && (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={async () => {
                                            const res = await showConfirm('Konfirmasi', 'Setujui permintaan ini?', 'Setujui', 'Batal');
                                            if (res.isConfirmed) {
                                                try {
                                                    await approvePermintaan(request.id);
                                                    await showSuccess('Berhasil', 'Permintaan disetujui!');
                                                    const updatedData = await getPermintaanById(request.id);
                                                    setRequest(updatedData);
                                                } catch (err) {
                                                    showError('Gagal', err.message);
                                                }
                                            }
                                        }}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiCheckCircle size={20} /> Setujui
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const { value: reason } = await Swal.fire({
                                                title: 'Alasan Penolakan',
                                                input: 'textarea',
                                                inputPlaceholder: 'Masukkan alasan penolakan...',
                                                showCancelButton: true,
                                                confirmButtonColor: '#d33',
                                                confirmButtonText: 'Tolak',
                                                cancelButtonText: 'Batal'
                                            });
                                            if (reason) {
                                                try {
                                                    await rejectPermintaan(request.id, reason);
                                                    await showSuccess('Berhasil', 'Permintaan ditolak.');
                                                    const updatedData = await getPermintaanById(request.id);
                                                    setRequest(updatedData);
                                                } catch (err) {
                                                    showError('Gagal', err.message);
                                                }
                                            }
                                        }}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiAlertCircle size={20} /> Tolak
                                    </button>
                                </div>
                            )}

                            {/* Status Pengiriman */}
                            {request.status_permohonan === 'sent' && (
                                <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-xl font-bold flex items-center gap-2">
                                    <FiPackage /> Sedang Dikirim
                                </div>
                            )}

                            {request.status_permohonan === 'received' && (
                                <div className="px-6 py-2 bg-green-100 text-green-800 rounded-xl font-bold flex items-center gap-2">
                                    <FiCheckCircle /> Sudah Diterima
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <FiUser className="text-[#00306C]" /> Detail Kebutuhan (Penerima: {request.penerima?.name || "Anonim"})
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {request.deskripsi || "Tidak ada deskripsi detail."}
                                    </p>

                                    {request.image && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setShowProof(!showProof)}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-all mb-2"
                                            >
                                                {showProof ? <FiCheckCircle /> : <FiClock />} {showProof ? "Tutup Bukti Kebutuhan" : "Lihat Bukti Kebutuhan"}
                                            </button>

                                            {showProof && (
                                                <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-300">
                                                    <img
                                                        src={
                                                            request.image.startsWith('http') || request.image.startsWith('data:')
                                                                ? request.image
                                                                : request.image.startsWith('storage/')
                                                                    ? `http://localhost:8080/${request.image}`
                                                                    : `http://localhost:8080/storage/${request.image}`
                                                        }
                                                        alt="Bukti Kebutuhan"
                                                        className="w-full max-h-64 object-contain rounded-md"
                                                    />
                                                    <p className="text-xs text-gray-400 text-center mt-1">Foto bukti yang diunggah penerima</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <h3 className="text-lg font-bold text-[#00306C] mb-4">Informasi Penting</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg text-[#00306C] shadow-sm">
                                                <FiPackage size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Jumlah Dibutuhkan</p>
                                                <p className="font-bold text-gray-900">{request.jumlah} Pcs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg text-[#00306C] shadow-sm">
                                                <FiMapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Alamat Tujuan (Penerima)</p>
                                                <p className="font-bold text-gray-900">{getLokasiString(request.lokasi)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-4">
                                    <h3 className="font-bold text-gray-900 mb-4">Rangkuman</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Status</span>
                                            <span className="font-medium text-gray-900">{request.donation_id ? 'Sudah Dipenuhi' : 'Belum Dipenuhi'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Kategori</span>
                                            <span className="font-medium text-gray-900">{request.kategori}</span>
                                        </li>
                                        <li className="border-t pt-3 mt-3">
                                            <p className="text-xs text-center text-gray-400">
                                                ID Permintaan: #{request.id}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFulfillmentModal && (
                <FulfillmentModal
                    request={request}
                    onClose={() => setShowFulfillmentModal(false)}
                    onSuccess={() => {
                        // Refresh data
                        getPermintaanById(id).then(setRequest);
                        // Optional: Navigate back or show success state
                    }}
                />
            )}
        </div>
    );
};

export default DetailPermintaan;
