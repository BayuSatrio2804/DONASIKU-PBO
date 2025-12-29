/**
 * Backend Data Helpers
 * Utilities for handling backend response field mismatches
 */

// Base URL for storage assets
const STORAGE_BASE_URL = 'http://localhost:8081/storage/';

/**
 * Get proper image URL from backend filename
 * Backend returns just filename, we need full URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Handle the specific default image case for existing corrupted data
    if (imagePath === 'default_fulfillment.png') {
        return 'https://placehold.co/400x300?text=Donasi+Selesai';
    }

    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
    }
    if (imagePath.startsWith('storage/')) {
        return `http://localhost:8081/${imagePath}`;
    }
    return `${STORAGE_BASE_URL}${imagePath}`;
};

/**
 * Get lokasi string from lokasi object or string
 * Backend returns: { lokasiId, alamatLengkap, latitude, longitude }
 * Frontend expects: string
 */
export const getLokasiString = (lokasi) => {
    if (!lokasi) return 'Tidak ada lokasi';
    if (typeof lokasi === 'string') return lokasi;
    return lokasi.alamatLengkap || lokasi.alamat || 'Tidak ada lokasi';
};

/**
 * Get status donasi string from statusDonasi object
 * Backend returns: { statusId, status, statusVerifikasi }
 * Frontend expects: string
 */
export const getStatusDonasiString = (statusDonasi) => {
    if (!statusDonasi) return 'Tidak ada status';
    if (typeof statusDonasi === 'string') return statusDonasi;
    return statusDonasi.status || 'Tidak ada status';
};

/**
 * Check if donation is available for claiming
 */
export const isDonationAvailable = (donasi) => {
    const status = getStatusDonasiString(donasi?.statusDonasi);
    const unavailableStatuses = ['Selesai', 'Dibatalkan', 'selesai', 'dibatalkan'];
    return !unavailableStatuses.includes(status);
};

/**
 * Extract nama barang from deskripsi field
 * Backend stores: "Barang: [nama]. [deskripsi]"
 * We need to extract [nama]
 */
export const extractNamaBarang = (donasi) => {
    if (donasi?.nama) return donasi.nama;
    if (donasi?.deskripsi) {
        const match = donasi.deskripsi.match(/Barang:\s*([^.]+)/);
        if (match) return match[1].trim();
    }
    return donasi?.kategori || 'Item Donasi';
};

/**
 * Extract deskripsi from combined deskripsi field
 * Backend stores: "Barang: [nama]. [deskripsi]"
 * We need to extract [deskripsi]
 */
export const extractDeskripsi = (donasi) => {
    if (!donasi?.deskripsi) return '';
    const parts = donasi.deskripsi.split('. ');
    if (parts.length > 1) {
        return parts.slice(1).join('. ');
    }
    return donasi.deskripsi;
};

/**
 * Get user display name with fallback
 */
export const getUserName = (user) => {
    if (!user) return 'Anonymous';
    return user.name || user.nama || user.username || 'User';
};

/**
 * Get user photo URL with fallback
 */
export const getUserPhotoUrl = (user) => {
    const photo = user?.photo || user?.fotoProfil;
    return getImageUrl(photo);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

/**
 * Get status badge color based on status string
 */
export const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    const colors = {
        'tersedia': 'bg-green-100 text-green-700',
        'aktif': 'bg-green-100 text-green-700',
        'pending': 'bg-yellow-100 text-yellow-700',
        'menunggu': 'bg-yellow-100 text-yellow-700',
        'approved': 'bg-blue-100 text-blue-700',
        'disetujui': 'bg-blue-100 text-blue-700',
        'rejected': 'bg-red-100 text-red-700',
        'ditolak': 'bg-red-100 text-red-700',
        'selesai': 'bg-gray-100 text-gray-700',
        'dikirim': 'bg-indigo-100 text-indigo-700',
        'diterima': 'bg-emerald-100 text-emerald-700'
    };
    return colors[statusLower] || 'bg-gray-100 text-gray-600';
};
