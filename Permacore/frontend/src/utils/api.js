import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;


export const fetchVendors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/vendors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export const fetchShipments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/shipments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    throw error;
  }
};

export const fetchInspections = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inspections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inspections:', error);
    throw error;
  }
};

export const fetchSupplierQualityData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/supplier-quality`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supplier quality data:', error);
    throw error;
  }
};

// Add more API calls as needed
