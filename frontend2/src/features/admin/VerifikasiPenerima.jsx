import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserCheck, FiUser, FiMail, FiPhone, FiCheck, FiX, FiAlertCircle, FiFileText, FiEye, FiCalendar, FiMapPin } from 'react-icons/fi';
import api from '../../services/api';
import { showConfirm, showSuccess, showError } from '../../utils/sweetalert';

const VerifikasiPenerima = () => {
    const navigate = useNavigate();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDocModal, setShowDocModal] = useState(false);

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/penerima/pending');
            const data = Array.isArray(response.data) ? response.data : [];
            setPendingUsers(data);
        } catch (error) {
            console.error('Error loading pending users:', error);
            showError('Error', 'Gagal memuat data penerima');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId, userName) => {
        const result = await showConfirm(
            'Verifikasi Penerima',
            `Apakah Anda yakin ingin memverifikasi ${userName}?`,
            'Ya, Verifikasi',
            'Batal'
        );

        if (result.isConfirmed) {
            try {
                setProcessing(userId);
                await api.post(`/users/${userId}/verify`);
                showSuccess('Berhasil', 'Penerima berhasil diverifikasi');
                loadPendingUsers();
                setShowDocModal(false);
            } catch (error) {
                showError('Error', 'Gagal memverifikasi penerima');
            } finally {
                setProcessing(null);
            }
        }
    };

    const handleReject = async (userId, userName) => {
        const result = await showConfirm(
            'Tolak Penerima',
            `Apakah Anda yakin ingin menolak verifikasi ${userName}?`,
            'Ya, Tolak',
            'Batal'
        );

        if (result.isConfirmed) {
            try {
                setProcessing(userId);
                await api.post(`/users/${userId}/reject`);
                showSuccess('Berhasil', 'Penerima berhasil ditolak');
                loadPendingUsers();
                setShowDocModal(false);
            } catch (error) {
                showError('Error', 'Gagal menolak penerima');
            } finally {
                setProcessing(null);
            }
        }
    };

    const getPhotoUrl = (photo) => {
        if (!photo) return null;
        if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
        return `http://localhost:8081/storage/${photo}`;
    };

    const openDocumentModal = (user) => {
        setSelectedUser(user);
        setShowDocModal(true);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FiUserCheck className="text-2xl text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Verifikasi Penerima</h1>
                    <p className="text-gray-500">{pendingUsers.length} menunggu verifikasi</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-500">Memuat data...</p>
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheck className="text-4xl text-green-600" />
                        </div>
                        <p className="text-gray-800 font-bold text-lg">Semua Terverifikasi!</p>
                        <p className="text-gray-500 mt-2">Tidak ada penerima yang menunggu verifikasi.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pendingUsers.map(user => (
                            <div key={user.id || user.userId} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-lg">
                                            {getPhotoUrl(user.photo || user.fotoProfil) ? (
                                                <img src={getPhotoUrl(user.photo || user.fotoProfil)} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                (user.name || user.nama || user.username || 'P').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{user.name || user.nama || user.username}</h3>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FiMail size={14} className="text-gray-400" /> {user.email}
                                                </span>
                                                {(user.noTelepon || user.phone) && (
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <FiPhone size={14} className="text-gray-400" /> {user.noTelepon || user.phone}
                                                    </span>
                                                )}
                                            </div>
                                            {user.alamat && (
                                                <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <FiMapPin size={14} className="text-gray-400" /> {user.alamat}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                                                <FiCalendar size={12} /> Mendaftar: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1">
                                            <FiAlertCircle size={12} /> Pending
                                        </span>

                                        {/* View Document Button */}
                                        <button
                                            onClick={() => openDocumentModal(user)}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                                        >
                                            <FiEye /> Lihat Dokumen
                                        </button>

                                        <button
                                            onClick={() => handleVerify(user.id || user.userId, user.name || user.nama || user.username)}
                                            disabled={processing === (user.id || user.userId)}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <FiCheck /> Verifikasi
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id || user.userId, user.name || user.nama || user.username)}
                                            disabled={processing === (user.id || user.userId)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <FiX /> Tolak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Document Preview Modal */}
            {showDocModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                        <FiFileText className="text-2xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Dokumen Verifikasi</h2>
                                        <p className="text-indigo-200">{selectedUser.name || selectedUser.nama || selectedUser.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDocModal(false)}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* User Details */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h3 className="font-bold text-gray-800 mb-3">Informasi Pendaftar</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Nama:</span>
                                        <p className="font-semibold text-gray-800">{selectedUser.name || selectedUser.nama || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Email:</span>
                                        <p className="font-semibold text-gray-800">{selectedUser.email || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Telepon:</span>
                                        <p className="font-semibold text-gray-800">{selectedUser.noTelepon || selectedUser.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Alamat:</span>
                                        <p className="font-semibold text-gray-800">{selectedUser.alamat || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3">Dokumen Identitas</h3>
                                {selectedUser.documentPath ? (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
                                        <img
                                            src={getPhotoUrl(selectedUser.documentPath)}
                                            alt="Document"
                                            className="max-w-full max-h-80 mx-auto rounded-lg shadow-md"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="hidden text-center py-8">
                                            <FiFileText className="mx-auto text-4xl text-gray-400 mb-2" />
                                            <p className="text-gray-500">Gagal memuat dokumen</p>
                                            <a
                                                href={getPhotoUrl(selectedUser.documentPath)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                            >
                                                Buka di tab baru
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                                        <FiFileText className="mx-auto text-5xl text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">Tidak ada dokumen yang diupload</p>
                                        <p className="text-gray-400 text-sm mt-1">Penerima tidak melampirkan dokumen identitas</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDocModal(false)}
                                className="px-5 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => handleReject(selectedUser.id || selectedUser.userId, selectedUser.name || selectedUser.nama)}
                                disabled={processing === (selectedUser.id || selectedUser.userId)}
                                className="px-5 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <FiX /> Tolak
                            </button>
                            <button
                                onClick={() => handleVerify(selectedUser.id || selectedUser.userId, selectedUser.name || selectedUser.nama)}
                                disabled={processing === (selectedUser.id || selectedUser.userId)}
                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <FiCheck /> Verifikasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifikasiPenerima;
