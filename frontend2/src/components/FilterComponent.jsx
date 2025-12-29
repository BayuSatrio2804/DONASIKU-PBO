import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const FilterComponent = ({ onFilterChange, showLocationMap = false }) => {
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [lokasiBerjalan, setLokasiBerjalan] = useState(null);
  const [daftarLokasi, setDaftarLokasi] = useState([]);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [useGeolocation, setUseGeolocation] = useState(false);

  const kategoriList = [
    { value: 'Pakaian', label: 'Pakaian' },
    { value: 'Buku', label: 'Buku' },
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Peralatan', label: 'Peralatan' },
    { value: 'Makanan', label: 'Makanan' },
    { value: 'Kesehatan', label: 'Kesehatan' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  // Load all lokasi saat component mount
  useEffect(() => {
    loadDaftarLokasi();
  }, []);

  const loadDaftarLokasi = async () => {
    setLoadingLokasi(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/lokasi`);
      setDaftarLokasi(response.data);
    } catch (error) {
      console.error('Error loading lokasi list:', error);
    } finally {
      setLoadingLokasi(false);
    }
  };

  // Handle Geolocation
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLokasiBerjalan({ lat: latitude, lng: longitude });
          setUseGeolocation(true);
          
          // Notify parent component
          if (onFilterChange) {
            onFilterChange({
              kategori,
              lokasi: null,
              lat: latitude,
              lng: longitude,
              useGeolocation: true
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Tidak dapat mengakses lokasi. Pastikan izin lokasi sudah diberikan.');
        }
      );
    }
  };

  const handleKategoriChange = (e) => {
    const newKategori = e.target.value;
    setKategori(newKategori);
    setUseGeolocation(false);
    notifyParent(newKategori, lokasi);
  };

  const handleLokasiChange = (e) => {
    const newLokasi = e.target.value;
    setLokasi(newLokasi);
    setUseGeolocation(false);
    notifyParent(kategori, newLokasi);
  };

  const notifyParent = (kat, lok) => {
    if (onFilterChange) {
      onFilterChange({
        kategori: kat,
        lokasi: lok,
        lat: null,
        lng: null,
        useGeolocation: false
      });
    }
  };

  const handleResetFilter = () => {
    setKategori('');
    setLokasi('');
    setUseGeolocation(false);
    setLokasiBerjalan(null);
    if (onFilterChange) {
      onFilterChange({
        kategori: '',
        lokasi: '',
        lat: null,
        lng: null,
        useGeolocation: false
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Donasi</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filter Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Barang
          </label>
          <select
            value={kategori}
            onChange={handleKategoriChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokasi
          </label>
          <select
            value={lokasi}
            onChange={handleLokasiChange}
            disabled={loadingLokasi || useGeolocation}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loadingLokasi ? 'Memuat lokasi...' : 'Semua Lokasi'}
            </option>
            {daftarLokasi.map((lok) => (
              <option key={lok.lokasiId} value={lok.alamatLengkap}>
                {lok.alamatLengkap}
              </option>
            ))}
          </select>
        </div>

        {/* Geolocation Button */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleGeolocation}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              useGeolocation
                ? 'bg-green-500 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            📍 Lokasi Saya
          </button>
          <button
            onClick={handleResetFilter}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Display current geolocation */}
      {useGeolocation && lokasiBerjalan && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          ✓ Menggunakan lokasi saat ini: {lokasiBerjalan.lat.toFixed(4)}, {lokasiBerjalan.lng.toFixed(4)}
        </div>
      )}

      {/* Map if showLocationMap is true - optional integration with maps library */}
      {showLocationMap && useGeolocation && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg text-center text-gray-600">
          <p>Map view akan ditampilkan di sini (integrasi dengan Google Maps/Leaflet)</p>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
