import { useState } from "react";
import { FiX, FiCheckCircle, FiUpload, FiPackage } from "react-icons/fi";
import { fulfillPermintaan } from "../services/permintaanService";
import { showSuccess, showError } from "../utils/sweetalert";
import { getLokasiString } from "../utils/backendHelpers";

const FulfillmentModal = ({ request, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jumlah: request?.jumlah || request?.target_jumlah || 1,
        deskripsi: "",
        lokasi: request?.lokasi?.alamatLengkap || (typeof request?.lokasi === 'string' ? request.lokasi : "") || "",
        nama: request?.judul || request?.nama || "Item Donasi",
        kategori: request?.kategori || "pakaian",
        image: null // Base64
    });
    const [preview, setPreview] = useState(null);
    const [showProof, setShowProof] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData({ ...formData, image: reader.result, file: file }); // Store Raw File
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.image && !request.donation) {
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
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Permintaan:</p>
                                <h3 className="font-bold text-[#00306C] text-lg flex items-center gap-2">
                                    <FiPackage /> {request.judul}
                                </h3>
                                <p className="text-gray-600 mt-2 text-sm">{request.deskripsi}</p>
                                <div className="mt-2 text-xs font-semibold text-gray-500">
                                    Kebutuhan: {request.jumlah || request.target_jumlah} Pcs • {getLokasiString(request.lokasi)}
                                </div>
                            </div>
                            {/* Toggle Bukti Kebutuhan */}
                            {request.image && (
                                <button
                                    type="button"
                                    onClick={() => setShowProof(!showProof)}
                                    className="text-xs font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                                >
                                    {showProof ? <FiX /> : <FiCheckCircle />} {showProof ? "Tutup Bukti" : "Lihat Bukti"}
                                </button>
                            )}
                        </div>

                        {/* Proof Image Display */}
                        {showProof && request.image && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <img
                                    src={
                                        request.image.startsWith('data:')
                                            ? request.image
                                            : request.image.startsWith('http')
                                                ? request.image
                                                : request.image.startsWith('storage/')
                                                    ? `http://localhost:8080/${request.image}`
                                                    : `http://localhost:8080/storage/${request.image}`
                                    }
                                    alt="Bukti Kebutuhan"
                                    className="w-full max-h-64 object-contain rounded-lg border-2 border-dashed border-gray-300 bg-white"
                                />
                                <p className="text-center text-xs text-gray-500 mt-1">Foto Bukti Kebutuhan Penerima</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Hidden Fields for Auto-fill */}
                        <input type="hidden" name="nama" value={formData.nama} />
                        <input type="hidden" name="kategori" value={formData.kategori} />
                        <input type="hidden" name="lokasi" value={formData.lokasi} />

                        {/* Quantity Field - Kept for partial fulfillment flexibility */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah yang Didonasikan</label>
                            <input
                                type="number"
                                name="jumlah"
                                value={formData.jumlah}
                                onChange={handleChange}
                                min="1"
                                max={request.target_jumlah}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00306C] outline-none text-lg font-bold text-center"
                                required
                            />
                            <p className="text-xs text-center text-gray-500 mt-1">
                                Target permintaan: {request.target_jumlah} Pcs
                            </p>
                        </div>

                        {/* Image Upload Section - Main Focus */}
                        {!request.donation && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                                    Upload Foto Barang (Wajib)
                                </label>
                                <div className="border-2 border-dashed border-[#00306C]/30 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {preview ? (
                                        <div className="relative">
                                            <img src={preview} alt="Preview" className="h-48 mx-auto object-contain rounded-lg shadow-sm" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white font-bold text-sm">
                                                Ganti Foto
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <div className="w-16 h-16 bg-blue-100 text-[#00306C] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <FiUpload className="text-3xl" />
                                            </div>
                                            <p className="font-bold text-gray-700">Klik untuk Upload Foto</p>
                                            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, JPEG</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* If donation exists (rare case in fulfill flow but good to handle) */}
                        {request.donation && (
                            <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 border border-green-200">
                                {request.donation.image && (
                                    <img
                                        src={
                                            request.donation.image.startsWith('http') || request.donation.image.startsWith('data:')
                                                ? request.donation.image
                                                : request.donation.image.startsWith('storage/')
                                                    ? `http://localhost:8080/${request.donation.image}`
                                                    : `http://localhost:8080/storage/${request.donation.image}`
                                        }
                                        alt="Donasi"
                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                    />
                                )}
                                <div>
                                    <p className="font-bold text-green-800 text-sm">Menggunakan Foto dari Donasi</p>
                                    <p className="text-xs text-green-600">Foto barang diambil otomatis dari data donasi Anda.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || (!preview && !request.donation)}
                                className="w-full bg-gradient-to-r from-[#00306C] to-[#0063FF] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 disabled:shadow-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </span>
                                ) : 'Kirim Barang Sekarang 🚀'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FulfillmentModal;
