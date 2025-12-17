'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MAX_TITLE_LENGTH = 50;
const MAX_DESC_LENGTH = 200;

export default function BuatPermintaanPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [location, setLocation] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const fullDescription = `[${category}] ${description}\n\nUrgent: ${isUrgent ? 'Yes' : 'No'}\nLocation: ${location}`;

        // Construct PermintaanDonasi payload
        const payload = {
            jenisBarang: title, // Mapping Title to Jenis Barang
            jumlah: parseInt(quantity),
            deskripsiKebutuhan: fullDescription,
            status: "OPEN",
            penerima: { userId: 1 }, // Hardcoded
            lokasi: { lokasiId: 1 } // Hardcoded
        };

        try {
            const response = await fetch('http://localhost:8080/api/permintaan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Permintaan berhasil dibuat!');
                router.push('/dashboard');
            } else {
                const errText = await response.text();
                alert('Gagal membuat permintaan: ' + errText);
            }
        } catch (error) {
            console.error('Error creating request:', error);
            alert('Terjadi kesalahan koneksi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-primary text-white pt-6 pb-6 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-bold">Buat Permintaan Barang</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

                    {/* Warning Banner */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3 text-orange-800 text-sm">
                        <span className="text-lg">📢</span>
                        <p>Pastikan Anda meminta barang yang benar-benar dibutuhkan. Permintaan akan diverifikasi oleh sistem.</p>
                    </div>

                    {/* Judul Permintaan */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="title" className="font-semibold text-gray-900">Judul Permintaan</label>
                            <span className="text-xs text-gray-500">{title.length}/{MAX_TITLE_LENGTH}</span>
                        </div>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                            placeholder="Contoh: Butuh Buku Pelajaran SD Kelas 1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label htmlFor="category" className="block font-semibold text-gray-900 mb-2">Kategori Barang</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="pakaian">Pakaian</option>
                            <option value="buku">Buku</option>
                            <option value="elektronik">Elektronik</option>
                            <option value="makanan">Makanan</option>
                            <option value="obat">Obat-obatan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label htmlFor="quantity" className="block font-semibold text-gray-900 mb-2">Jumlah Dibutuhkan</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Contoh: 5"
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label htmlFor="location" className="block font-semibold text-gray-900 mb-2">Lokasi Pengiriman</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Masukkan alamat lengkap"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="description" className="font-semibold text-gray-900">Alasan / Deskripsi</label>
                            <span className="text-xs text-gray-500">{description.length}/{MAX_DESC_LENGTH}</span>
                        </div>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))}
                            placeholder="Jelaskan kenapa Anda membutuhkan barang ini..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    {/* Urgent Switch */}
                    <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100">
                        <div>
                            <h3 className="font-semibold text-red-900">Kebutuhan Mendesak?</h3>
                            <p className="text-xs text-red-700">Aktifkan jika barang dibutuhkan segera (Urgent)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isUrgent}
                                onChange={(e) => setIsUrgent(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? 'Mengirim Permintaan...' : 'Ajukan Permintaan'}
                    </button>

                </form>
            </div>
        </div>
    );
}
