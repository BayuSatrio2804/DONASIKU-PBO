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

return (
  <>
    {/* Top Header */}
    <div className="bg-primary text-white pt-6 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Daftar Penerima Aplikasi Donasiku</h1>
           
          </div>
        </div>
      </div>

    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* ===== CARD UTAMA ===== */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Image */}
        <div className="w-full md:w-1/3">
          <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Informasi Donasi
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Donasiku mendukung penyaluran donasi ke:
            <span className="font-medium text-gray-800">
              {" "}Komunitas, Panti Asuhan, dan Panti Jompo
            </span>.
          </p>
        </div>
      </div>

      {/* ===== SECTION JELAJAHI ===== */}
      <div>
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Jelajahi</h3>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {/* Circle Image */}
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>

              {/* Text */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Komunitas
                </h4>
                <p className="text-sm text-gray-600">
                  Komunitas yang bergerak dalam bidang sosial dan tersebar
                  seluruh Bandung.
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Detail
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                🏠
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Panti Asuhan
                </h4>
                <p className="text-sm text-gray-600">
                  Komunitas yang bergerak dalam bidang sosial dan tersebar
                  seluruh Bandung.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Detail
              </button>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                👴
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Panti Jompo
                </h4>
                <p className="text-sm text-gray-600">
                  Komunitas yang bergerak dalam bidang sosial dan tersebar
                  seluruh Bandung.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Detail
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
