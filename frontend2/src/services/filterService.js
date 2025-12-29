import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const filterService = {
  // Filter donasi by kategori and lokasi
  filterDonasi: async (kategori = null, lokasi = null, availableOnly = true) => {
    try {
      const params = { availableOnly };
      if (kategori) params.kategori = kategori;
      if (lokasi) params.lokasi = lokasi;

      const response = await axios.get(`${API_BASE_URL}/donasi/search/filtered`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering donasi:', error);
      throw error;
    }
  },

  // Filter permintaan donasi by kategori and lokasi
  filterPermintaan: async (kategori = null, lokasi = null, pendingOnly = true) => {
    try {
      const params = { pendingOnly };
      if (kategori) params.kategori = kategori;
      if (lokasi) params.lokasi = lokasi;

      const response = await axios.get(`${API_BASE_URL}/permintaan/search/filtered`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering permintaan:', error);
      throw error;
    }
  },

  // Get all donations with optional filters
  getDonasi: async (kategori = null, lokasi = null) => {
    try {
      const params = {};
      if (kategori) params.kategori = kategori;
      if (lokasi) params.lokasi = lokasi;

      const response = await axios.get(`${API_BASE_URL}/donasi`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching donasi:', error);
      throw error;
    }
  },

  // Get all permintaan with optional filters
  getPermintaan: async (kategori = null, lokasi = null) => {
    try {
      const params = {};
      if (kategori) params.kategori = kategori;
      if (lokasi) params.lokasi = lokasi;

      const response = await axios.get(`${API_BASE_URL}/permintaan`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching permintaan:', error);
      throw error;
    }
  }
};

export default filterService;
