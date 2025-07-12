'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { ProposalView } from '@/components/ProposalView';

interface ProposalPageProps {
  params: {
    id: string;
  };
}

export default function ProposalPage({ params }: ProposalPageProps) {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProposalView proposalId={params.id} />
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 