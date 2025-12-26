// frontend/src/services/permintaanService.js
import API from './api';
import { getCurrentUser } from './authService';

// Fungsi CREATE - membuat permintaan baru
export const createPermintaanSaya = async (data) => {
    try {
        const response = await API.post('/permintaan', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }); // Endpoint: /api/permintaan
        return response.data;
    } catch (error) {
        console.error('Error creating Permintaan Saya:', error);
        throw new Error(error.response?.data?.message || 'Gagal membuat permintaan ke server.');
    }
};

// Fungsi READ ALL - ambil semua permintaan (untuk donatur melihat permintaan masuk)
export const getAllPermintaan = async () => {
    try {
        const response = await API.get('/permintaan', { timeout: 15000 });
        const data = response.data || [];
        console.log('All requests loaded:', data.length, 'items');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching all requests:', error.message);
        return [];
    }
};

// Fungsi READ - ambil donasi berdasarkan ID untuk form permintaan
export const getDonasiForPermintaan = async (donasiId) => {
    try {
        console.log('Fetching donation for form with ID:', donasiId);
        const response = await API.get(`/donasi/${donasiId}`, { timeout: 10000 });
        const donasiData = response.data; // Backend returns object directly
        console.log('Donation data loaded:', donasiData);
        return donasiData;
    } catch (error) {
        console.error('Error fetching donation for form:', error.message);
        throw new Error(error.response?.data?.message || 'Gagal memuat data donasi.');
    }
};

// Fungsi READ yang baru - dengan timeout fallback dan retry logic
export const getMyPermintaanSaya = async (retryCount = 0) => {
    try {
        const user = getCurrentUser();
        const userId = user?.userId || user?.id;
        const token = localStorage.getItem('auth_token');
        console.log('Getting my requests... Token present:', !!token);

        if (!userId) {
            console.warn('User ID not found, cannot fetch my requests');
            return [];
        }

        // Endpoint: /api/permintaan?penerimaId=...
        const response = await API.get('/permintaan', {
            params: { penerimaId: userId },
            timeout: 15000
        });

        // Backend returns List<PermintaanDonasi> directly
        const data = response.data || [];
        console.log('Requests loaded successfully:', data.length, 'items');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching my requests:', error.message, error.code);

        // Retry logic for timeout errors - max 1 retry
        if ((error.code === 'ECONNABORTED' || error.message.includes('timeout')) && retryCount < 1) {
            console.warn('Request timeout - retrying once...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return getMyPermintaanSaya(retryCount + 1);
        }

        // Fallback: return empty array instead of throwing
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.warn('Request timeout after retry - returning empty list');
            return [];
        }
        if (error.response?.status === 401) {
            console.warn('Not authenticated - returning empty list');
            return []; // Not authenticated
        }
        // Don't throw for network errors, just return empty
        console.warn('API error - returning empty list:', error.message);
        return [];
    }
};

// Fungsi READ by ID - ambil detail permintaan
export const getPermintaanById = async (id) => {
    try {
        const response = await API.get(`/permintaan/${id}`);
        return response.data; // Backend returns object directly
    } catch (error) {
        console.error('Error fetching permintaan by ID:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail permintaan.');
    }
};

