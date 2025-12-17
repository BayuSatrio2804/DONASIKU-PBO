'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function DetailPermintaanBarangPage() {
  const router = useRouter();

  // ===== DUMMY DATA =====
  const data = {
    namaBarang: 'Pakaian Anak',
    penerima: 'Panti Asuhan Ceria Bandung',
    lokasi: 'JL. Pandjaitan Bandung',
    jumlah: 5,
    deskripsi:
      'Untuk kebutuhan anak-anak untuk mengikuti volunteer, kami membutuhkan pakaian yang cerah berwarna biru untuk pria dan wanita usia 17 tahun',
    image: '/dummy/dinsos.png',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* ===== HEADER ===== */}
      <div className="bg-blue-900 text-white rounded-b-3xl">
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-xl"
              >
                ←
              </button>
              <h1 className="text-lg font-semibold">
                Detail Permintaan Barang
              </h1>
            </div>

            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              👤
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-6">

        {/* ===== CARD RINGKAS ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
          <div className="w-14 h-14 relative">
            <Image
              src={data.image}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="font-semibold">{data.namaBarang}</h2>
            <p className="text-sm text-gray-500">
              Penerima : {data.penerima}
            </p>
            <p className="text-sm text-gray-500">
              Lokasi : {data.lokasi}
            </p>
          </div>
        </div>

        {/* ===== DETAIL SECTION ===== */}
        <h3 className="font-semibold">Detail</h3>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

          {/* Info Penerima */}
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 relative">
              <Image
                src={data.image}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h4 className="font-semibold">{data.penerima}</h4>
              <p className="text-sm text-gray-500">
                Penerima : {data.penerima}
              </p>
              <p className="text-sm text-gray-500">
                Lokasi : {data.lokasi}
              </p>
            </div>
          </div>

          {/* Detail Permintaan */}
          <div>
            <h4 className="font-semibold mb-4">
              Detail Permintaan Barang
            </h4>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Nama Barang</p>
                <p className="text-gray-600">{data.namaBarang}</p>
              </div>

              <div>
                <p className="font-medium">Jumlah/Kebutuhan</p>
                <p className="text-gray-600">{data.jumlah}</p>
              </div>

              <div>
                <p className="font-medium">Deskripsi Tambahan</p>
                <p className="text-gray-600 leading-relaxed">
                  {data.deskripsi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== ACTION BUTTON ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 bg-blue-900 text-white py-3 rounded-full font-semibold"
          >
            Batal
          </button>

          <button
            className="flex-1 border border-gray-300 py-3 rounded-full font-semibold"
            onClick={() => router.push('/donasiBarang')}
          >
            Setujui
          </button>
        </div>
      </div>
    </div>
  );
}
