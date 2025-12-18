'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string, role: string, userId?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [permintaan, setPermintaan] = useState<any[]>([]);
  const [donasiSaya, setDonasiSaya] = useState<any[]>([]);
  const [allPermintaan, setAllPermintaan] = useState<any[]>([]);
  const [donasiBersedia, setDonasiBersedia] = useState<any[]>([]);
  const [donasiPerluDikonfirmasi, setDonasiPerluDikonfirmasi] = useState<any[]>([]);

  useEffect(() => {
    // Check auth
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionStr);
      setUser(userData);

      // Fetch permintaan untuk penerima
      if (userData.role?.toLowerCase() === 'penerima' && userData.userId) {
        fetchPermintaan(userData.userId);
        fetchDonasiBersedia();
        fetchDonasiPerluDikonfirmasi(userData.userId);
      }

      // Fetch data untuk donatur
      if (userData.role?.toLowerCase() === 'donatur' && userData.userId) {
        fetchDonasiSaya(userData.userId);
        fetchAllPermintaan();
        fetchDonasiPerluDikonfirmasi(userData.userId);
      }
    } catch (e) {
      console.error("Invalid session", e);
      // router.push('/auth/login');
      // Fallback for dev if needed
      setUser({ username: 'Zunadea', role: 'donatur' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchPermintaan = async (userId?: number) => {
    try {
      const url = userId
        ? `http://localhost:8080/api/permintaan?penerimaId=${userId}`
        : 'http://localhost:8080/api/permintaan';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPermintaan(data);
      }
    } catch (err) {
      console.error('Error fetching permintaan:', err);
    }
  };

  const fetchDonasiSaya = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter donasi yang dibuat oleh user (donatur) dan urutkan dari yang terbaru
        const userDonasi = data
          .filter((donasi: any) => Number(donasi.donatur?.userId) === Number(userId))
          .sort((a: any, b: any) => (b.donasiId || 0) - (a.donasiId || 0));
        setDonasiSaya(userDonasi);
      }
    } catch (err) {
      console.error('Error fetching donasi saya:', err);
    }
  };

  const fetchAllPermintaan = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permintaan');
      if (response.ok) {
        const data = await response.json();
        // Urutkan dari yang terbaru
        const sorted = data.sort((a: any, b: any) => (b.permintaanId || 0) - (a.permintaanId || 0));
        setAllPermintaan(sorted);
      }
    } catch (err) {
      console.error('Error fetching all permintaan:', err);
    }
  };

  const fetchDonasiBersedia = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter donasi yang tersedia (belum diambil)
        const availableDonasi = data.filter((donasi: any) =>
          ['Tersedia', 'TERSEDIA', 'Available', 'AVAILABLE'].includes(donasi.statusDonasi?.status)
        );
        setDonasiBersedia(availableDonasi);
      }
    } catch (err) {
      console.error('Error fetching donasi bersedia:', err);
    }
  };

  const fetchDonasiPerluDikonfirmasi = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Untuk Donatur: donasi buatan mereka yang statusnya "Menunggu Konfirmasi"
        const needConfirmation = data.filter((donasi: any) =>
          Number(donasi.donatur?.userId) === Number(userId) &&
          ['Menunggu Konfirmasi', 'Pending', 'PENDING'].includes(donasi.statusDonasi?.status)
        );
        setDonasiPerluDikonfirmasi(needConfirmation);
      }
    } catch (err) {
      console.error('Error fetching donasi perlu dikonfirmasi:', err);
    }
  };

  const handleClaimDonasi = async (donasiId: number) => {
    if (!user?.userId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/donasi/${donasiId}/claim?userId=${user.userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('Berhasil mengklaim donasi! Menunggu persetujuan donatur.');
        // Refresh data
        fetchDonasiBersedia();
        if (user.role === 'penerima') {
          fetchPermintaan(user.userId);
          fetchDonasiPenerima(user.userId);
        }
      } else {
        const txt = await response.text();
        alert('Gagal mengklaim: ' + txt);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghubungi server');
    }
  };

  const handleApproveDonasi = async (donasiId: number) => {
    if (!user?.userId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/donasi/${donasiId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusBaru: 'Dikirim', userId: user.userId })
      });
      if (response.ok) {
        alert('Donasi disetujui dan sedang dikirim!');
        fetchDonasiPerluDikonfirmasi(user.userId);
        fetchDonasiSaya(user.userId);
      } else {
        alert('Gagal menyetujui donasi');
      }
    } catch (err) {
      alert('Error action');
    }
  };



  const [donasiPenerim, setDonasiPenerim] = useState<any[]>([]);

  const fetchDonasiPenerima = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/donasi');
      if (response.ok) {
        const data = await response.json();
        // Filter: Donasi where penerima is ME
        const myClaims = data.filter((d: any) => Number(d.penerima?.userId) === Number(userId));
        setDonasiPenerim(myClaims);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (user?.role === 'penerima' && user.userId) fetchDonasiPenerima(user.userId);
  }, [user && user.userId]);

  const handleCompleteDonasi = async (donasiId: number) => {
    if (!user?.userId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/donasi/${donasiId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusBaru: 'Diterima', userId: user.userId })
      });
      if (response.ok) {
        alert('Donasi berhasil diselesaikan!');
        fetchDonasiPenerima(user.userId);
      } else {
        alert('Gagal update status');
      }
    } catch (err) {
      alert('Error action');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const isPenerima = user?.role === 'penerima';

  // Redirect admin ke admin dashboard
  if (user?.role === 'admin') {
    router.push('/admin/dashboard');
    return null;
  }

  return (
    <div className="md:container md:mx-auto pb-20">

      {/* HEADER SECTION */}
      <div className="bg-primary text-white pt-8 pb-8 rounded-t-3xl">
        <div className="px-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Selamat Datang,</p>
            <h2 className="text-2xl font-bold text-white">{user?.username || 'User'}!</h2>
            <span className="inline-block mt-1 bg-white/15 px-3 py-1 rounded-full text-xs border border-white/30 backdrop-blur-sm">
              Role: {isPenerima ? 'Penerima Donasi' : 'Donatur'}
            </span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
            {isPenerima ? '🤲' : '👨‍💼'}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 bg-gray-50/50 rounded-b-3xl pt-6 -mx-6">
        {/* Action Card - Donatur & Penerima only */}
        <div className="-mt-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between border border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {isPenerima ? 'Butuh Bantuan?' : 'Siap Berbagi?'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {isPenerima ? 'Ajukan permintaan barang' : 'Donasikan barang layak pakai'}
              </p>
            </div>
            <Link href={isPenerima ? "/permintaan" : "/donasi"} className="bg-primary text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all">
              {isPenerima ? '+ Minta' : '+ Donasi'}
            </Link>
          </div>
        </div>


        {/* Add this section before existing sections in Recipient View */}
        {isPenerima && (
          <div className="space-y-6">
            {donasiPenerim.some(d => ['Dikirim', 'Menunggu Konfirmasi'].includes(d.statusDonasi?.status)) && (
              <section className="mb-8">
                <h3 className="font-bold text-xl text-gray-800 mb-4">🚚 Status Pengiriman</h3>
                <div className="space-y-3">
                  {donasiPenerim.filter(d => ['Dikirim', 'Menunggu Konfirmasi'].includes(d.statusDonasi?.status)).map((item: any) => (
                    <div key={item.donasiId} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center gap-4"> {/* Added flex and gap */}
                        <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.foto ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.foto}`}
                              alt={item.kategori}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.kategori}</h4>
                          <p className="text-sm text-gray-600">Status: <span className="font-bold">{item.statusDonasi?.status}</span></p>
                          <p className="text-xs text-gray-500 mt-1">Donatur: {item.donatur?.username}</p>
                        </div>
                        {item.statusDonasi?.status === 'Dikirim' && (
                          <button onClick={() => {
                            if (confirm("Barang sudah sampai?")) handleCompleteDonasi(item.donasiId);
                          }} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm shadow">
                            Konfirmasi Diterima
                          </button>
                        )}
                        {item.statusDonasi?.status === 'Menunggu Konfirmasi' && (
                          <span className="text-xs text-gray-400 italic">Menunggu donatur...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">📦 Donasi Tersedia</h3>
                <Link href="/donasi-tersedia" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {donasiBersedia.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    📦
                  </div>
                  <p className="font-medium text-gray-900">Belum ada donasi tersedia</p>
                  <p className="text-sm text-gray-500 mt-2">Donasi dari para donatur akan tampil di sini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiBersedia.slice(0, 3).map((item: any) => (
                    <Link key={item.donasiId} href={`/detail-donasi/${item.donasiId}`}>
                      <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                            {item.foto ? (
                              <img
                                src={`http://localhost:8080/uploads/${item.foto}`}
                                alt={item.kategori}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as any).src = 'https://via.placeholder.com/150?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.namaBarang || item.kategori || 'Donasi'}</h4>
                            <p className="text-xs text-gray-500 mt-1">👤 {item.donatur?.username || 'Donatur'}</p>
                            <p className="text-xs text-gray-500">📍 {item.lokasi?.alamatLengkap || item.lokasi || 'Lokasi tidak tersedia'}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                                ✓ Tersedia
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (confirm('Apakah Anda yakin ingin mengambil donasi ini?')) handleClaimDonasi(item.donasiId);
                            }}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                          >
                            Ambil
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">Permintaan Saya</h3>
                <Link href="/riwayat?tab=permintaan" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {/* List Permintaan atau Empty State */}
              {permintaan.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    🗳️
                  </div>
                  <p className="font-medium text-gray-900">Belum ada permintaan aktif</p>
                  <p className="text-sm text-gray-500 mt-2 mb-4">Buat permintaan baru jika Anda membutuhkan bantuan.</p>
                  <Link href="/permintaan" className="text-primary font-semibold border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 inline-block">
                    Buat Permintaan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {permintaan.map((item: any) => (
                    <Link key={item.permintaanId} href={`/permintaan/${item.permintaanId}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-inner border border-blue-100/50">
                            🤲
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.jenisBarang}</h4>
                            <p className="text-xs text-gray-500 mt-1">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.deskripsiKebutuhan}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                                {item.jumlah}x
                              </span>
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 text-xl font-light">→</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="font-bold text-xl text-gray-800 mb-4">Status Terkini</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-900 font-bold text-2xl mb-1">
                    {donasiPenerim.filter(d => ['Menunggu Konfirmasi', 'Dikirim'].includes(d.statusDonasi?.status)).length}
                  </h4>
                  <p className="text-blue-700 text-sm">Menunggu Verifikasi/Dikirim</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <h4 className="text-green-900 font-bold text-2xl mb-1">
                    {donasiPenerim.filter(d => d.statusDonasi?.status === 'Diterima').length}
                  </h4>
                  <p className="text-green-700 text-sm">Barang Diterima</p>
                </div>
              </div>

              {/* RIWAYAT BARANG DITERIMA */}
              <h3 className="font-bold text-xl text-gray-800 mb-4">📜 Riwayat Barang Diterima</h3>
              {donasiPenerim.filter(d => d.statusDonasi?.status === 'Diterima').length === 0 ? (
                <div className="text-center py-8 bg-gray-100 rounded-2xl border border-gray-200 border-dashed">
                  <p className="text-gray-500">Belum ada barang yang diterima.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiPenerim.filter(d => d.statusDonasi?.status === 'Diterima').map((item: any) => (
                    <div key={item.donasiId} className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 grayscale opacity-60">
                          {item.foto ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.foto}`}
                              alt={item.kategori}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 strike-through">{item.namaBarang || item.kategori}</h4>
                          <p className="text-sm text-gray-600">Donatur: {item.donatur?.username}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                          ✓ Selesai
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* DONATUR VIEW SPECIFIC */}
        {!isPenerima && (
          <div className="space-y-6">
            <Link href="/permintaan-untuk-donasi" className="block">
              <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-primary transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    🤝
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">Salurkan Bantuan</h4>
                    <p className="text-xs text-gray-500">Lihat permintaan dari yang membutuhkan</p>
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-primary transition-colors text-xl">→</span>
              </button>
            </Link>

            {/* DONASI PERLU DIKONFIRMASI SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">✋ Perlu Dikonfirmasi</h3>
                <Link href="/donasi/pending" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {donasiPerluDikonfirmasi.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    ✓
                  </div>
                  <p className="font-medium text-gray-900">Semua donasi sudah dikonfirmasi</p>
                  <p className="text-sm text-gray-500 mt-2">Tidak ada permintaan yang menunggu persetujuan Anda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiPerluDikonfirmasi.slice(0, 3).map((item: any) => (
                    <div key={item.donasiId} className="bg-red-50 border border-red-200 rounded-2xl p-4 hover:shadow-md hover:border-red-400 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-red-100 shadow-sm">
                          {item.foto ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.foto}`}
                              alt={item.kategori}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900">{item.kategori}</h4>
                            <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                              ⏳ Konfirmasi
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">👤 Penerima: {item.penerima?.username || 'Seseorang'}</p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-1">{item.deskripsi}</p>

                          <button
                            onClick={() => {
                              if (confirm("Setujui permintaan donasi ini?")) handleApproveDonasi(item.donasiId);
                            }}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-700 transition"
                          >
                            Setujui
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* DONASI SAYA (AKTIF) SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">📦 Donasi Aktif</h3>
                <Link href="/donasi" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {donasiSaya.filter((d: any) => !d.penerima && ['Tersedia', 'TERSEDIA', 'Available', 'AVAILABLE'].includes(d.statusDonasi?.status)).length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    📦
                  </div>
                  <p className="font-medium text-gray-900">Belum ada donasi aktif</p>
                  <p className="text-sm text-gray-500 mt-2 mb-4">Mulai berbagi barang berkualitas untuk membantu sesama.</p>
                  <Link href="/donasi" className="text-primary font-semibold border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 inline-block">
                    Buat Donasi
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiSaya
                    .filter((d: any) => !d.penerima && ['Tersedia', 'TERSEDIA', 'Available', 'AVAILABLE'].includes(d.statusDonasi?.status))
                    .slice(0, 5)
                    .map((item: any) => (
                      <Link key={item.donasiId} href={`/donasi/${item.donasiId}`}>
                        <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                              {item.foto ? (
                                <img
                                  src={`http://localhost:8080/uploads/${item.foto}`}
                                  alt={item.kategori}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                  onError={(e) => {
                                    (e.target as any).src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{item.kategori || 'Donasi'}</h4>
                              <p className="text-xs text-gray-500 mt-1">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.deskripsi || 'Tidak ada deskripsi'}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                                  ✓ {item.statusDonasi?.status || 'Tersedia'}
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 text-xl font-light">→</button>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </section>

            {/* DONASI SEDANG DIKIRIM SECTION */}
            {donasiSaya.some((d: any) => d.statusDonasi?.status === 'Dikirim') && (
              <section className="mb-8">
                <h3 className="font-bold text-xl text-gray-800 mb-4">🚚 Sedang Dikirim</h3>
                <div className="space-y-3">
                  {donasiSaya.filter((d: any) => d.statusDonasi?.status === 'Dikirim').map((item: any) => (
                    <div key={item.donasiId} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-28 h-28 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-blue-100 shadow-sm">
                          {item.foto ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.foto}`}
                              alt={item.kategori}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.kategori}</h4>
                          <p className="text-sm text-gray-600">Penerima: <span className="font-bold">{item.penerima?.username}</span></p>
                          <span className="inline-block bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold mt-1">
                            KE KURIR / SEDANG DIJALAN
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-blue-500 italic">Menunggu penerima<br />konfirmasi...</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RIWAYAT DONASI SAYA (HISTORY) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">📜 Riwayat Donasi</h3>
                <Link href="/donasi/history" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {donasiSaya.filter((d: any) => d.statusDonasi?.status === 'Diterima' || d.statusDonasi?.status === 'Selesai').length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500">Belum ada riwayat donasi yang tersalurkan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donasiSaya
                    .filter((d: any) => d.statusDonasi?.status === 'Diterima' || d.statusDonasi?.status === 'Selesai')
                    .slice(0, 10)
                    .map((item: any) => (
                      <Link key={item.donasiId} href={`/donasi/${item.donasiId}`}>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 opacity-80 hover:opacity-100 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 grayscale opacity-60">
                              {item.foto ? (
                                <img
                                  src={`http://localhost:8080/uploads/${item.foto}`}
                                  alt={item.kategori}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{item.kategori}</h4>
                              <p className="text-xs text-gray-500">Penerima: {item.penerima?.username || 'Seseorang'}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  SELESAI / DITERIMA
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-400 text-xl">→</button>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </section>

            {/* PERMINTAAN BARANG SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">🤲 Permintaan Barang</h3>
                <Link href="/permintaan-untuk-donasi" className="text-primary text-sm font-semibold">Lihat Semua</Link>
              </div>
              {allPermintaan.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    🤲
                  </div>
                  <p className="font-medium text-gray-900">Tidak ada permintaan saat ini</p>
                  <p className="text-sm text-gray-500 mt-2">Cek kembali nanti untuk melihat permintaan dari penerima manfaat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allPermintaan.slice(0, 10).map((item: any) => (
                    <Link key={item.permintaanId} href={`/permintaan/${item.permintaanId}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-500/50 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-green-50 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-inner border border-green-100/50">
                            🤲
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">{item.jenisBarang}</h4>
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                x{item.jumlah}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">👤 {item.penerima?.username || 'Penerima'}</p>
                            <p className="text-xs text-gray-500">📍 {item.lokasi?.alamatLengkap || 'Lokasi tidak tersedia'}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.deskripsiKebutuhan}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                                {item.status || 'Buka'}
                              </span>
                              <span className="inline-block text-green-600 text-xs">
                                📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 text-xl font-light">→</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div >
        )}

      </div >
    </div >
  );
}
