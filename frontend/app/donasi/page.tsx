'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ===== TYPES ===== */
type DonationItem = {
  id: number;
  name: string;
};

type SampleItem = {
  id: number;
  name: string;
  category: string;
  condition: 'Baru' | 'Baik' | 'Layak Pakai';
};

type RequestItem = {
  id: number;
  title: string;
  location: string;
  urgent: boolean;
};

/* ===== DATA ===== */
const SAMPLE_ITEMS: SampleItem[] = [
  { id: 1, name: 'Baju Anak Laki-laki', category: 'Pakaian', condition: 'Layak Pakai' },
  { id: 2, name: 'Buku Pelajaran SD', category: 'Buku', condition: 'Baik' },
  { id: 3, name: 'Mainan Edukasi', category: 'Mainan', condition: 'Baru' },
  { id: 4, name: 'Sepatu Sekolah', category: 'Sepatu', condition: 'Layak Pakai' },
  { id: 5, name: 'Tas Sekolah', category: 'Aksesoris', condition: 'Baik' },
  { id: 6, name: 'Jaket Anak', category: 'Pakaian', condition: 'Layak Pakai' },
];

const SAMPLE_REQUESTS: RequestItem[] = [
  { id: 1, title: 'Susu Formula Bayi', location: 'Jakarta Selatan', urgent: true },
  { id: 2, title: 'Diapers Size M', location: 'Bandung', urgent: false },
  { id: 3, title: 'Selimut Bayi', location: 'Surabaya', urgent: true },
  { id: 4, title: 'Bubur Bayi Organik', location: 'Yogyakarta', urgent: false },
];

/* ===== CONSTANTS ===== */
const MAX_NAME_LENGTH = 22;
const MAX_DESC_LENGTH = 200;

