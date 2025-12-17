'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DetailAkunPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string, userId: number } | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load User & Status
  useEffect(() => {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
      try {
        const userData = JSON.parse(sessionStr);
        setUser(userData);

        // Fetch Status from Backend if user exists
        if (userData.userId) {
          checkVerificationStatus(userData.userId);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const checkVerificationStatus = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8090/api/verifikasi/${userId}/status`);
      if (res.ok) {
        const data = await res.json();
        // Check exact status string from backend
        if (data.status === "Dokumen sudah diupload, menunggu verifikasi" || data.status.includes("Terverifikasi")) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Status check failed", error);
      setIsVerified(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu!');
      return;
    }

    if (!user?.userId) {
      alert('User session invalid. Silahkan login ulang.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('userId', user.userId.toString());
      formData.append('file', selectedFile);

      const res = await fetch(`http://localhost:8090/api/verifikasi/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Dokumen berhasil diunggah! Menunggu verifikasi dari admin.');
        setIsVerified(false);
        setShowUploadModal(false);
        checkVerificationStatus(user.userId);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal mengunggah: ${errorData.message || 'Error server'}`);
      }
    } catch (error) {
      console.error("Upload error", error);
      alert('Terjadi kesalahan saat mengupload dokumen.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
        <h1 className="text-xl font-bold text-gray-900">Detail Akun</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Informasi Akun Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun</h2>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center text-3xl shrink-0">
                👨‍💼
              </div>

              {/* Change Photo Button */}
              <div className="flex-1 flex flex-col gap-2">
                <button className="px-4 py-2 border-2 border-blue-900 text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-colors w-fit">
                  Ganti Foto
                </button>
                <p className="text-xs text-gray-500">Ukuran foto maksimal 5mb.</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              {/* Nama Akun */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Akun</p>
                <p className="font-semibold text-gray-900">{user?.username || 'Guest'}</p>
              </div>

              {/* Role Akun */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Role Akun</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900 capitalize">{user?.role || '-'}</span>

                  {isVerified ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      ✓ Terverifikasi
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                        Belum Terverifikasi
                      </span>
                      {/* Only show upload button for Penerima if not verified */}
                      {user?.role === 'penerima' && (
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="text-xs text-blue-600 underline font-semibold"
                        >
                          Unggah Dokumen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* No Handphone */}
              <div>
                <p className="text-sm text-gray-600 mb-1">No Handphone</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">+6285*****56</p>
                  <span className="text-gray-400">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Lainnya Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Lainnya</h2>

          <button className="w-full bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center text-2xl shrink-0">
                👨‍💼
              </div>

              <div className="text-left">
                <p className="font-semibold text-gray-900">Informasi Pribadi</p>
                <p className="text-sm text-gray-600">Sudah Lengkap</p>
              </div>
            </div>
            <span className="text-gray-400 text-2xl">&gt;</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verifikasi Akun</h3>
            <p className="text-sm text-gray-500 mb-4">Unggah foto KTP/Identitas Anda untuk verifikasi sebagai Penerima Donasi.</p>

            <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 mb-6 bg-blue-50 relative group cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-900 text-sm">
                    {selectedFile ? selectedFile.name : "Klik untuk pilih dokumen"}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    Format: JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className={`flex-1 py-2 rounded-xl font-bold text-white shadow-lg transition-colors ${uploading || !selectedFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  }`}
              >
                {uploading ? 'Mengunggah...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
