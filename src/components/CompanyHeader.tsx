'use client';

import { useCompany } from '@/hooks/useCompany';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface CompanyHeaderProps {
  showLogo?: boolean;
  showContactInfo?: boolean;
  className?: string;
}

export const CompanyHeader = ({ 
  showLogo = true, 
  showContactInfo = true, 
  className = '' 
}: CompanyHeaderProps) => {
  const { companyInfo, loading, getCompanyDisplayName, getFormattedAddress } = useCompany();

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e6ff4a]"></div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <BuildingOfficeIcon className="h-8 w-8 text-[#e6ff4a]" />
        <div>
          <h2 className="text-xl font-bold text-white">Your Company</h2>
          {showContactInfo && (
            <p className="text-sm text-[#d2d7cb]">Add company information in settings</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* Logo */}
      {showLogo && companyInfo.logoUrl && (
        <div className="flex-shrink-0">
          <img
            src={companyInfo.logoUrl}
            alt={getCompanyDisplayName()}
            className="w-16 h-16 object-contain bg-white rounded-lg border border-[#6a7a5a]"
          />
        </div>
      )}
      
      {/* Company Information */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-1">
          {getCompanyDisplayName()}
        </h2>
        
        {showContactInfo && (
          <div className="space-y-1 text-sm text-[#d2d7cb]">
            {getFormattedAddress() && (
              <p>{getFormattedAddress()}</p>
            )}
            {companyInfo.phone && (
              <p>Phone: {companyInfo.phone}</p>
            )}
            {companyInfo.email && (
              <p>Email: {companyInfo.email}</p>
            )}
            {companyInfo.website && (
              <p>Website: {companyInfo.website}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 