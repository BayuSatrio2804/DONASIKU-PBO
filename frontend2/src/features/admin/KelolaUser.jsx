import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiMail, FiPhone, FiCheck, FiX, FiSearch, FiFilter, FiMoreVertical, FiShield, FiUser, FiCalendar, FiInbox } from 'react-icons/fi';
import api from '../../services/api';
import { showError } from '../../utils/sweetalert';

const KelolaUser = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('semua');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            // Handle both array and object response
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            showError('Error', 'Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filter === 'semua' || user.role?.toLowerCase() === filter;
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch =
            (user.name || user.nama || '').toLowerCase().includes(searchStr) ||
            (user.username || '').toLowerCase().includes(searchStr) ||
            (user.email || '').toLowerCase().includes(searchStr);

        return matchesRole && matchesSearch;
    });

    const getRoleBadge = (role) => {
        const roleLower = role?.toLowerCase();
        if (roleLower === 'admin') return 'bg-purple-100 text-purple-700 ring-1 ring-purple-200';
        if (roleLower === 'donatur') return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200';
        if (roleLower === 'penerima') return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
        return 'bg-gray-100 text-gray-700';
    };

    const getPhotoUrl = (photo) => {
        if (!photo) return null;
        if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
        return `http://localhost:8081/storage/${photo}`;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <FiUsers className="text-2xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>
                        <p className="text-gray-500">Manage {users.length} total akun pengguna</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari user, email, atau username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 bg-white shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['semua', 'donatur', 'penerima', 'admin'].map(role => (
                    <button
                        key={role}
                        onClick={() => setFilter(role)}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === role
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            {role === 'semua' && <FiUsers />}
                            {role === 'donatur' && <FiUser />}
                            {role === 'penerima' && <FiInbox size={14} className="rotate-12" />}
                            {role === 'admin' && <FiShield />}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                    </button>
                ))}
            </div>

            {/* User Table Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Memuat data pengguna...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiUsers className="text-4xl text-gray-300" />
                        </div>
                        <p className="text-gray-800 font-bold text-lg">Tidak ada pengguna</p>
                        <p className="text-gray-500 mt-1">Coba sesuaikan filter atau pencarian Anda.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email & Kontak</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Verifikasi</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(user => (
                                    <tr key={user.id || user.userId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg overflow-hidden border border-white shadow-sm">
                                                    {getPhotoUrl(user.photo || user.fotoProfil) ? (
                                                        <img src={getPhotoUrl(user.photo || user.fotoProfil)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.name || user.nama || user.username || 'U').charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-tight">{user.name || user.nama || user.username}</p>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <FiUser size={10} /> @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600 block flex items-center gap-2">
                                                <FiMail size={14} className="text-slate-400" /> {user.email}
                                            </span>
                                            {(user.noTelepon || user.phone) && (
                                                <span className="text-xs text-slate-400 mt-2 block flex items-center gap-2">
                                                    <FiPhone size={14} className="text-slate-400" /> {user.noTelepon || user.phone}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.status === 'suspended' ? (
                                                <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
                                                    <FiX className="stroke-[3]" /> Ditolak
                                                </span>
                                            ) : user.isVerified ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                    <FiCheck className="stroke-[3]" /> Terverifikasi
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                                    <FiX className="stroke-[3]" /> Belum Verif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <FiMoreVertical />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                <p>© 2025 Donasiku Admin Panel • Built with Premium UI</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span className="flex items-center gap-1"><FiCalendar size={14} /> Update: {new Date().toLocaleDateString('id-ID')}</span>
                </div>
            </div>
        </div>
    );
};

export default KelolaUser;
