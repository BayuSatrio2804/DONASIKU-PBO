import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
            <h1 className="text-9xl font-bold text-[#00306C] opacity-20">404</h1>
            <div className="absolute">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-[#0063FF] text-white font-bold rounded-xl shadow-lg hover:bg-[#00306C] transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
