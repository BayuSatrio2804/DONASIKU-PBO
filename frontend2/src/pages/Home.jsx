import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiPackage, FiTruck, FiUsers } from 'react-icons/fi';

const Home = () => {
    return (
        <div className="font-sans">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white min-h-[90vh] flex items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8 animate-fadeInLeft">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Berbagi <span className="text-blue-200">Kebaikan</span>,<br />
                            Menuai <span className="text-blue-200">Harapan</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-50 leading-relaxed max-w-lg">
                            Platform donasi barang bekas layak pakai yang menghubungkan kebaikan Anda dengan mereka yang membutuhkan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/register" className="px-8 py-4 bg-white text-[#0063FF] font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center">
                                Mulai Berdonasi
                            </Link>
                            <Link to="/about" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-center">
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                            <div>
                                <h3 className="text-3xl font-bold">1K+</h3>
                                <p className="text-blue-200 text-sm">Donatur</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">5K+</h3>
                                <p className="text-blue-200 text-sm">Barang Tersalurkan</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">50+</h3>
                                <p className="text-blue-200 text-sm">Mitra Panti</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block relative animate-float">
                        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                alt="Helping Hands"
                                className="rounded-2xl shadow-lg w-full h-[500px] object-cover"
                            />

                            {/* Floating Card */}
                            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                                    <FiHeart fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Status Terkini</p>
                                    <p className="text-gray-900 font-bold">Donasi Tersalurkan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-[#00306C] mb-4">Bagaimana Cara Kerjanya?</h2>
                        <p className="text-gray-600 text-lg">Proses donasi yang transparan, mudah, dan terpercaya untuk semua.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Step 1 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0063FF] text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiPackage />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Upload Barang</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Foto barang bekas layak pakai Anda, isi deskripsi, dan tentukan lokasi penjemputan dengan mudah.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0063FF] text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiTruck />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Proses Penjemputan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Penerima yang terverifikasi akan mengajukan klaim. Setelah disetujui, barang akan diproses untuk dikirim/diambil.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0063FF] text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiUsers />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Manfaat Tersebar</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Barang Anda sampai di tangan yang tepat. Pantau riwayat donasi dan lihat dampak kebaikan Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
