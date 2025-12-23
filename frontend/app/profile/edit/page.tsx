'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        noTelepon: '',
        alamat: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionStr = localStorage.getItem('userSession');
            if (sessionStr) {
                const userData = JSON.parse(sessionStr);
                setCurrentUser(userData);
                fetchProfile(userData.userId);
            } else {
                router.push('/auth/login');
            }
        }
    }, []);

    const fetchProfile = async (userId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    noTelepon: data.noTelepon || '',
                    alamat: data.alamat || '',
                });
            }
        } catch (e) {
            console.error('Failed to fetch profile', e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            const res = await fetch(`http://localhost:8080/api/users/${currentUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Profil berhasil diperbarui!');
                // Update session storage if name changed (optional but good UI)
                const newSession = { ...currentUser, username: formData.username };
                localStorage.setItem('userSession', JSON.stringify(newSession));

                router.push('/profile');
            } else {
                const err = await res.text();
                alert('Gagal update profil: ' + err);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Terjadi kesalahan saat update profil');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 z-20">
                <button
                    onClick={() => router.back()}
                    className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                    &lt;
                </button>
                <span className="font-bold text-lg text-black">Edit Profil</span>
            </div>

            <div className="mt-20 px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full bg-gray-200 border border-gray-300 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No Telepon</label>
                            <input
                                type="tel"
                                name="noTelepon"
                                value={formData.noTelepon}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </div>
    );
}
