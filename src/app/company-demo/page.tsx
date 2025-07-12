'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { CompanyHeader } from '@/components/CompanyHeader';
import { InvoiceView } from '@/components/InvoiceView';
import { StorageTest } from '@/components/StorageTest';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function CompanyDemo() {
  const { user } = useAuth();
  const { companyInfo, loading } = useCompany();

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Company Settings Demo</h1>
            <p className="text-lg text-[#d2d7cb]">
              See how your company information appears in proposals and invoices
            </p>
          </div>

          {/* Company Information Status */}
          <div className="bg-[#4a5a3a] rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-6 w-6" />
              Company Information Status
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e6ff4a]"></div>
              </div>
            ) : companyInfo && companyInfo.name ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="font-semibold">Company Information Complete</span>
                  </div>
                  <p className="text-sm text-[#d2d7cb]">
                    Your company information is set up and will appear in all proposals and invoices.
                  </p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold">Company:</span> {companyInfo.name}</p>
                  {companyInfo.email && <p><span className="font-semibold">Email:</span> {companyInfo.email}</p>}
                  {companyInfo.phone && <p><span className="font-semibold">Phone:</span> {companyInfo.phone}</p>}
                  {companyInfo.logoUrl && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Logo:</span>
                      <img 
                        src={companyInfo.logoUrl} 
                        alt="Company Logo" 
                        className="w-8 h-8 object-contain bg-white rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-[#d2d7cb] mb-4">
                  No company information found. Set up your company details to see them in proposals and invoices.
                </p>
                <a
                  href="/settings?tab=company"
                  className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition inline-flex items-center gap-2"
                >
                  <BuildingOfficeIcon className="h-4 w-4" />
                  Set Up Company Information
                </a>
              </div>
            )}
          </div>

          {/* Preview Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Header Preview */}
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6" />
                Company Header Preview
              </h2>
              <p className="text-sm text-[#d2d7cb] mb-4">
                This is how your company information appears at the top of proposals and invoices:
              </p>
              <div className="bg-[#5a6a4a] rounded-lg p-4">
                <CompanyHeader />
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-6 w-6" />
                Invoice Preview
              </h2>
              <p className="text-sm text-[#d2d7cb] mb-4">
                Sample invoice showing how your company information is integrated:
              </p>
              <div className="bg-[#5a6a4a] rounded-lg p-4 max-h-96 overflow-y-auto">
                <InvoiceView invoiceId="demo" />
              </div>
            </div>
          </div>

          {/* Storage Test */}
          <div className="bg-[#4a5a3a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Firebase Storage Test</h2>
            <p className="text-sm text-[#d2d7cb] mb-4">
              If logo uploads are not working, use this test to verify Firebase Storage is properly configured.
            </p>
            <StorageTest />
          </div>

          {/* Instructions */}
          <div className="bg-[#4a5a3a] rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">How to Use Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-[#e6ff4a] mb-2">1. Set Up Company Info</h3>
                <p className="text-sm text-[#d2d7cb]">
                  Go to Settings → Company to add your company name, contact information, and upload a logo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#e6ff4a] mb-2">2. Create Proposals</h3>
                <p className="text-sm text-[#d2d7cb]">
                  Your company information will automatically appear at the top of all new proposals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#e6ff4a] mb-2">3. Generate Invoices</h3>
                <p className="text-sm text-[#d2d7cb]">
                  Company details and logo will be included in PDF exports and printed documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 