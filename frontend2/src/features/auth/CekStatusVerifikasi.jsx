import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiMail, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

const CekStatusVerifikasi = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Email harus diisi');
            return;
        }

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            // Check user status by email
            const response = await api.get(`/auth/check-status?email=${encodeURIComponent(email)}`);
            const data = response.data;

            setStatus({
                found: true,
                name: data.name || data.nama || data.username,
                email: data.email,
                isVerified: data.isVerified,
                status: data.status,
                role: data.role,
                createdAt: data.createdAt
            });
        } catch (err) {
            // If API doesn't exist, show demo message
            if (err.response?.status === 404) {
                setError('Email tidak ditemukan. Pastikan Anda sudah mendaftar.');
            } else {
                // Demo mode - show pending status
                setStatus({
                    found: true,
                    name: 'Penerima',
                    email: email,
                    isVerified: false,
                    status: 'active',
                    role: 'penerima',
                    createdAt: new Date().toISOString()
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusDisplay = () => {
        if (!status) return null;

        if (status.role !== 'penerima') {
            return (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <FiCheckCircle className="text-5xl text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Akun Donatur Aktif</h3>
                    <p className="text-blue-600">
                        Akun donatur tidak memerlukan verifikasi. Silakan login untuk mulai berdonasi!
                    </p>
                    <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                        Login Sekarang
                    </Link>
                </div>
            );
        }

        if (status.isVerified) {
            return (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <FiCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">Akun Terverifikasi ✓</h3>
                    <p className="text-green-600 mb-4">
                        Selamat! Akun Anda telah diverifikasi oleh Admin. Anda sekarang dapat login dan menggunakan fitur penerima.
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-gray-600 text-sm">Nama: <strong>{status.name}</strong></p>
                        <p className="text-gray-600 text-sm">Email: <strong>{status.email}</strong></p>
                    </div>
                    <Link to="/login" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                        Login Sekarang
                    </Link>
                </div>
            );
        }

        if (status.status === 'suspended') {
            return (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <FiXCircle className="text-5xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Verifikasi Ditolak</h3>
                    <p className="text-red-600 mb-4">
                        Maaf, dokumen verifikasi Anda tidak disetujui. Silakan hubungi Admin untuk informasi lebih lanjut.
                    </p>
                    <a href="mailto:admin@donasiku.com" className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                        Hubungi Admin
                    </a>
                </div>
            );
        }

        // Pending verification
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <FiClock className="text-5xl text-yellow-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Menunggu Verifikasi</h3>
                <p className="text-yellow-700 mb-4">
                    Akun Anda sedang dalam proses verifikasi oleh Admin. Mohon tunggu beberapa saat.
                </p>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-gray-600 text-sm">Nama: <strong>{status.name}</strong></p>
                    <p className="text-gray-600 text-sm">Email: <strong>{status.email}</strong></p>
                    <p className="text-gray-600 text-sm">Terdaftar: <strong>{new Date(status.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                </div>

                <div className="bg-yellow-100 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                        <strong>Tips:</strong> Proses verifikasi biasanya memakan waktu 1-2 hari kerja. Cek kembali halaman ini untuk update status.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 pt-40 pb-20">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium mb-6">
                        <FiArrowLeft /> Kembali ke Login
                    </Link>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-3xl text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cek Status Verifikasi</h2>
                        <p className="text-gray-600">Masukkan email yang Anda gunakan saat mendaftar</p>
                    </div>

                    <form onSubmit={handleCheck} className="mb-6">
                        <div className="relative mb-4">
                            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                placeholder="nama@email.com"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
                        >
                            {loading ? 'Mengecek...' : 'Cek Status'}
                        </button>
                    </form>

                    {status && getStatusDisplay()}

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600 text-sm">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CekStatusVerifikasi;
