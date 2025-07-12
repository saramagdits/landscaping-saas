'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyService, CompanyInfo } from '@/lib/companyService';
import { 
  BuildingOfficeIcon, 
  PhotoIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const CompanySettings = () => {
  const { user } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    updatedAt: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.uid) {
      loadCompanyInfo();
    }
  }, [user?.uid]);

  const loadCompanyInfo = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const info = await CompanyService.getCompanyInfo(user.uid);
      setCompanyInfo(info);
    } catch (error) {
      console.error('Error loading company info:', error);
      setMessage({ type: 'error', text: 'Failed to load company information' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await CompanyService.updateCompanyInfo(user.uid, companyInfo);
      setMessage({ type: 'success', text: 'Company information saved successfully!' });
    } catch (error) {
      console.error('Error saving company info:', error);
      setMessage({ type: 'error', text: 'Failed to save company information' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Logo file size must be less than 5MB' });
      return;
    }

    setUploading(true);
    setMessage({ type: 'success', text: 'Uploading logo...' });

    try {
      console.log('Starting logo upload process...');
      const logoUrl = await CompanyService.uploadLogo(user.uid, file);
      setCompanyInfo(prev => ({ ...prev, logoUrl }));
      setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
      console.log('Logo upload completed successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      let errorMessage = 'Failed to upload logo';
      if (error instanceof Error) {
        errorMessage = `Upload failed: ${error.message}`;
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!user?.uid || !companyInfo.logoUrl) return;

    setUploading(true);
    setMessage(null);

    try {
      await CompanyService.deleteLogo(user.uid, companyInfo.logoUrl);
      setCompanyInfo(prev => ({ ...prev, logoUrl: '' }));
      setMessage({ type: 'success', text: 'Logo deleted successfully!' });
    } catch (error) {
      console.error('Error deleting logo:', error);
      setMessage({ type: 'error', text: 'Failed to delete logo' });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e6ff4a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Company Settings</h2>
      
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-900/20 border border-green-500/30 text-green-400' 
            : 'bg-red-900/20 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-[#5a6a4a] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <BuildingOfficeIcon className="h-5 w-5" />
          Company Logo
        </h3>
        
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            {companyInfo.logoUrl ? (
              <div className="relative">
                <img
                  src={companyInfo.logoUrl}
                  alt="Company Logo"
                  className="w-24 h-24 object-contain bg-white rounded-lg border border-[#6a7a5a]"
                />
                <button
                  onClick={handleDeleteLogo}
                  disabled={uploading}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#4a5a3a] border-2 border-dashed border-[#6a7a5a] rounded-lg flex items-center justify-center">
                <PhotoIcon className="h-8 w-8 text-[#a0a8a0]" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-[#d2d7cb] mb-3">
              Upload your company logo to be used in proposals and invoices. 
              Recommended size: 200x200px, max 5MB.
            </p>
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="bg-[#e6ff4a] text-[#313c2c] font-medium rounded-lg px-4 py-2 hover:bg-[#d4f53a] transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : companyInfo.logoUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Company Information Form */}
      <div className="bg-[#5a6a4a] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="Your Company Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
              Email
            </label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="company@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={companyInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
              Website
            </label>
            <input
              type="url"
              value={companyInfo.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
            Address
          </label>
          <input
            type="text"
            value={companyInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a] mb-3"
            placeholder="123 Main Street"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={companyInfo.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="City"
            />
            <input
              type="text"
              value={companyInfo.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="State"
            />
            <input
              type="text"
              value={companyInfo.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full bg-[#4a5a3a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              placeholder="ZIP Code"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Company Information'}
          </button>
        </div>
      </div>
    </div>
  );
}; 