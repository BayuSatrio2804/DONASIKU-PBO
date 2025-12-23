import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiCamera } from 'react-icons/fi';
import { getAuthData, saveAuthData } from '../../utils/localStorage';
import api from '../../services/api';

const DetailAkunDonatur = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

    // Refresh user data whenever window gains focus
    window.addEventListener('focus', loadUserData);
    return () => window.removeEventListener('focus', loadUserData);
  }, [navigate]);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    // Backend sudah return full URL via photo_url attribute
    if (photoPath.startsWith('http')) return photoPath;
    // Fallback jika hanya path
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ukuran file terlalu besar (maksimal 5MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      setMessage('Pilih foto terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('name', user.name);
      formData.append('phone', user.phone || '');

      const response = await api.post('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local storage with new user data
      if (response.data.data) {
        const updatedUser = response.data.data.user;
        saveAuthData(updatedUser);
        setUser(updatedUser);
        setPhotoFile(null);
        setPhotoPreview(null);

        // Emit event untuk update header/topbar
        window.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: updatedUser 
        }));
      }

      setMessage('Foto berhasil diubah');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengubah foto');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  const displayPhoto = photoPreview || getPhotoUrl(user.photo);
  const displayName = user.name?.charAt(0).toUpperCase() || 'D';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Detail Akun</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-20">
        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('berhasil')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {message}
          </div>
        )}

        {/* Informasi Akun */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Informasi Akun</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                  {displayPhoto ? (
                    <img
                      src={displayPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName
                  )}
                </div>
                <label htmlFor="photo-input" className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition shadow-lg">
                  <FiCamera className="w-4 h-4" />
                </label>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <button
                onClick={handleUploadPhoto}
                disabled={loading || !photoFile}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 px-6 py-2 border border-blue-600 disabled:border-gray-400 rounded-full transition"
              >
                {loading ? 'Mengupload...' : 'Ganti Foto'}
              </button>
              <p className="text-xs text-gray-500">Ukuran foto maksimal 5mb.</p>
            </div>

            {/* User Info */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Nama Akun */}
              <div>
                <label className="text-xs text-gray-600 font-medium">Nama Akun</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{user.name}</p>
              </div>

              {/* Role Akun */}
              <div>
                <label className="text-xs text-gray-600 font-medium">Role Akun</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Donatur</p>
                </div>
              </div>

              {/* No Handphone */}
              <div>
                <label className="text-xs text-gray-600 font-medium">No Handphone</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.phone ? user.phone : 'Tidak ada nomor'}
                  </p>
                  {user.phone && (
                    <button className="p-1 hover:bg-gray-100 rounded transition">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.058.319.266.644.748 1.053.482.41 1.125.667 1.766.667.641 0 1.284-.257 1.766-.667.482-.409.69-.734.748-1.053l-1.548-.773a1 1 0 01-.54-1.06l.74-4.435A1 1 0 0113.847 3h2.153a1 1 0 011 1v2a1 1 0 11-2 0V4h-.5a.5.5 0 00-.5.5V6a1 1 0 11-2 0v-.5a.5.5 0 00-.5-.5h-2.5a.5.5 0 00-.5.5V6a1 1 0 11-2 0v-.5a.5.5 0 00-.5-.5H4v1a1 1 0 11-2 0V3z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Lainnya */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Informasi Lainnya</h2>
          <button className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Informasi Pribadi</p>
                <p className="text-xs text-green-600 font-medium">Sudah Lengkap</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAkunDonatur;