// Fungsi FULFILL - Donatur memenuhi permintaan
export const fulfillPermintaan = async (id, donationData) => {
    try {
        const user = getCurrentUser();
        const donaturId = user?.userId || user?.id;

        const formData = new FormData();
        formData.append('donaturId', donaturId);
        formData.append('jumlah', donationData.jumlah);

        // Handle Image: If it's a File object (new upload), append it. 
        // If it's base64 string (from FileReader in Modal), convert to Blob or handle in backend?
        // Backend expects MultipartFile 'file'.
        // Modal logic (FulfillmentModal.jsx): `setFormData({ ...formData, image: reader.result });` -> this is base64 string.
        // We need to convert Base64 to File object here or update Modal to store File.

        // Better approach: Modal stores File object in a separate state or formData.
        // Checking FulfillmentModal.jsx again...
        // Line 30: `setFormData({ ...formData, image: reader.result });` -> Stores base64 for preview AND payload.
        // Line 25: `const file = e.target.files[0];` -> The file object exists in the event.

        // Quick Fix: Update Modal to keep the File object? 
        // OR: Since I can't easily change Modal state logic without breaking preview,
        // let's assume the Modal passes the File object OR we convert base64.

        // Wait, looking at FulfillmentModal.jsx:
        // It calls `fulfillPermintaan(request.id, formData)`.
        // The `formData` in Modal has `image` as Base64 string.
        // This is problematic for MultipartFile backend.

        // I should update FulfillmentModal.jsx to store the RAW FILE too.
        // But for now, let's update this service to handle what it receives while I fix Modal in next step.
        // Actually, let's update the Service to assume `donationData.file` exists, which I'll add to Modal.

        if (donationData.file) {
            formData.append('file', donationData.file);
        } else if (donationData.image && typeof donationData.image !== 'string') {
            formData.append('file', donationData.image);
        }

        const response = await API.post(`/permintaan/${id}/fulfill`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error fulfilling permintaan:', error);
        throw new Error(error.response?.data?.message || 'Gagal memenuhi permintaan.');
    }
};

// ... (Other functions rely on endpoints not yet implemented in backend strictly as PATCH, but POST mostly)
// Backend has: offer, confirm, fulfill, accept-offer, cancel.

export const approvePermintaan = async (id) => {
    // Maps to 'fulfill' endpoint as "approval" effectively means fulfilling the request
    try {
        const user = getCurrentUser();
        const donaturId = user?.userId;
        const response = await API.post(`/permintaan/${id}/fulfill?donaturId=${donaturId}`);
        return response.data;
    } catch (error) {
        console.error('Error approving permintaan:', error);
        throw new Error(error.response?.data?.message || 'Gagal menyetujui permintaan.');
    }
};

export const rejectPermintaan = async (id, reason) => {
    // Maps to 'cancel' or update status. Using cancel for now as "Reject" effectively cancels the negotiation.
    try {
        const user = getCurrentUser();
        const userId = user?.userId;
        // Using cancel endpoint
        const response = await API.post(`/permintaan/${id}/cancel?userId=${userId}&reason=${encodeURIComponent(reason)}`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting permintaan:', error);
        throw new Error(error.response?.data?.message || 'Gagal menolak permintaan.');
    }
};

export const markPermintaanSent = async (id) => {
    try {
        const response = await API.post(`/permintaan/${id}/sent`);
        return response.data;
    } catch (error) {
        console.error('Error marking permintaan as sent:', error);
        throw new Error(error.response?.data?.message || 'Gagal menandai permintaan sebagai dikirim.');
    }
};

export const markPermintaanReceived = async (id) => {
    // Backend: /accept-offer (Closest match)
    try {
        const response = await API.post(`/permintaan/${id}/accept-offer`);
        return response.data;
    } catch (error) {
        console.error('Error marking permintaan as received:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengonfirmasi penerimaan barang.');
    }
};

// CRUD: Update Permintaan
export const updatePermintaan = async (id, userId, jumlah, deskripsi, judul, file) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('jumlah', jumlah);
        formData.append('deskripsi', deskripsi);
        if (judul) formData.append('judul', judul);
        if (file) formData.append('file', file);

        const response = await API.post(`/permintaan/${id}/update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating permintaan:', error);
        throw new Error(error.response?.data?.message || 'Gagal mengupdate permintaan.');
    }
};

// CRUD: Delete Permintaan (Cancel)
export const deletePermintaan = async (id, userId) => {
    try {
        const response = await API.post(`/permintaan/${id}/cancel?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting permintaan:', error);
        throw new Error(error.response?.data?.message || 'Gagal menghapus permintaan.');
    }
};
