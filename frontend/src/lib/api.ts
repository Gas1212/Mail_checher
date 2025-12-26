import axios from 'axios';
import { EmailCheckRequest, EmailValidationResult, ValidationStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emailAPI = {
  checkEmail: async (data: EmailCheckRequest): Promise<EmailValidationResult> => {
    const response = await api.post('/emails/check/', data);
    return response.data;
  },

  getHistory: async (limit: number = 50): Promise<EmailValidationResult[]> => {
    const response = await api.get(`/emails/history/?limit=${limit}`);
    return response.data;
  },

  getStats: async (): Promise<ValidationStats> => {
    const response = await api.get('/emails/stats/');
    return response.data;
  },
};

export default api;
