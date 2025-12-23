import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiInfo, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { getPermintaanById, markPermintaanReceived } from '../../services/permintaanService';
import Swal from 'sweetalert2';

const KonfirmasiTerima = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
        return `http://localhost:8000/storage/${photoPath}`;
    };

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getPermintaanById(id);
                setRequest(data);
            } catch (error) {
                console.error('Error fetching request:', error);
                Swal.fire('Error', 'Gagal memuat detail permintaan', 'error');
                navigate('/dashboard-penerima');
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id, navigate]);

    const handleConfirm = async () => {
        const result = await Swal.fire({
            title: 'Konfirmasi Penerimaan',
            text: 'Apakah Anda yakin sudah menerima barang ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Sudah Diterima',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                setSubmitting(true);
                await markPermintaanReceived(id);
                await Swal.fire('Sukses', 'Konfirmasi penerimaan berhasil disimpan. Terima kasih!', 'success');
                navigate('/dashboard-penerima');
            } catch (error) {
                console.error('Error confirming receipt:', error);
                Swal.fire('Gagal', error.message || 'Gagal mengonfirmasi penerimaan', 'error');
            } finally {
                setSubmitting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!request) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard-penerima')}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                >
                    <FiArrowLeft className="mr-2" /> Kembali ke Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
                        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <FiPackage className="text-4xl" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Konfirmasi Penerimaan</h1>
                        <p className="opacity-90">Bantu kami memastikan bantuan telah sampai di tangan yang tepat</p>
                    </div>

                    <div className="p-8">
                        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <FiInfo className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900">Informasi Permintaan</h4>
                                    <p className="text-blue-800 text-sm">{request.judul}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-gray-100 p-3 rounded-xl mr-4">
                                    <FiPackage className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Nama Barang</p>
                                    <p className="text-gray-800 font-semibold">{request.judul}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-gray-100 p-3 rounded-xl mr-4">
                                    <FiInfo className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Target Jumlah</p>
                                    <p className="text-gray-800 font-semibold">{request.target_jumlah} Pcs</p>
                                </div>
                            </div>

                            {request.donation && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4">Detail Pengirim</h3>
                                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 font-bold overflow-hidden flex-shrink-0">
                                            {request.donation.user?.photo ? (
                                                <img
                                                    src={getPhotoUrl(request.donation.user.photo)}
                                                    alt={request.donation.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                request.donation.user?.name?.charAt(0) || 'D'
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{request.donation.user?.name || 'Donatur'}</p>
                                            <p className="text-xs text-gray-500">{request.donation.lokasi || 'Lokasi tidak tersedia'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12">
                            <button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg ${submitting
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-500/30 hover:scale-[1.02]'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mr-3"></span>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle className="mr-2 text-xl" />
                                        Saya Sudah Menerima Barang
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 italic">
                                * Dengan mengeklik konfirmasi, Anda mengakui bahwa barang sudah diterima dalam kondisi baik.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KonfirmasiTerima;
