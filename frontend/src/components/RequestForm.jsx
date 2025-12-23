import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiFileText, FiMapPin, FiImage, FiSend, FiArrowLeft } from "react-icons/fi";
import API from "../services/api";
import { getAuthData } from "../utils/localStorage";
import { showSuccess, showError } from "../utils/sweetalert";

const RequestForm = () => {
    const navigate = useNavigate();
    const user = getAuthData();
    const [formData, setFormData] = useState({
        judul: "",
        kategori: "Pakaian",
        target_jumlah: 1,
        lokasi: "",
        deskripsi: "",
        image: null, // Base64
        bukti_file: null // File object
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [buktiPreview, setBuktiPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Kategori options
    const categories = ["Pakaian", "Elektronik", "Buku", "Mainan", "Perabotan", "Lainnya"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBuktiChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, bukti_file: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setBuktiPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.judul || !formData.lokasi || !formData.image) {
            showError("Data Tidak Lengkap", "Mohon lengkapi data wajib (Judul, Lokasi, Gambar)");
            setLoading(false);
            return;
        }

        try {
            // Prepare FormData (for file upload 'bukti_kebutuhan' AND normal fields)
            // But Controller expects 'image' as Base64 string in body, while 'bukti_kebutuhan' as file.
            // Using FormData is safest for file, but need to check Controller.
            // step 34 Controller: store(Request $request)
            // $base64Image = $validated['image']; (string)
            // $file = $request->file('bukti_kebutuhan');
            // So we send FormData.

            const submitData = new FormData();
            submitData.append('judul', formData.judul);
            submitData.append('kategori', formData.kategori);
            submitData.append('target_jumlah', formData.target_jumlah);
            submitData.append('lokasi', formData.lokasi);
            submitData.append('deskripsi', formData.deskripsi);
            submitData.append('image', formData.image); // This is Base64 string

            if (formData.bukti_file) {
                submitData.append('bukti_kebutuhan', formData.bukti_file);
            }

            // Note: donation_id is NOT sent (it will be null)

            const response = await API.post('/permintaan-sayas', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios usually handles this with FormData
                }
            });

            await showSuccess('Berhasil', 'Permintaan berhasil diajukan!');
            navigate('/penerima/permintaan-saya');
        } catch (error) {
            console.error('Error submitting request:', error);
            showError('Gagal', 'Gagal mengajukan permintaan: ' + (error.response?.data?.message || error.message));
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

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Apa yang Anda butuhkan? *</label>
                        <div className="relative">
                            <FiPackage className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="judul"
                                value={formData.judul}
                                onChange={handleChange}
                                placeholder="Contoh: Laptop untuk Sekolah, Pakaian Bayi, dll"
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ceritakan kebutuhan Anda</label>
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

                    {/* Upload Image (Base64 for Item Visualization) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Visualisasi Barang yang Dibutuhkan *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required={!formData.image}
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-40 mx-auto object-contain rounded-lg" />
                            ) : (
                                <div className="space-y-2 py-4">
                                    <FiImage className="mx-auto text-4xl text-gray-400" />
                                    <p className="text-sm text-gray-500">Klik atau drag foto contoh barang di sini</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Bukti (Optional) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bukti Kebutuhan (Opsional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleBuktiChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {buktiPreview ? (
                                <div className="text-green-600 font-medium">✓ File bukti terpilih</div>
                            ) : (
                                <p className="text-sm text-gray-500 py-2">Upload dokumen/foto pendukung (KK, Surat Keterangan, dll)</p>
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
