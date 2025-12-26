import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiInbox } from 'react-icons/fi';

const VerifikasiDonasi = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate('/dashboard-admin')}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold"
            >
                <FiArrowLeft /> Kembali ke Dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiInbox className="text-4xl text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifikasi Donasi</h1>
                <p className="text-gray-600 mb-8">
                    Halaman ini akan menampilkan daftar donasi yang perlu diverifikasi oleh admin.
                    Fitur ini sedang dalam pengembangan.
                </p>
                <div className="inline-block px-6 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold">
                    🚧 Under Construction
                </div>
            </div>
        </div>
    );
};

export default VerifikasiDonasi;
