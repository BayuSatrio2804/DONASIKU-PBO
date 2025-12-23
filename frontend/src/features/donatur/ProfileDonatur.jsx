import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { getAuthData, logout } from '../../utils/localStorage';
import { showConfirm } from '../../utils/sweetalert';

const ProfileDonatur = () => {
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

    // Refresh user data whenever window gains focus (user returns to this tab/page)
    window.addEventListener('focus', loadUserData);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('focus', loadUserData);
    };
  }, [navigate]);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

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

  const photoUrl = getPhotoUrl(user.photo);
  const displayName = user.name?.charAt(0).toUpperCase() || 'D';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
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
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Donatur
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              </div>
            </div>

            <button
              onClick={() => navigate('/donatur/detail-akun')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-600 rounded-full transition"
            >
              Detail
            </button>
          </div>

          {/* Cek Ketentuan Role */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>✓</span>
              <span>Cek Ketentuan Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 mt-6 space-y-4">
        {/* Info Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* Kebijakan dan Ketentuan */}
          <button className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-200">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm">
                  i
                </div>
                <p className="font-semibold text-gray-900">Kebijakan dan Ketentuan</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Pusat Bantuan */}
          <button className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-200">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm">
                  ?
                </div>
                <p className="font-semibold text-gray-900">Pusat Bantuan</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Versi Aplikasi */}
          <button className="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-50">
                  <span className="text-xs text-blue-600">⬆</span>
                </div>
                <p className="font-semibold text-gray-900">Versi Aplikasi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">v1.0.0</span>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-8 mb-4">
        <button
          onClick={handleLogout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition"
        >
          <span>Keluar Akun</span>
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProfileDonatur;
