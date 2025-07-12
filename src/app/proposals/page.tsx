'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { proposalService, LandscapeProposal } from '@/lib/proposalService';
import { pdfService } from '@/lib/pdfService';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function ProposalsPage() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<LandscapeProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user, filterStatus]);

  const loadProposals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const options = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      let loadedProposals = await proposalService.getProposals(user.uid, options);
      
      // Sort proposals by creation date (newest first) when status filter is applied
      if (filterStatus !== 'all') {
        loadedProposals = loadedProposals.sort((a, b) => 
          b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        );
      }
      
      setProposals(loadedProposals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposals');
      console.error('Error loading proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!user || !confirm('Are you sure you want to delete this proposal?')) return;

    try {
      await proposalService.deleteProposal(proposalId, user.uid);
      await loadProposals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete proposal');
      console.error('Error deleting proposal:', err);
    }
  };

  const handleDownloadPDF = async (proposal: LandscapeProposal) => {
    await pdfService.downloadProposalPDF(proposal);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AuthenticatedLayout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </AuthenticatedLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Proposals</h1>
                <p className="text-lg text-[#d2d7cb]">
                  Manage your landscape job proposals
                </p>
              </div>
              <a
                href="/proposals/new"
                className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 flex items-center gap-2 hover:bg-[#d4f53a] transition w-full sm:w-auto justify-center"
              >
                <PlusIcon className="h-5 w-5" />
                Create Proposal
              </a>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#4a5a3a] text-white border border-[#5a6a4a] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Proposals Grid */}
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[#4a5a3a] rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">No proposals yet</h3>
                <p className="text-[#d2d7cb] mb-6">
                  Create your first landscape job proposal to get started.
                </p>
                <a
                  href="/proposals/new"
                  className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 inline-flex items-center gap-2 hover:bg-[#d4f53a] transition"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Your First Proposal
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6 hover:bg-[#5a6a4a] transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                        {proposal.title}
                      </h3>
                      <p className="text-[#d2d7cb] text-sm truncate">
                        {proposal.clientName}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)} flex-shrink-0 ml-2`}>
                      {proposal.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0a8a0]">Total Amount:</span>
                      <span className="font-semibold">{formatCurrency(proposal.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0a8a0]">Duration:</span>
                      <span>{proposal.estimatedDuration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0a8a0]">Valid Until:</span>
                      <span>{proposal.validUntil.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/proposals/${proposal.id}`}
                      className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-3 py-2 text-center text-sm hover:bg-[#d4f53a] transition flex items-center justify-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </a>
                    <button
                      onClick={() => handleDownloadPDF(proposal)}
                      className="bg-[#4a5a3a] text-white font-semibold rounded-lg px-3 py-2 text-sm hover:bg-[#5a6a4a] transition flex items-center justify-center"
                      title="Download PDF"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </button>
                    <a
                      href={`/proposals/${proposal.id}/edit`}
                      className="bg-[#5a6a4a] text-white font-semibold rounded-lg px-3 py-2 text-center text-sm hover:bg-[#6a7a5a] transition flex items-center justify-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </a>
                    <button
                      onClick={() => handleDeleteProposal(proposal.id)}
                      className="bg-red-600 text-white font-semibold rounded-lg px-3 py-2 text-sm hover:bg-red-700 transition flex items-center justify-center"
                      title="Delete proposal"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics */}
          {proposals.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Proposal Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#4a5a3a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Proposals</h3>
                  <p className="text-3xl font-bold text-[#e6ff4a]">{proposals.length}</p>
                </div>
                <div className="bg-[#4a5a3a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Value</h3>
                  <p className="text-3xl font-bold text-[#e6ff4a]">
                    {formatCurrency(proposals.reduce((sum, p) => sum + p.totalAmount, 0))}
                  </p>
                </div>
                <div className="bg-[#4a5a3a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Accepted</h3>
                  <p className="text-3xl font-bold text-green-400">
                    {proposals.filter(p => p.status === 'accepted').length}
                  </p>
                </div>
                <div className="bg-[#4a5a3a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Pending</h3>
                  <p className="text-3xl font-bold text-yellow-400">
                    {proposals.filter(p => p.status === 'sent').length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 