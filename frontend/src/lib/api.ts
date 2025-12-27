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

export const securityToolsAPI = {
  checkSPF: async (domain: string): Promise<any> => {
    const response = await api.post('/tools/spf-check/', { domain });
    return response.data;
  },

  checkDMARC: async (domain: string): Promise<any> => {
    const response = await api.post('/tools/dmarc-check/', { domain });
    return response.data;
  },

  checkDNS: async (domain: string): Promise<any> => {
    const response = await api.post('/tools/dns-check/', { domain });
    return response.data;
  },

  analyzeHeaders: async (headers: string): Promise<any> => {
    const response = await api.post('/tools/header-analyze/', { headers });
    return response.data;
  },

  checkPhishing: async (url: string): Promise<any> => {
    const response = await api.post('/tools/phishing-check/', { url });
    return response.data;
  },

  checkTXT: async (domain: string): Promise<any> => {
    const response = await api.post('/tools/txt-check/', { domain });
    return response.data;
  },
};

export default api;
