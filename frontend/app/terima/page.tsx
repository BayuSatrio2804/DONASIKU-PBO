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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  /* ===== RENDER ===== */
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
 
      {/* Top Header */}
      <div className="bg-primary text-white pt-6 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Penerimaan Barang</h1>
           
          </div>
        </div>
      </div>

{/* Main Content */}
<main className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
  <div className="flex flex-col md:flex-row gap-6">

    {/* Card Donasi Barang */}
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <img
  src="/DonasiBarang.png"
  alt="Donasi Barang"
  className="w-full object-contain rounded-t-2xl"
/>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-gray-800">
          Lihat Barang Donasi
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Cari barang kebutuhan dari yang diberikan para donatur
        </p>
<button
  onClick={() => router.push('/produkDonasi')}
  className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
>
  Mulai Donasi
</button>
      </div>
    </div>

    {/* Card Permintaan Barang */}
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
     <img
  src="/PermintaanBarang.png"
  alt="PermintaanBarang"
  className="w-full object-contain rounded-t-2xl"
/>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-gray-800">
          Permintaan Barang
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Ajukan kebutuhan barang yang diperlukan kepada donatur
        </p>
<button
  onClick={() => router.push('/pengajuanBarang')}
  className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
>
  Cari Permintaan
</button>

      </div>
    </div>

  </div>
</main>

    </div>
  );
}
