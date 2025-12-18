'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DonasiBarangPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [donasiItems, setDonasiItems] = useState<Array<{ id: string; name: string }>>([]);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [locationSearch, setLocationSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const removeDonationItem = (id: string) => {
    setDonasiItems(donasiItems.filter(item => item.id !== id));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...');
  };

  const handleSubmitDonasi = async () => {
    // Validasi form
    if (!productName.trim()) {
      setError('Nama produk harus diisi');
      return;
    }
    if (!productDesc.trim()) {
      setError('Deskripsi produk harus diisi');
      return;
    }
    if (!locationSearch.trim()) {
      setError('Lokasi harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user data from localStorage
      const sessionStr = localStorage.getItem('userSession');
      if (!sessionStr) {
        setError('Anda harus login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const userData = JSON.parse(sessionStr);

      // Create FormData untuk upload file
      const formData = new FormData();
      formData.append('namaBarang', productName);
      formData.append('deskripsi', productDesc);
      formData.append('jumlah', jumlah);
      formData.append('lokasi', locationSearch);
      formData.append('userId', userData.userId || '');

      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await fetch('http://localhost:8080/api/donasi', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim donasi');
      }

      setSuccess(true);
      setProductName('');
      setProductDesc('');
      setLocationSearch('');
      setUploadedFile(null);

      // Redirect to dashboard setelah 2 detik
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Error submitting donasi:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 -mt-6">
      <div className="max-w-7xl  px-6 -mt-6 mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-900 text-2xl">📦</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Donasi Barang</h2>
              <p className="text-gray-600">Letakkan barang di sini untuk didonasikan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            ← Kembali
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Donasi berhasil dikirim! Mengalihkan ke dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ✗ {error}
          </div>
        )}

        {/* File Upload */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 cursor-pointer hover:border-blue-500 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
          />

          <div className={`mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden ${uploadedFile && uploadedFile.type.startsWith('image/') ? 'w-48 h-48 rounded-2xl' : 'w-20 h-20'}`}>
            {uploadedFile ? (
              uploadedFile.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                />
              ) : (
                <span className="text-green-600 text-3xl">✓</span>
              )
            ) : (
              <span className="text-blue-900 text-3xl">⬆️</span>
            )}
          </div>

          {uploadedFile ? (
            <>
              <p className="font-medium text-gray-900 truncate">
                {uploadedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Hapus file
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-2">Drag & drop atau</p>
              <button
                type="button"
                className="bg-blue-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800"
              >
                Pilih File
              </button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, PDF (max 10MB)
              </p>
            </>
          )}
        </div>

        {/* Donation Items */}
        {donasiItems.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">
                Barang Donasi ({donasiItems.length})
              </h3>
              <button
                type="button"
                onClick={() => setDonasiItems([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-2">
              {donasiItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-800">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDonationItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Name */}
        <div className="mb-6">
          <label className="font-medium text-gray-900 block mb-2">
            Nama Produk
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Contoh: Baju Anak Laki-laki"
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="font-medium text-gray-900 block mb-2">
            Jumlah Barang
          </label>
          <input
            type="number"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Contoh: 5"
            min="1"
          />
        </div>

        {/* Location */}

        {/* Product Description */}
        <div className="mb-6">
          <label className="font-medium text-gray-900 block mb-2">
            Deskripsi Produk
          </label>
          <textarea
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-3 resize-none"
            placeholder="Jelaskan kondisi dan detail barang"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="font-medium text-gray-900 block mb-2">
            Lokasi
          </label>
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Alamat pengambilan"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSubmitDonasi}
            disabled={loading}
            className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-100"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            className="flex-1 border-2 border-blue-900 text-blue-900 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Preview
          </button>
        </div>

      </div>
    </main>
  );
}

