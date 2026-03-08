import axios from 'axios';

// Live API Gateway URL for AWS deployment
const BASE_URL = 'https://rimwqr87f6.execute-api.ap-south-1.amazonaws.com/Prod';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

export const triggerSOS = async (sosData: { userId: string; location: { lat: number; lng: number }; severity: string }) => {
  try {
    const response = await api.post('/sos', sosData);
    return response.data;
  } catch (error) {
    console.error('SOS API Error:', error);
    throw error;
  }
};

export const getSafetyData = async (lat: number, lng: number) => {
  try {
    const response = await api.post('/safety-score', {
      action: 'heatmap',
      location: { lat, lng },
    });
    return response.data;
  } catch (error) {
    console.error('Safety Score API Error:', error);
    throw error;
  }
};

export const reportIncident = async (incidentData: any) => {
  try {
    const response = await api.post('/sos', incidentData);
    return response.data;
  } catch (error) {
    console.error('Report Incident Error:', error);
    throw error;
  }
};

export const getRoutes = async (routingData: any) => {
  try {
    const response = await api.post('/route-planner', routingData);
    return response.data;
  } catch (error) {
    console.error('Route Planner Error:', error);
    throw error;
  }
};

export const getIncidents = async () => {
  try {
    const response = await api.get('/incidents');
    return response.data.incidents || [];
  } catch (error) {
    console.error('Get Incidents Error:', error);
    throw error;
  }
};

export default api;
