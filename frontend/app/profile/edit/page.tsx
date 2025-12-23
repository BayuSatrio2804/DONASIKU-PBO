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
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

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
            } else {
                setErrors({ general: 'Gagal memuat data profil' });
            }
        } catch (e) {
            console.error('Failed to fetch profile', e);
            setErrors({ general: 'Koneksi terputus. Gagal memuat profil.' });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username tidak boleh kosong';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Username minimal 3 karakter';
        } else if (formData.username.trim().length > 50) {
            newErrors.username = 'Username maksimal 50 karakter';
        }

        if (formData.noTelepon.trim()) {
            const phoneDigits = formData.noTelepon.replace(/[^0-9]/g, '');
            if (phoneDigits.length < 10) {
                newErrors.noTelepon = 'Nomor telepon minimal 10 digit';
            }
            if (!/^[0-9+\-\s()]+$/.test(formData.noTelepon)) {
                newErrors.noTelepon = 'Format nomor telepon tidak valid';
            }
        }

        if (formData.alamat.trim().length > 500) {
            newErrors.alamat = 'Alamat maksimal 500 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const res = await fetch(`http://localhost:8080/api/users/${currentUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccessMessage('Profil berhasil diperbarui!');
                const newSession = { ...currentUser, username: formData.username };
                localStorage.setItem('userSession', JSON.stringify(newSession));

                setTimeout(() => router.push('/profile'), 1500);
            } else {
                const errorText = await res.text();
                setErrors({ general: errorText || 'Gagal memperbarui profil' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setErrors({ general: 'Koneksi terputus. Gagal memperbarui profil.' });
        } finally {
            setIsSaving(false);
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
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
                        ✓ {successMessage}
                    </div>
                )}

                {/* General Error */}
                {errors.general && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                        ✗ {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">✗ {errors.username}</p>
                            )}
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
                                placeholder="08123456789"
                                className={`w-full bg-gray-50 border ${errors.noTelepon ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none`}
                            />
                            {errors.noTelepon && (
                                <p className="text-red-500 text-xs mt-1">✗ {errors.noTelepon}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                rows={3}
                                maxLength={500}
                                placeholder="Masukkan alamat lengkap..."
                                className={`w-full bg-gray-50 border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.alamat ? (
                                    <p className="text-red-500 text-xs">✗ {errors.alamat}</p>
                                ) : (
                                    <p className="text-xs text-gray-400">{formData.alamat.length}/500 karakter</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSaving ? '⏳ Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </div>
    );
}