/* ===== COMPONENT ===== */
export default function DashboardDonasi() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [donasiItems, setDonasiItems] = useState<DonationItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productQty, setProductQty] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'info' } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const showToast = (message: string, kind: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, kind });
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  /* ===== FILTERED DATA ===== */
  const filteredRequests = SAMPLE_REQUESTS.filter(request =>
    request.title.toLowerCase().includes(requestSearch.toLowerCase()) ||
    request.location.toLowerCase().includes(requestSearch.toLowerCase())
  );

  /* ===== HANDLERS ===== */
  const handleAddDonation = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      showToast('Masukkan nama barang terlebih dahulu', 'error');
      return;
    }

    const newItem: DonationItem = {
      id: Date.now(),
      name: trimmedQuery,
    };

    setDonasiItems(prev => [...prev, newItem]);
    setSearchQuery('');
  };

  const removeDonationItem = (id: number) => {
    setDonasiItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran file maksimal 10MB', 'error');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Format file harus JPG, PNG, atau PDF', 'error');
      return;
    }

    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran file maksimal 10MB', 'error');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Format file harus JPG, PNG, atau PDF', 'error');
      return;
    }

    setUploadedFile(file);
  };

  const handleSaveDraft = () => {
    if (!productName.trim()) {
      showToast('Nama produk tidak boleh kosong', 'error');
      return;
    }

    try {
      const draft = {
        name: productName,
        description: productDesc,
        location: locationSearch,
        file: uploadedFile?.name,
        items: donasiItems,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('donasiDraft', JSON.stringify(draft));
      showToast('Draft berhasil disimpan!', 'success');
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Gagal menyimpan draft', 'error');
    }
  };

  const handlePreview = () => {
    if (!productName.trim() || !productDesc.trim()) {
      showToast('Lengkapi nama dan deskripsi produk terlebih dahulu', 'error');
      return;
    }

    console.log('Preview data:', {
      productName,
      productDesc,
      location: locationSearch,
      uploadedFile: uploadedFile ? uploadedFile.name : 'No file',
      donasiItems,
    });

    showToast('Fitur preview akan ditampilkan di sini', 'info');
  };

  const handleStartDonation = async () => {
    // Validation: Either items list OR product details must be present. 
    // Since productName is required below, we can skip specific list check here or merge them.
    // We'll trust the productName check later.

    if (!productName.trim() || !productDesc.trim()) {
      showToast('Lengkapi informasi produk terlebih dahulu', 'error');
      return;
    }

    // Show confirmation
    const confirmDonation = window.confirm(
      `Anda akan mendonasikan ${donasiItems.length} barang.\n` +
      `Nama Produk: ${productName}\n` +
      `Lokasi: ${locationSearch || 'Belum diisi'}\n\n` +
      'Apakah Anda yakin ingin melanjutkan?'
    );

    if (confirmDonation) {
      // Construct description from product details and items list
      const itemsList = donasiItems.map(item => `- ${item.name}`).join('\n');
      const fullDescription = `Title: ${productName}\n\nDescription: ${productDesc}\n\nItems:\n${itemsList}\n\nLocation: ${locationSearch}`;

      const payload = {
        deskripsi: fullDescription,
        kategori: 'Lainnya', // Default category as form doesn't have one
        foto: uploadedFile ? uploadedFile.name : null,
        jumlah: productQty,
        lokasiId: 1, // Hardcoded for test user
        donaturId: 1 // Hardcoded for test user
      };

      try {
        const response = await fetch('http://localhost:8080/api/donasi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          showToast('Donasi berhasil disubmit! Terima kasih atas kontribusi Anda.', 'success');

          // Reset form
          setDonasiItems([]);
          setProductName('');
          setProductDesc('');
          setProductQty(1);
          setLocationSearch('');
          setUploadedFile(null);

          // Navigate to success page or refresh
          setTimeout(() => router.push('/dashboard'), 2000); // Redirect to dashboard instead of success page
        } else {
          const errorData = await response.text();
          showToast(`Gagal mengirim donasi: ${errorData}`, 'error');
          console.error('Donation failed:', errorData);
        }
      } catch (error) {
        console.error('Error submitting donation:', error);
        showToast('Terjadi kesalahan saat menghubungi server', 'error');
      }
    }
  };

  /* ===== KEYDOWN HANDLER ===== */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddDonation();
    }
  };



  /* ===== RENDER ===== */
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {toast && (
        <div className={`fixed right-6 bottom-6 z-50 px-4 py-3 rounded-lg shadow-lg ${toast.kind === 'success' ? 'bg-green-600 text-white' : toast.kind === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
          {toast.message}
        </div>
      )}
      {/* Top Header */}
      <div className="bg-primary text-white pt-6 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Barang Donasiku</h1>
            <button
              onClick={() => router.back()}
              className="text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              ← Kembali
            </button>
          </div>

          {/* Search & Add Donation */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari atau tambah barang donasi..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleAddDonation}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold transition-colors text-sm"
                >
                  + Tambah
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Tekan Enter atau klik tombol untuk menambahkan barang
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Donation Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-900 text-2xl">📦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Donasi Barang</h2>
                <p className="text-gray-600">Letakan barang disini untuk di Donasikan</p>
              </div>
            </div>

            {/* File Upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 hover:border-blue-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
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
                  <p className="text-gray-900 font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm bg-red-50 px-3 py-1 rounded-lg"
                  >
                    Hapus file
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Drag & drop atau</p>
                  <button
                    type="button"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-full transition-colors font-semibold"
                  >
                    Pilih File
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Format: JPG, PNG, PDF (max. 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Donation Items List */}
            {donasiItems.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Barang yang akan didonasikan ({donasiItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setDonasiItems([])}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {donasiItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-800">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDonationItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Hapus ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Form */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="productName" className="font-medium text-gray-900">
                    Nama Produk
                  </label>
                  <span className={`text-sm ${productName.length >= MAX_NAME_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                    {productName.length}/{MAX_NAME_LENGTH}
                  </span>
                </div>
                <div className="border border-gray-300 rounded-xl p-3 focus-within:border-blue-900 transition-colors">
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                    placeholder="Contoh: Baju Anak Laki-laki Ukuran 10"
                    className="w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                  />
                </div>
              </div>

              {/* Product Quantity */}
              <div>
                <label htmlFor="productQty" className="font-medium text-gray-900 block mb-2">
                  Jumlah Barang
                </label>
                <div className="border border-gray-300 rounded-xl p-3 focus-within:border-blue-900 transition-colors w-32">
                  <input
                    type="number"
                    id="productQty"
                    min="1"
                    value={productQty}
                    onChange={(e) => setProductQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full outline-none text-gray-900 bg-transparent"
                  />
                </div>
              </div>


              {/* Product Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="productDesc" className="font-medium text-gray-900">
                    Deskripsi Produk
                  </label>
                  <span className={`text-sm ${productDesc.length >= MAX_DESC_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                    {productDesc.length}/{MAX_DESC_LENGTH}
                  </span>
                </div>
                <div className="border border-gray-300 rounded-xl p-3 focus-within:border-blue-900 transition-colors">
                  <textarea
                    id="productDesc"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value.slice(0, MAX_DESC_LENGTH))}
                    placeholder="Jelaskan kondisi, ukuran, bahan, dan detail lainnya..."
                    rows={4}
                    className="w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent resize-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="productLocation" className="font-medium text-gray-900 block mb-2">
                  Lokasi Pengambilan
                </label>
                <div className="border border-gray-300 rounded-xl p-3 focus-within:border-blue-900 transition-colors">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-3">📍</span>
                    <input
                      type="text"
                      id="productLocation"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Masukkan alamat lengkap pengambilan donasi"
                      className="w-full outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contoh: Jl. Merdeka No. 123, Jakarta Pusat
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleStartDonation}
                  disabled={!productName.trim()}
                  className="flex-1 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!productName.trim() || !productDesc.trim()}
                  className="flex-1 py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview
                </button>
              </div>
            </div>




          </div>

          {/* Right Column - Requests */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-2xl">❤️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Permintaan Barang</h2>
                <p className="text-gray-600">Yuk bantu penuhi kebutuhan yang diperlukan</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Cari permintaan barang atau lokasi..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
              />
            </div>

            {/* Requests List */}
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-orange-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      {request.urgent && (
                        <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full animate-pulse">
                          🔥 Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <span className="mr-2">📍</span>
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <span className="mr-2">👥</span>
                      <span>3 orang membutuhkan</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Posted 2 hours ago</span>
                      <button
                        type="button"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-full transition-colors text-sm font-medium"
                        onClick={() => showToast(`Anda akan membantu: ${request.title}`, 'info')}
                      >
                        Bantu Sekarang
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg mb-2">😔</p>
                  <p>Tidak ditemukan permintaan dengan kata kunci "{requestSearch}"</p>
                  <button
                    type="button"
                    onClick={() => setRequestSearch('')}
                    className="mt-2 text-orange-600 hover:text-orange-800 text-sm"
                  >
                    Reset pencarian
                  </button>
                </div>
              )}
            </div>

            {/* See All Button */}
            <button
              type="button"
              className="w-full border-2 border-orange-500 text-orange-600 py-3 rounded-full mt-6 hover:bg-orange-50 transition-colors font-semibold"
              onClick={() => showToast('Fitur lihat semua permintaan', 'info')}
            >
              Lihat Semua Permintaan
            </button>
          </div>
        </div>

        {/* Recommended Items */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Barang yang sering didonasikan</h2>
            <button
              type="button"
              className="text-blue-900 hover:text-blue-700 text-sm font-medium"
              onClick={() => showToast('Fitur lihat semua barang', 'info')}
            >
              Lihat semua →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {SAMPLE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-blue-200"
                onClick={() => {
                  setSearchQuery(item.name);
                  // Scroll to search input
                  document.querySelector('input[type="text"]')?.scrollIntoView({ behavior: 'smooth' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(item.name)}
              >
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-5xl">
                    {item.category === 'Pakaian' && '👕'}
                    {item.category === 'Buku' && '📚'}
                    {item.category === 'Mainan' && '🧸'}
                    {item.category === 'Sepatu' && '👟'}
                    {item.category === 'Aksesoris' && '🎒'}
                    {!['Pakaian', 'Buku', 'Mainan', 'Sepatu', 'Aksesoris'].includes(item.category) && '📦'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate" title={item.name}>
                  {item.name}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.condition === 'Baru'
                      ? 'bg-green-100 text-green-800'
                      : item.condition === 'Baik'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {item.condition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Navigation */}
      </main >
    </div >
  );
}
