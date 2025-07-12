import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyService, CompanyInfo } from '@/lib/companyService';

export const useCompany = () => {
  const { user } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      loadCompanyInfo();
    } else {
      setCompanyInfo(null);
      setLoading(false);
    }
  }, [user?.uid]);

  const loadCompanyInfo = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const info = await CompanyService.getCompanyInfo(user.uid);
      setCompanyInfo(info);
    } catch (err) {
      console.error('Error loading company info:', err);
      setError('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = async (updates: Partial<CompanyInfo>) => {
    if (!user?.uid) return;
    
    try {
      await CompanyService.updateCompanyInfo(user.uid, updates);
      setCompanyInfo(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating company info:', err);
      setError('Failed to update company information');
      return false;
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user?.uid) return null;
    
    try {
      const logoUrl = await CompanyService.uploadLogo(user.uid, file);
      setCompanyInfo(prev => prev ? { ...prev, logoUrl } : null);
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo');
      return null;
    }
  };

  const deleteLogo = async () => {
    if (!user?.uid || !companyInfo?.logoUrl) return false;
    
    try {
      await CompanyService.deleteLogo(user.uid, companyInfo.logoUrl);
      setCompanyInfo(prev => prev ? { ...prev, logoUrl: '' } : null);
      return true;
    } catch (err) {
      console.error('Error deleting logo:', err);
      setError('Failed to delete logo');
      return false;
    }
  };

  const getFormattedAddress = () => {
    return companyInfo ? CompanyService.getFormattedAddress(companyInfo) : '';
  };

  const getCompanyDisplayName = () => {
    return companyInfo ? CompanyService.getCompanyDisplayName(companyInfo) : 'Your Company';
  };

  return {
    companyInfo,
    loading,
    error,
    loadCompanyInfo,
    updateCompanyInfo,
    uploadLogo,
    deleteLogo,
    getFormattedAddress,
    getCompanyDisplayName,
  };
}; 