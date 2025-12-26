import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLogOut, FiShield } from 'react-icons/fi';
import { getAuthData, logout } from '../../utils/localStorage';
import { showConfirm } from '../../utils/sweetalert';

const ProfileAdmin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const loadUserData = () => {
        const authData = getAuthData();
        if (!authData) {
            navigate('/login');
            return;
        }
        setUser(authData);
    };

    useEffect(() => {
        loadUserData();
        return () => { };
    }, [navigate]);

    const handleLogout = async () => {
        const result = await showConfirm('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar?', 'Keluar', 'Batal');
        if (result.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    if (!user) {
        return <div className="p-4">Loading...</div>;
    }

    const displayName = user.name?.charAt(0).toUpperCase() || 'A';

    return (
        <div className="bg-gray-50 pb-24">
            {/* Header Profile Card */}
            <div className="p-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-start justify-between text-left">
                        <div className="flex gap-4 flex-1">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
                                {user.photo ? (
                                    <img
                                        src={`http://localhost:8081/storage/${user.photo}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    displayName
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                                        <FiShield size={10} /> Admin Panel
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{user.name || user.username}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Section */}
            <div className="px-4 mt-6 space-y-4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    {/* Versions */}
                    <div className="w-full px-6 py-4 flex items-center justify-between">
                        <div className="text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">
                                    v
                                </div>
                                <p className="font-semibold text-gray-900">Versi Dashboard Admin</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">v2.1.0 Premium</span>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 mt-8 mb-4">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100"
                >
                    <span>Logout dari Sistem</span>
                    <FiLogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ProfileAdmin;
