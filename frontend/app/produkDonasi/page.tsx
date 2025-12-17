'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const dummyProduk = [
  { id: 1, nama: 'Sepatu Anak', lokasi: 'Bojongsang', image: '/dummy/sepatuAnak.jpg' },
  { id: 2, nama: 'Baju Pria Dewasa', lokasi: 'Bandung', image: '/dummy/bajuPria.jpg' },
  { id: 3, nama: 'Tas Sekolah Anak', lokasi: 'Cimahi', image: '/dummy/tasSekolahAnak.jpeg' },
  { id: 4, nama: 'Celana Pria', lokasi: 'Bandung', image: '/dummy/celanaPria.jpg' },
  { id: 5, nama: 'Celana Jeans Pria', lokasi: 'Lembang', image: '/dummy/celanaPriaJeans.jpg' },
  { id: 6, nama: 'Sepatu Pria', lokasi: 'Soreang', image: '/dummy/sepatuPria.jpg' },
  { id: 7, nama: 'Kaos Wanita', lokasi: 'Bandung', image: '/dummy/kaosWanita.jpg' },
  { id: 8, nama: 'Sepatu Olahraga', lokasi: 'Cileunyi', image: '/dummy/sepatuOlahraga.jpg' },
];

export default function ProdukDonasiPage() {
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-10 py-10">
      <h1 className="text-2xl font-semibold mb-8">Produk Donasi</h1>

      <div className="grid grid-cols-4 gap-8">
        {dummyProduk.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/produkDonasi/${item.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-4"
          >
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-200">
              <Image
                src={item.image}
                alt={item.nama}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="mt-4 font-semibold">{item.nama}</h3>
            <p className="text-sm text-gray-500">📍 {item.lokasi}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
