import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiCamera, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { getAuthData, setAuthData } from '../../utils/localStorage';
import api from '../../services/api';

const DetailProfilePenerima = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

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
  }, []);

  const initEditName = () => {
    setEditName(user.name);
    setIsEditingName(true);
  };

  const initEditEmail = () => {
    setEditEmail(user.email);
    setIsEditingEmail(true);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditName('');
  };

  const cancelEditEmail = () => {
    setIsEditingEmail(false);
    setEditEmail('');
  };

  const initEditPhone = () => {
    setEditPhone(user.phone || user.noTelepon || '');
    setIsEditingPhone(true);
  };

  const cancelEditPhone = () => {
    setIsEditingPhone(false);
    setEditPhone('');
  };

  const saveProfileData = async (updates) => {
    setLoading(true);
    try {
      const userId = user.userId || user.id;
      const formData = new FormData();
      formData.append('name', updates.name || user.name || user.nama || '');
      formData.append('phone', updates.phone || user.phone || user.noTelepon || '');
      formData.append('email', updates.email || user.email || '');

      const response = await api.post(`/users/${userId}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.data) {
        const updatedData = { ...user, ...response.data.data.user };
        setAuthData(updatedData);
        setUser(updatedData);
        setMessage('Profil berhasil diperbarui!');

        // Emit event untuk update header/topbar
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: updatedData
        }));
      }
    } catch (error) {
      console.error('Error:', error.response?.data);
      setMessage(error.response?.data?.errors?.email?.[0] || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      setMessage('Nama tidak boleh kosong');
      return;
    }
    if (editName === user.name) {
      cancelEditName();
      return;
    }
    await saveProfileData({ name: editName, email: user.email });
    setIsEditingName(false);
  };

  const handleSaveEmail = async () => {
    if (!editEmail.trim()) {
      setMessage('Email tidak boleh kosong');
      return;
    }
    if (editEmail === user.email) {
      cancelEditEmail();
      return;
    }
    await saveProfileData({ name: user.name, email: editEmail });
    setIsEditingEmail(false);
  };

  const handleSavePhone = async () => {
    if (!editPhone.trim()) {
      setMessage('Nomor telepon tidak boleh kosong');
      return;
    }
    if (editPhone === (user.phone || user.noTelepon)) {
      cancelEditPhone();
      return;
    }
    await saveProfileData({ phone: editPhone });
    setIsEditingPhone(false);
  };

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    return `http://localhost:8081/storage/${photoPath}`;
  };

  const getUserName = () => {
    return user?.name || user?.nama || user?.username || 'User';
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ukuran file terlalu besar (maksimal 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('name', user.name || user.nama || '');
    formData.append('phone', user.phone || user.noTelepon || '');
    formData.append('email', user.email || '');

    try {
      const userId = user.userId || user.id;
      const response = await api.post(`/users/${userId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data) {
        const updatedData = { ...user, ...response.data.data.user };
        setAuthData(updatedData);
        setUser(updatedData);
        setPhotoFile(null);
        setPhotoPreview(null);
        setMessage('Profil berhasil diperbarui!');

        // Emit event untuk update header/topbar
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: updatedData
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user) return <div className="p-4 text-center">Loading...</div>;

  const displayPhoto = photoPreview || getPhotoUrl(user.photo || user.avatar || user.fotoProfil);
  const displayName = getUserName().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Detail Profil Penerima</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
              {displayPhoto ? <img src={displayPhoto} className="w-full h-full object-cover" /> : displayName}
            </div>
            <label htmlFor="file-input" className="absolute bottom-0 right-0 bg-indigo-700 p-2 rounded-full text-white cursor-pointer shadow-lg">
              <FiCamera size={16} />
            </label>
            <input id="file-input" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
          </div>

          <div className="pt-2">
            <button
              onClick={handleUploadPhoto}
              disabled={!photoFile || loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold disabled:bg-gray-300 transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

          <div className="text-left space-y-4 pt-4 border-t border-gray-100">
            {/* Nama Lengkap */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap</label>
              {isEditingName ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={loading}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300"
                  >
                    <FiCheck size={18} />
                  </button>
                  <button
                    onClick={cancelEditName}
                    className="p-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl mt-1">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <button
                    onClick={initEditName}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <FiEdit2 size={16} className="text-indigo-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
              {isEditingEmail ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveEmail}
                    disabled={loading}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300"
                  >
                    <FiCheck size={18} />
                  </button>
                  <button
                    onClick={cancelEditEmail}
                    className="p-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl mt-1">
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                  <button
                    onClick={initEditEmail}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <FiEdit2 size={16} className="text-indigo-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">No Handphone</label>
              {isEditingPhone ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSavePhone}
                    disabled={loading}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300"
                  >
                    <FiCheck size={18} />
                  </button>
                  <button
                    onClick={cancelEditPhone}
                    className="p-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl mt-1">
                  <p className="text-sm font-semibold text-gray-900">{user.phone || user.noTelepon || '-'}</p>
                  <button
                    onClick={initEditPhone}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <FiEdit2 size={16} className="text-indigo-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
              <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 p-3 rounded-xl mt-1">Penerima</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfilePenerima;