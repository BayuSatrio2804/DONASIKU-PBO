'use client';

import { useState } from 'react';
import Image from 'next/image';

const categories = ['All', 'Baju', 'Celana', 'Elektro', 'Sport'];

const donationItems = [
  {
    id: 1,
    name: 'Baju Pria Dewasa',
    category: 'Baju',
    location: 'Bojongsoang',
    image: '/dummy/bajuPria.jpg',
  },
  {
    id: 2,
    name: 'Sepatu Anak',
    category: 'Sport',
    location: 'Bojongsoang',
    image: '/dummy/sepatuAnak.jpg',
  },
  {
    id: 3,
    name: 'Tas Sekolah Anak',
    category: 'Baju',
    location: 'Bojongsoang',
    image: '/dummy/tasSekolahAnak.jpeg',
  },
  {
    id: 4,
    name: 'Celana Pria',
    category: 'Celana',
    location: 'Bojongsoang',
    image: '/dummy/celanaPria.jpg',
  },
  {
    id: 5,
    name: 'Sepatu Dewasa',
    category: 'Sport',
    location: 'Bojongsoang',
    image: '/dummy/sepatuPria.jpg',
  },
  {
    id: 6,
    name: 'Celana Pria Jeans',
    category: 'Celana',
    location: 'Bojongsoang',
    image: '/dummy/celanaPriaJeans.jpg',
  },

  // ===== DUMMY BARU =====
  {
    id: 7,
    name: 'Jaket Pria',
    category: 'Baju',
    location: 'Antapani',
    image: '/dummy/jaketPriaPreloved.jpg',
  },
  {
    id: 8,
    name: 'Kaos Wanita',
    category: 'Baju',
    location: 'Cibiru',
    image: '/dummy/kaosWanita.jpg',
  },
  {
    id: 9,
    name: 'Tas Ransel Dewasa',
    category: 'Baju',
    location: 'Cicaheum',
    image: '/dummy/tasRanselDewasa.jpg',
  },
  {
    id: 10,
    name: 'Sepatu Olahraga',
    category: 'Sport',
    location: 'Ujungberung',
    image: '/dummy/sepatuOlahraga.jpg',
  },
  {
    id: 11,
    name: 'Celana Anak',
    category: 'Celana',
    location: 'Arcamanik',
    image: '/dummy/celanaAnak.jpg',
  },
  {
    id: 12,
    name: 'Sweater Dewasa',
    category: 'Baju',
    location: 'Dago',
    image: '/dummy/sweaterDewasa.jpeg',
  },
];


export default function BarangDonasiPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = donationItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === 'All' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* ===== HEADER ===== */}
      <div className="bg-blue-900 text-white rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-10">
          <h1 className="text-xl font-bold mb-3">Barang Donasiku</h1>

          <div className="bg-blue-800 w-fit px-3 py-1 rounded-full text-sm">
            📍 Bandung
          </div>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">

        <div className="bg-white rounded-2xl shadow-md p-3 flex items-center gap-3">
          🔍
          <input
            type="text"
            placeholder="Cari barang yang kamu inginkan"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          ⚙️
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="max-w-7xl mx-auto px-6 mt-4">

        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===== GRID BARANG ===== */}
<div className="max-w-7xl mx-auto px-6 mt-8">
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {filteredItems.map(item => (
      <div
        key={item.id}
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
      >
        <div className="relative w-full h-44 bg-gray-200">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-base leading-tight">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            📍 {item.location}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* ===== BOTTOM NAV ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex justify-around py-3 text-xs">
          <NavItem label="Home" icon="🏠" />
          <NavItem label="Donasi" icon="🎁" active />
          <NavItem label="Riwayat" icon="⏱️" />
          <NavItem label="Profile" icon="👤" />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        active ? 'text-blue-900 font-semibold' : 'text-gray-500'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </div>
  );
}
