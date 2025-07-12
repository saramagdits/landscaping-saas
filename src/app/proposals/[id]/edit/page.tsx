'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { ProposalForm } from '@/components/ProposalForm';

interface EditProposalPageProps {
  params: {
    id: string;
  };
}

export default function EditProposalPage({ params }: EditProposalPageProps) {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Edit Proposal</h1>
            <p className="text-lg text-[#d2d7cb]">
              Update your landscape job proposal
            </p>
          </div>

          <ProposalForm mode="edit" proposalId={params.id} />
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 