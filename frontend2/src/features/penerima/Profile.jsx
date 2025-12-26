import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLogOut, FiPackage } from 'react-icons/fi'; // Tambah icon package untuk riwayat
import { getAuthData, logout } from '../../utils/localStorage';
import { showConfirm } from '../../utils/sweetalert';

const ProfilePenerima = () => {
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

    // Listen untuk profile update event real-time
    const handleProfileUpdate = (e) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Refresh data jika user kembali ke tab ini
    window.addEventListener('focus', loadUserData);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('focus', loadUserData);
    };
  }, [navigate]);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    // Sesuai logika Laravel: asset disimpan di storage/
    return `http://localhost:8081/storage/${photoPath}`;
  };

  const handleLogout = async () => {
    const result = await showConfirm('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar?', 'Keluar', 'Batal');
    if (result.isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const photoUrl = getPhotoUrl(user.avatar || user.photo);
  const displayName = user.name?.charAt(0).toUpperCase() || 'P';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              {/* Avatar - Menggunakan gradien yang sedikit berbeda untuk membedakan role jika mau */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden shadow-sm">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  displayName
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    Penerima
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Tombol Detail mengarah ke halaman Edit Profile yang sudah Anda buat */}
            <button
              onClick={() => navigate('/penerima/detail-akun')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 border border-indigo-600 rounded-full transition"
            >
              Detail
            </button>
          </div>

          {/* Status Verifikasi / Ketentuan */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              <span>Akun Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 mt-6 space-y-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

          {/* Riwayat Bantuan - Khusus Penerima */}
          <button
            onClick={() => navigate('/penerima/riwayat')}
            className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-100"
          >
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">
                  <FiPackage size={14} />
                </div>
                <p className="font-semibold text-gray-900">Riwayat Bantuan</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Kebijakan dan Ketentuan */}
          <button className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-100">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">
                  i
                </div>
                <p className="font-semibold text-gray-900">Kebijakan dan Ketentuan</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Pusat Bantuan */}
          <button className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-100">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">
                  ?
                </div>
                <p className="font-semibold text-gray-900">Pusat Bantuan</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Versi Aplikasi */}
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-50">
                  <span className="text-xs text-indigo-600">⬆</span>
                </div>
                <p className="font-semibold text-gray-900">Versi Aplikasi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-8 mb-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition border border-red-100"
        >
          <span>Keluar Akun</span>
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePenerima;