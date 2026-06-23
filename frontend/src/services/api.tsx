// File: frontend/src/services/api.ts
import axios from 'axios';

// Base instance
const apiClient = axios.create({
  baseURL: 'https://m4c-program-intelligence.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Dashboard API
export const fetchDashboardSummary = async (month?: string, district?: string) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (district) params.append('district', district);
  
  const response = await apiClient.get(`/dashboard?${params.toString()}`);
  return response.data;
};

// 2. District Leaderboard API
export const fetchDistrictPerformance = async (month?: string) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);

  const response = await apiClient.get(`/districts?${params.toString()}`);
  return response.data;
};

// 3. Available Grants API (For Dropdown)
export const fetchAvailableGrants = async () => {
  const response = await apiClient.get('/grants/available');
  return response.data;
};

// 4. Specific Grant Details API
export const fetchGrantDetails = async (grantId: string, month: string) => {
  const response = await apiClient.get(`/grants?grantId=${grantId}&month=${month}`);
  return response.data;
};

// 5. AI Narrative API
export const generateReportNarrative = async (grantId: string, month: string, isAiDisabled: boolean) => {
  const response = await apiClient.post('/narrative', {
    grantId,
    month,
    isAiDisabled
  });
  return response.data;
};