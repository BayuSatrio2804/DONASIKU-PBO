'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DonasiBarangPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [donasiItems, setDonasiItems] = useState<Array<{ id: string; name: string }>>([]);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

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

  const handlePreview = () => {
    console.log('Preview...');
  };

  return (
<main className="container mx-auto px-4 py-8 -mt-6">
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-900 text-2xl">📦</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Donasi Barang</h2>
        <p className="text-gray-600">Letakkan barang di sini untuk didonasikan</p>
      </div>
    </div>

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

      <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
        {uploadedFile ? (
          <span className="text-green-600 text-3xl">✓</span>
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
        onClick={handleSaveDraft}
        className="flex-1 border-2 border-blue-900 text-blue-900 py-3 rounded-xl font-semibold hover:bg-blue-50"
      >
        Simpan Draft
      </button>
      <button
        type="button"
        onClick={handlePreview}
        className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800"
      >
        Preview
      </button>
    </div>

  </div>
</main>
  );
}

