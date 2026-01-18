// frontend/src/hooks/useCertificate.ts
import { useContext } from 'react';
import { CertificateContext } from '../context/CertificateContext';

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};