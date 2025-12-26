import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiFileText, FiMapPin, FiSend, FiArrowLeft, FiImage } from "react-icons/fi";
import { createPermintaanSaya } from "../services/permintaanService";
import { showSuccess, showError } from "../utils/sweetalert";
import { getAuthData } from "../utils/localStorage";

const RequestForm = () => {
    const navigate = useNavigate();
    const user = getAuthData();
    const [formData, setFormData] = useState({
        judul: "",
        kategori: "Pakaian",
        target_jumlah: 1,
        lokasi: "",
        deskripsi: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = ["Pakaian", "Elektronik", "Buku", "Mainan", "Perabotan", "Lainnya"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showError('File Terlalu Besar', 'Ukuran file maksimal adalah 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.judul || !formData.lokasi) {
            showError("Data Tidak Lengkap", "Mohon lengkapi Judul dan Lokasi");
            setLoading(false);
            return;
        }

        try {
            // Backend expects FormData with @RequestParam fields:
            // judul, deskripsi, kategori, target_jumlah, lokasi, userId, file
            const formDataToSend = new FormData();
            formDataToSend.append('judul', formData.judul);
            formDataToSend.append('deskripsi', formData.deskripsi);
            formDataToSend.append('kategori', formData.kategori);
            formDataToSend.append('target_jumlah', parseInt(formData.target_jumlah));
            formDataToSend.append('lokasi', formData.lokasi);
            formDataToSend.append('userId', user?.userId || user?.id);

            // Add image file if selected
            if (imageFile) {
                formDataToSend.append('file', imageFile);
            }

            await createPermintaanSaya(formDataToSend);
            await showSuccess('Berhasil', 'Permintaan berhasil diajukan!');
            navigate('/penerima/permintaan-saya');
        } catch (error) {
            console.error('Error submitting request:', error);
            showError('Gagal', error.message || 'Gagal mengajukan permintaan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#00306C] font-medium transition-colors"
            >
                <FiArrowLeft /> Kembali
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#00306C] px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Ajukan Permintaan Barang</h1>
                    <p className="text-blue-200 mt-1">Buat permintaan baru agar donatur dapat membantu memenuhi kebutuhan Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Judul / Jenis Barang */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Barang yang dibutuhkan *</label>
                        <div className="relative">
                            <FiPackage className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="judul"
                                value={formData.judul}
                                onChange={handleChange}
                                placeholder="Contoh: Laptop untuk Sekolah"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00306C] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Kategori & Jumlah */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori *</label>
                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00306C] focus:border-transparent outline-none transition-all bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah *</label>
                            <input
                                type="number"
                                name="target_jumlah"
                                value={formData.target_jumlah}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00306C] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Penerimaan *</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                                placeholder="Alamat lengkap tujuan pengiriman"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00306C] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Detail Kebutuhan</label>
                        <div className="relative">
                            <FiFileText className="absolute left-3 top-3.5 text-gray-400" />
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Jelaskan secara detail mengapa barang ini dibutuhkan..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00306C] focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Upload Gambar Bukti */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Bukti Kebutuhan (Opsional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#00306C] transition-colors">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Hapus Gambar
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <FiImage className="text-4xl text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">Klik untuk upload gambar bukti</p>
                                    <p className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG)</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00306C] hover:bg-[#001F4D] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Mengirim...' : (
                            <>
                                <FiSend /> Kirim Permintaan
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default RequestForm;
