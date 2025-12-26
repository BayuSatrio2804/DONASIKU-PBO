import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const lokasiService = {
  // Get all locations
  getAllLokasi: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lokasi`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all locations:', error);
      throw error;
    }
  },

  // Get location by ID
  getLokasiById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lokasi/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      throw error;
    }
  },

  // Search location by address
  searchLokasiByAddress: async (address) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lokasi`, {
        params: { address }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching location by address:', error);
      throw error;
    }
  },

  // Find nearby locations using geolocation
  getNearbyLokasi: async (lat, lng, radius = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lokasi/nearby`, {
        params: {
          lat,
          lng,
          radius
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      throw error;
    }
  }
};

export default lokasiService;
