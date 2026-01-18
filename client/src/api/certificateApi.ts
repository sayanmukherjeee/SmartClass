import axiosClient from './axiosClient';
import type { ApiResponse, Certificate } from '../types/index';

interface CertificateGenerateData {
  enrollment_id: number;
}

interface CertificateResponse {
  id: number;
  user: number;
  course: {
    id: number;
    title: string;
    thumbnail?: string;
    instructor: {
      id: number;
      first_name: string;
      last_name: string;
    };
    duration_hours: number;
    level: string;
  };
  certificate_code: string;
  issued_at: string;
  expires_at?: string;
  download_url: string;
  verification_url: string;
}

const certificateApi = {
  // Get all certificates for current user
  getMyCertificates: (): Promise<ApiResponse<CertificateResponse[]>> => {
    return axiosClient.get('/certificates/');
  },

  // Get a specific certificate
  getCertificate: (certificateId: number): Promise<ApiResponse<CertificateResponse>> => {
    return axiosClient.get(`/certificates/${certificateId}/`);
  },

  // Generate a new certificate
  generateCertificate: (data: CertificateGenerateData): Promise<ApiResponse<CertificateResponse>> => {
    return axiosClient.post('/certificates/generate/', data);
  },

  // Download certificate
  downloadCertificate: (certificateId: number): Promise<ApiResponse<{ message: string; download_url: string }>> => {
    return axiosClient.get(`/certificates/${certificateId}/download/`);
  },

  // Verify certificate
  verifyCertificate: (certificateId: number): Promise<ApiResponse<{ valid: boolean; certificate: CertificateResponse }>> => {
    return axiosClient.get(`/certificates/${certificateId}/verify/`);
  },

  // Search certificates
  searchCertificates: (query: string): Promise<ApiResponse<CertificateResponse[]>> => {
    return axiosClient.get('/certificates/', { params: { search: query } });
  },

  // Get certificate statistics
  getCertificateStats: (): Promise<ApiResponse<{
    total_certificates: number;
    recent_certificates: number;
    certificates_by_month: Array<{ month: string; count: number }>;
  }>> => {
    return axiosClient.get('/certificates/stats/');
  },
};

export default certificateApi;