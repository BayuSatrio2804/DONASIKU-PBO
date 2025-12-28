import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPackage, FiInbox, FiUserCheck, FiSettings, FiTrendingUp, FiArrowRight, FiShield, FiLogOut } from 'react-icons/fi';
import { donationAPI } from '../../services/api';
import api from '../../services/api';
import { logout } from '../../utils/localStorage';
import { showConfirm } from '../../utils/sweetalert';
import { getAuthData } from '../../utils/localStorage';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const user = getAuthData();
    const [stats, setStats] = useState({
        users: 0,
        donations: 0,
        requests: 0,
        pendingVerification: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminId = user?.userId || user?.id;
                const [donasiRes, usersRes, permintaanRes, pendingRes] = await Promise.allSettled([
                    donationAPI.getAll(),
                    api.get('/users', { params: { adminId } }),
                    api.get('/permintaan'),
                    api.get('/users/penerima/pending', { params: { adminId } })
                ]);

                setStats({
                    donations: donasiRes.status === 'fulfilled' ? (Array.isArray(donasiRes.value.data) ? donasiRes.value.data.length : 0) : 0,
                    users: usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value.data) ? usersRes.value.data.length : (Array.isArray(usersRes.value) ? usersRes.value.length : 0)) : 0,
                    requests: permintaanRes.status === 'fulfilled' ? (Array.isArray(permintaanRes.value.data) ? permintaanRes.value.data.length : (Array.isArray(permintaanRes.value) ? permintaanRes.value.length : 0)) : 0,
                    pendingVerification: pendingRes.status === 'fulfilled' ? (Array.isArray(pendingRes.value.data) ? pendingRes.value.data.length : 0) : 0
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        const result = await showConfirm('Logout', 'Apakah Anda yakin ingin keluar?');
        if (result.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="-m-6"> {/* Negative margin to counteract DashboardLayout's p-6 for the header */}
            {/* Premium Header - Matching DashboardDonatur Tone */}
            <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <FiShield className="text-2xl text-white" />
                                </div>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                                    Administrator Panel
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                                Halo, {user?.name || 'Admin'}!
                            </h1>
                            <p className="text-xl text-blue-50/80 max-w-2xl leading-relaxed">
                                Kelola platform Donasiku, pantau donasi, dan verifikasi penerima untuk menjaga ekosistem kebaikan tetap aman.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all border border-white/20 backdrop-blur-md group self-start md:self-center"
                        >
                            <FiLogOut className="group-hover:rotate-12 transition-transform" />
                            Keluar dari Panel
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Users */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                <FiUsers className="text-2xl text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex items-center gap-1">
                                <FiTrendingUp /> Active
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Pengguna</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">{loading ? '...' : stats.users}</p>
                    </div>

                    {/* Donations */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                <FiPackage className="text-2xl text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Terverifikasi</div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Donasi</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">{loading ? '...' : stats.donations}</p>
                    </div>

                    {/* Requests */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                <FiInbox className="text-2xl text-amber-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Permintaan</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">{loading ? '...' : stats.requests}</p>
                    </div>

                    {/* Pending Verification */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        {stats.pendingVerification > 0 && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 -mr-8 -mt-8 rounded-full blur-2xl"></div>
                        )}
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500 transition-colors">
                                <FiUserCheck className="text-2xl text-red-600 group-hover:text-white transition-colors" />
                            </div>
                            {stats.pendingVerification > 0 && (
                                <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-1 rounded-full animate-pulse">
                                    Perlu Action
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Menunggu Verif</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">{loading ? '...' : stats.pendingVerification}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">Menu Navigasi Admin</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Verifikasi Penerima */}
                    <div
                        onClick={() => navigate('/admin/verifikasi-penerima')}
                        className="group bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 cursor-pointer hover:shadow-2xl hover:border-emerald-200 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-500">
                            <FiUserCheck size={120} />
                        </div>

                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0">
                            <FiUserCheck className="text-3xl text-white" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-2xl font-black text-slate-800">Verifikasi Penerima</h3>
                                <FiArrowRight className="text-2xl text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Tinjau dokumen identitas pendaftar baru untuk memastikan keamanan platform.
                            </p>

                            {stats.pendingVerification > 0 ? (
                                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-sm font-bold border border-red-100">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                    {stats.pendingVerification} Menunggu Persetujuan
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-sm font-bold border border-emerald-100">
                                    Sudah Terverifikasi Semua
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kelola User */}
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="group bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 cursor-pointer hover:shadow-2xl hover:border-blue-200 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-500">
                            <FiSettings size={120} />
                        </div>

                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                            <FiSettings className="text-3xl text-white" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-2xl font-black text-slate-800">Kelola Pengguna</h3>
                                <FiArrowRight className="text-2xl text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                            </div>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Database lengkap pengguna Donasiku. Cari, pantau, dan atur status akun user.
                            </p>

                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-sm font-bold border border-indigo-100">
                                {stats.users} Total User Terdaftar
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
