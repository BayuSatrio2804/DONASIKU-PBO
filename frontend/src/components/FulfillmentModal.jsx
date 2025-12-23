import { useState } from "react";
import { FiX, FiCheckCircle, FiUpload, FiPackage } from "react-icons/fi";
import { fulfillPermintaan } from "../services/permintaanService";
import { showSuccess, showError } from "../utils/sweetalert";

const FulfillmentModal = ({ request, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jumlah: request.target_jumlah,
        deskripsi: "",
        lokasi: request.lokasi,
        nama: request.judul, // Default name matches request
        kategori: request.kategori,
        image: null // Base64
    });
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.image) {
            showError("Foto Dibutuhkan", "Mohon sertakan foto barang yang akan didonasikan.");
            setLoading(false);
            return;
        }

        try {
            await fulfillPermintaan(request.id, formData);
            await showSuccess("Terima kasih!", "Permintaan berhasil dipenuhi.");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            showError("Gagal", "Gagal memproses donasi: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">Penuhi Permintaan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                        <p className="text-sm text-gray-500 mb-1">Permintaan:</p>
                        <h3 className="font-bold text-[#00306C] text-lg flex items-center gap-2">
                            <FiPackage /> {request.judul}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm">{request.deskripsi}</p>
                        <div className="mt-2 text-xs font-semibold text-gray-500">
                            Kebutuhan: {request.target_jumlah} Pcs • {request.lokasi}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang Donasi</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00306C] outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah</label>
                                <input
                                    type="number"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00306C] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                                <input
                                    type="text"
                                    name="kategori"
                                    value={formData.kategori}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi Barang Anda</label>
                            <input
                                type="text"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00306C] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi & Kondisi</label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Jelaskan kondisi barang donasi Anda..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00306C] outline-none resize-none"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Foto Barang</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-32 mx-auto object-contain rounded" />
                                ) : (
                                    <div className="text-gray-500">
                                        <FiUpload className="mx-auto text-xl mb-1" />
                                        <span className="text-xs">Upload Foto</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00306C] text-white font-bold py-3 rounded-xl hover:bg-[#001F4D] transition-colors disabled:opacity-70"
                            >
                                {loading ? 'Memproses...' : 'Kirim Donasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FulfillmentModal;
