import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import certificateApi from '../api/certificateApi';
import type { Certificate } from '../types/index';

interface CertificateContextType {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  stats: {
    total_certificates: number;
    recent_certificates: number;
    certificates_by_month: Array<{ month: string; count: number }>;
  };
  fetchCertificates: () => Promise<void>;
  fetchCertificateById: (id: number) => Promise<Certificate | null>;
  generateCertificate: (enrollmentId: number) => Promise<Certificate | null>;
  downloadCertificate: (certificateId: number) => Promise<string | null>;
  searchCertificates: (query: string) => Promise<void>;
  fetchCertificateStats: () => Promise<void>;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

interface CertificateProviderProps {
  children: ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_certificates: 0,
    recent_certificates: 0,
    certificates_by_month: [] as Array<{ month: string; count: number }>,
  });

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await certificateApi.getMyCertificates();
      setCertificates(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCertificateById = useCallback(async (id: number): Promise<Certificate | null> => {
    try {
      setLoading(true);
      const response = await certificateApi.getCertificate(id);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch certificate');
      console.error('Error fetching certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCertificate = useCallback(async (enrollmentId: number): Promise<Certificate | null> => {
    try {
      setLoading(true);
      const response = await certificateApi.generateCertificate({ enrollment_id: enrollmentId });
      // Add new certificate to the list
      setCertificates(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate certificate');
      console.error('Error generating certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadCertificate = useCallback(async (certificateId: number): Promise<string | null> => {
    try {
      setLoading(true);
      const response = await certificateApi.downloadCertificate(certificateId);
      // In a real app, you would initiate download
      return response.data.download_url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download certificate');
      console.error('Error downloading certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCertificates = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const response = await certificateApi.searchCertificates(query);
      setCertificates(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search certificates');
      console.error('Error searching certificates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCertificateStats = useCallback(async () => {
    try {
      const response = await certificateApi.getCertificateStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching certificate stats:', err);
    }
  }, []);

  const value: CertificateContextType = {
    certificates,
    loading,
    error,
    stats,
    fetchCertificates,
    fetchCertificateById,
    generateCertificate,
    downloadCertificate,
    searchCertificates,
    fetchCertificateStats,
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};