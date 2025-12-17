'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function PermintaanBarangPage() {
  const [requestSearch, setRequestSearch] = useState('');
  const [requests] = useState([
    // Add your requests data here
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request: any) =>
      request.title.toLowerCase().includes(requestSearch.toLowerCase()) ||
      request.location.toLowerCase().includes(requestSearch.toLowerCase())
    );
  }, [requests, requestSearch]);

  return (
    <>{/* Permintaan Barang */}
    
<div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto mt-30">

  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="text-blue-600 text-2xl">📦</span>
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">Permintaan Barang</h2>
      <p className="text-gray-600">Ajukan kebutuhan barang yang diperlukan</p>
    </div>
  </div>

  {/* Form */}
  <form className="space-y-5">

    {/* Nama Barang */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nama Barang
      </label>
      <input
        type="text"
        placeholder="Contoh: Pakaian Anak Pria"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Jumlah / Kebutuhan */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Jumlah / Kebutuhan
      </label>
      <input
        type="number"
        placeholder="Masukan jumlah"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Asal Peminta */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Asal Peminta
      </label>
      <input
        type="text"
        placeholder="Contoh: Komunitas, Panti Asuhan & Jompo"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Deskripsi Tambahan */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Deskripsi Tambahan
      </label>
      <textarea
        rows={4}
        placeholder="Tuliskan detail kebutuhan anda"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
    >
      Ajukan Permintaan
    </button>

  </form>
</div>

    </>
  );
}
