'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const categories = ['All', 'Komunitas', 'Panti Asuhan', 'Panti Jompo'];

const requestItems = [
  {
    id: 1,
    title: 'Pakaian Anak',
    penerima: 'Panti Asuhan Ceria Bandung',
    kategori: 'Panti Asuhan',
    lokasi: 'JL. Pandjaitan Bandung',
    image: '/dummy/dinsos.png',
  },
  {
    id: 2,
    title: 'Sepatu Anak',
    penerima: 'Komunitas Peduli Anak',
    kategori: 'Komunitas',
    lokasi: 'Antapani',
    image: '/dummy/dinsos.png',
  },
  {
    id: 3,
    title: 'Selimut Lansia',
    penerima: 'Panti Jompo Sejahtera',
    kategori: 'Panti Jompo',
    lokasi: 'Cicaheum',
    image: '/dummy/dinsos.png',
  },
];

export default function PermintaanBarangPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = requestItems.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.penerima.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === 'All' || item.kategori === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ===== HEADER ===== */}
      <div className="bg-blue-900 text-white rounded-b-3xl">
        <div className="max-w-md mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-xl">←</button>
            <h1 className="text-lg font-semibold">Permintaan Barang</h1>
          </div>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="max-w-md mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-md p-3 flex items-center gap-3">
          🔍
          <input
            type="text"
            placeholder="Cari barang atau penerima"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          ⚙️
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===== ITEM LIST ===== */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <h2 className="font-semibold mb-3">Item</h2>

        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => router.push('/detailPenerima')}
              className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="w-14 h-14 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  Penerima : {item.penerima}
                </p>
                <p className="text-sm text-gray-500">
                  Lokasi : {item.lokasi}
                </p>

                <div className="flex justify-end mt-3">
                  <button className="bg-blue-900 text-white text-sm px-4 py-1.5 rounded-full">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
