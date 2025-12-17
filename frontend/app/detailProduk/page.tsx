'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BarangSiapAmbilPage() {
  const router = useRouter();

  // ===== DUMMY DATA =====
  const data = {
    barang: {
      nama: 'Sepatu Anak',
      lokasi: 'Bojongsang',
      gambar: '/dummy/sepatu-anak.jpg',
    },
    donatur: {
      nama: 'M Imanilmaysah',
      tanggal: '19 Agustus 2025',
    },
    penerima: {
      kategori: 'Komunitas',
      nama: 'Komunitas Wikimedia Bandung',
      founder: 'M. Faishal Wirahutama',
      kontak: '+62851-554-4734',
      anggota: '650 Anggota',
      logo: '/dummy/komunitas.png',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-xl"
          >
            ←
          </button>
          <h1 className="font-semibold text-lg">
            Barang Siap Ambil
          </h1>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-6">

        {/* DETAIL TITLE */}
        <h2 className="font-semibold">Detail</h2>

        {/* ===== CARD BARANG ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
          <div className="w-24 h-24 relative rounded-xl overflow-hidden">
            <Image
              src={data.barang.gambar}
              alt={data.barang.nama}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">{data.barang.nama}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📍 {data.barang.lokasi}
            </p>

            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">Nama Donatur</p>
              <p className="text-gray-600">{data.donatur.nama}</p>

              <p className="font-medium mt-2">Tgl Upload</p>
              <p className="text-gray-600">{data.donatur.tanggal}</p>
            </div>
          </div>
        </div>

        {/* ===== CARD INFORMASI PENERIMA ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Informasi Penerima Donasi
            </h3>

            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {data.penerima.kategori}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 relative">
              <Image
                src={data.penerima.logo}
                alt="Logo Komunitas"
                fill
                className="object-contain"
              />
            </div>

            <div>
              <p className="font-medium">Nama</p>
              <p className="text-gray-600 text-sm">
                {data.penerima.nama}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Founder</p>
              <p className="text-gray-600">
                {data.penerima.founder}
              </p>
            </div>

            <div>
              <p className="font-medium">Kontak Komunitas</p>
              <p className="text-gray-600">
                {data.penerima.kontak}
              </p>
            </div>

            <div>
              <p className="font-medium">Jumlah Anggota</p>
              <p className="text-gray-600">
                {data.penerima.anggota}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ===== ACTION BUTTON ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 py-3 rounded-full font-semibold"
          >
            Batal
          </button>

          <button
            onClick={() => {
              alert('Barang berhasil disetujui untuk diambil');
              router.push('/donasiBarang');
            }}
            className="flex-1 bg-blue-900 text-white py-3 rounded-full font-semibold"
          >
            Setujui
          </button>
        </div>
      </div>
    </div>
  );
}
