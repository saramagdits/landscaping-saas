'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { ProposalForm } from '@/components/ProposalForm';

export default function NewProposalPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Proposal</h1>
            <p className="text-lg text-[#d2d7cb]">
              Build a comprehensive landscape job proposal for your client
            </p>
          </div>

          <ProposalForm mode="create" />
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 