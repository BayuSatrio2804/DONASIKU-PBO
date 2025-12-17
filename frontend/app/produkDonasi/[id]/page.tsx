'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const dummyDetail = {
  nama: 'Sepatu Anak',
  lokasi: 'Bojongsang',
  donatur: 'M Imanilmaysah',
  tanggal: '19 Agustus 2025',
  penerima: 'Komunitas Wikimedia Bandung',
  founder: 'M. Faishal Wirahutama',
  kontak: '+62851-554-4734',
  anggota: '650 Anggota',
  image: '/dummy/sepatuAnak.jpg',
};

export default function DetailProdukDonasiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-10 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-xl">←</button>
          <h1 className="font-semibold text-lg">Barang Siap Ambil</h1>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-10 mt-8 space-y-6">
        <h2 className="font-semibold">Detail</h2>

        {/* CARD BARANG */}
        <div className="bg-white rounded-2xl shadow p-5 flex gap-5">
          <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-gray-200">
            <Image
              src={dummyDetail.image}
              alt="produk"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{dummyDetail.nama}</h3>
            <p className="text-sm text-gray-500">📍 {dummyDetail.lokasi}</p>

            <p className="text-sm mt-2">Nama Donatur</p>
            <p className="text-sm font-medium">{dummyDetail.donatur}</p>
            <p className="text-xs text-gray-400">{dummyDetail.tanggal}</p>
          </div>
        </div>

        {/* INFORMASI PENERIMA */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Informasi Penerima Donasi</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              Komunitas
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-400">Nama</p>
            <p className="font-medium">{dummyDetail.penerima}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Founder</p>
            <p className="font-medium">{dummyDetail.founder}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Kontak Komunitas</p>
            <p className="font-medium">{dummyDetail.kontak}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Jumlah Anggota</p>
            <p className="font-medium">{dummyDetail.anggota}</p>
          </div>
        </div>
      </main>

      {/* ACTION BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-5xl mx-auto px-10 py-4 flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 border rounded-xl py-3 font-medium"
          >
            Batal
          </button>
          <button
            onClick={() => router.push('/terima')}
            className="flex-1 bg-blue-900 text-white rounded-xl py-3 font-medium"
          >
            Setujui
          </button>
        </div>
      </div>
    </div>
  );
}
