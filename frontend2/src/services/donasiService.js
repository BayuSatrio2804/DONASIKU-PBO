import { donationAPI } from './api';
import { getCurrentUser } from './authService';

const activeRequests = new Map();

const createRequestKey = (endpoint, params) => {
  return `${endpoint}_${JSON.stringify(params)}`;
};

export const createDonasi = async (donasiData) => {
  try {
    const user = getCurrentUser();

    const formData = new FormData();
    formData.append('namaBarang', donasiData.nama);
    formData.append('kategori', donasiData.kategori); // "pakaian", "elektronik", etc.
    formData.append('jumlah', donasiData.jumlah);
    formData.append('deskripsi', donasiData.deskripsi);
    formData.append('lokasi', donasiData.lokasi);
    formData.append('userId', user?.userId || user?.id);

    // Handle Image: donasiData.image is Base64 from frontend, but backend expects MultipartFile
    // We need to convert Base64 to Blob or backend needs to accept Base64 string.
    // Given the backend Controller expects MultipartFile, we must convert Base64 to Blob.

    if (donasiData.image && donasiData.image.startsWith('data:')) {
      const fetchRes = await fetch(donasiData.image);
      const blob = await fetchRes.blob();
      formData.append('file', blob, 'image.jpg');
    }

    const response = await donationAPI.create(formData);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw new Error(error.response?.data?.message || 'Gagal membuat donasi');
  }
};

export const getAllDonasi = async (params = {}) => {
  const requestKey = createRequestKey('donations', params);

  if (activeRequests.has(requestKey)) {
    return activeRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await donationAPI.getAll(params);
      // Backend returns List<Donasi> directly (Array)
      const data = response.data;

      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    } finally {
      activeRequests.delete(requestKey);
    }
  })();

  activeRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const getDonasiByIdService = async (id) => {
  try {
    const response = await donationAPI.getById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw new Error('Donasi tidak ditemukan');
  }
};

export const updateDonasiService = async (id, updatedData) => {
  try {
    const user = getCurrentUser();
    const userId = user?.userId || user?.id;

    const formData = new FormData();
    formData.append('namaBarang', updatedData.nama || ''); // Send namaBarang explicitly
    formData.append('kategori', updatedData.kategori);
    formData.append('jumlah', updatedData.jumlah);
    formData.append('deskripsi', updatedData.deskripsi);
    formData.append('lokasi', updatedData.lokasi);
    formData.append('userId', userId);

    // Handle Image Update
    if (updatedData.image && updatedData.image.startsWith('data:')) {
      const fetchRes = await fetch(updatedData.image);
      const blob = await fetchRes.blob();
      formData.append('file', blob, 'image.jpg');
    }

    // Call API with multipart content-type handled by axios when data is FormData
    // Since we changed Controller to consume MULTIPART, this is correct.
    // Ensure api.js 'update' allows this. 
    // donationAPI.update = (id, data) => api.put(\`/donasi/\${id}\`, data)
    // Axios auto-sets Content-Type to multipart/form-data if data is FormData.
    const response = await donationAPI.update(id, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating donation:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengupdate donasi');
  }
};

export const deleteDonasiService = async (id) => {
  try {
    const user = getCurrentUser();
    const userId = user?.userId || user?.id;
    await donationAPI.delete(`${id}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw new Error('Gagal menghapus donasi');
  }
};

export const getMyDonasi = async () => {
  const requestKey = 'my-donations';

  if (activeRequests.has(requestKey)) {
    return activeRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    try {
      // Backend (DonasiController) currently returns ALL donations on /donasi endpoint
      // So we fetch all and filter client side for now.
      const response = await donationAPI.getMyDonations();
      const data = response.data;

      if (!Array.isArray(data)) return [];

      const user = getCurrentUser();
      const userId = user?.userId || user?.id;

      if (!userId) return [];

      // Client-side filter - check both userId and id for compatibility
      return data.filter(d => d.donatur && (d.donatur.userId === userId || d.donatur.id === userId));
    } catch (error) {
      if (error.response?.status === 401) {
        return [];
      }
      console.error('Error fetching my donations:', error);
      return [];
    } finally {
      activeRequests.delete(requestKey);
    }
  })();

  activeRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const updateDonasiStatus = async (id, status) => {
  try {
    // Backend expects status as query param: /api/donasi/{id}/status?status=...
    const response = await donationAPI.updateStatus(id, status);
    return response.data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Gagal mengubah status');
  }
};

// Clear cache untuk donasi
export const clearDonasiCache = () => {
  activeRequests.clear();
};