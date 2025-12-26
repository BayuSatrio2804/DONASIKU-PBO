import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#00306C] py-20 text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Tentang DONASIKU</h1>
                <p className="text-xl max-w-2xl mx-auto px-6">Membangun jembatan kebaikan melalui teknologi.</p>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-12 text-gray-700 leading-relaxed text-lg">
                <section>
                    <h2 className="text-3xl font-bold text-[#00306C] mb-4">Visi Kami</h2>
                    <p>
                        Menjadi platform filantropi digital terdepan yang memudahkan redistribusi barang bekas layak pakai,
                        mengurangi limbah, dan membantu masyarakat yang membutuhkan akses terhadap barang-barang berkualitas.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-[#00306C] mb-4">Misi Kami</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Mempermudah proses donasi barang dengan teknologi yang user-friendly.</li>
                        <li>Menjamin transparansi penyaluran bantuan kepada penerima yang terverifikasi.</li>
                        <li>Membangun komunitas berbagi yang solid dan berkelanjutan.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-[#00306C] mb-4">Tim Pengembang</h2>
                    <p>
                        DONASIKU dikembangkan oleh tim mahasiswa yang berdedikasi untuk memberikan dampak sosial positif melalui
                        rekayasa perangkat lunak.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
