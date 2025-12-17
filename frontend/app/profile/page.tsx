'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);

  // Load user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('userSession');
      if (sessionStr) {
        try {
          setUser(JSON.parse(sessionStr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'donatur' | 'penerima'>('donatur');

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('userSession');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-3xl shrink-0">
              👨‍💼
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {user?.role || 'Guest'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.username || 'Tamu'}
              </h2>
              <div className="flex items-center gap-1 text-sm text-blue-600 mb-3">
                <span>✓</span>
                <span>Sudah Terverifikasi</span>
              </div>
              <button
                onClick={() => router.push('/detail-akun')}
                className="text-sm font-semibold text-blue-900 px-4 py-1 border border-blue-900 rounded-full hover:bg-blue-50 transition-colors"
              >
                Detail
              </button>
            </div>
          </div>

          {/* Change Role Button */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-blue-900 font-semibold border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span>👥</span>
            <span>Cek Ketentuan Role</span>
          </button>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="flex items-center gap-3 font-bold text-gray-900 text-lg mb-4">
            <span>⚙️</span>
            Pengaturan Akun
          </h3>

          {/* Kebijakan dan Ketentuan */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-blue-900">ℹ️</span>
              <span className="font-semibold text-gray-900">Kebijakan dan Ketentuan</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>

          <div className="border-b border-gray-200"></div>

          {/* Pusat Bantuan */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <span className="font-semibold text-gray-900">Pusat Bantuan</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>

          <div className="border-b border-gray-200"></div>

          {/* Versi Aplikasi */}
          <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="font-semibold text-gray-900">Versi Aplikasi</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-full bg-primary text-white font-bold py-3 rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2 mt-8 shadow-lg shadow-blue-200"
        >
          <span>→</span>
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm text-center shadow-2xl transform scale-100 animate-scaleIn">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚪</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ingin Keluar?</h3>
            <p className="text-gray-500 mb-8">Apakah Anda yakin ingin mengakhiri sesi ini? Anda harus login kembali untuk masuk.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Guidelines Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] p-0 w-full max-w-md shadow-2xl transform scale-100 animate-scaleIn overflow-hidden max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-900 p-6 text-white relative">
              <h3 className="text-xl font-bold text-center">Ketentuan Role</h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveRoleTab('donatur')}
                className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeRoleTab === 'donatur'
                    ? 'text-blue-900 border-b-2 border-blue-900 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Donatur
              </button>
              <button
                onClick={() => setActiveRoleTab('penerima')}
                className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeRoleTab === 'penerima'
                    ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Penerima
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {activeRoleTab === 'donatur' ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Barang Layak Pakai</h4>
                      <p className="text-xs text-gray-500 mt-1">Pastikan barang yang didonasikan dalam kondisi bersih, utuh, dan masih berfungsi dengan baik.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Deskripsi Jujur</h4>
                      <p className="text-xs text-gray-500 mt-1">Berikan foto dan penjelasan yang sesuai dengan kondisi asli barang tanpa melebih-lebihkan.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Komitmen Pengiriman</h4>
                      <p className="text-xs text-gray-500 mt-1">Segera kirim atau serahkan barang setelah permintaan disetujui untuk menjaga kepercayaan.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Penggunaan Pribadi</h4>
                      <p className="text-xs text-gray-500 mt-1">Barang yang diterima harus digunakan untuk keperluan sendiri atau keluarga, bukan untuk diperjualbelikan.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Verifikasi Identitas</h4>
                      <p className="text-xs text-gray-500 mt-1">Wajib menyertakan dokumen identitas (KTP/SKTM) yang valid untuk memastikan bantuan tepat sasaran.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Konfirmasi Penerimaan</h4>
                      <p className="text-xs text-gray-500 mt-1">Wajib mengonfirmasi dan memberikan bukti foto setelah barang diterima.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-800 transition-colors"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
