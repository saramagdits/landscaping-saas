'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { proposalService, LandscapeProposal } from '@/lib/proposalService';
import { DocumentDuplicateIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const ProposalStats = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<LandscapeProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const loadedProposals = await proposalService.getProposals(user.uid);
      setProposals(loadedProposals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStats = () => {
    const total = proposals.length;
    const accepted = proposals.filter(p => p.status === 'accepted').length;
    const pending = proposals.filter(p => p.status === 'sent').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;
    const totalValue = proposals.reduce((sum, p) => sum + p.totalAmount, 0);
    const acceptedValue = proposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, p) => sum + p.totalAmount, 0);

    return {
      total,
      accepted,
      pending,
      rejected,
      totalValue,
      acceptedValue,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="bg-[#4a5a3a] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Proposal Statistics</h2>
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#4a5a3a] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Proposal Statistics</h2>
        <div className="text-red-400 text-center">
          {error}
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="bg-[#4a5a3a] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <DocumentDuplicateIcon className="h-6 w-6 text-[#e6ff4a]" />
        <h2 className="text-2xl font-bold">Proposal Statistics</h2>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-8">
          <DocumentDuplicateIcon className="h-12 w-12 text-[#a0a8a0] mx-auto mb-4" />
          <p className="text-[#d2d7cb] mb-4">No proposals created yet</p>
          <a
            href="/proposals/new"
            className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 hover:bg-[#d4f53a] transition inline-flex items-center gap-2"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            Create Your First Proposal
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Proposals */}
          <div className="text-center">
            <div className="bg-[#3a4a2a] rounded-lg p-4">
              <DocumentDuplicateIcon className="h-8 w-8 text-[#e6ff4a] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#e6ff4a]">{stats.total}</p>
              <p className="text-sm text-[#d2d7cb]">Total Proposals</p>
            </div>
          </div>

          {/* Accepted Proposals */}
          <div className="text-center">
            <div className="bg-[#3a4a2a] rounded-lg p-4">
              <CheckCircleIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
              <p className="text-sm text-[#d2d7cb]">Accepted</p>
              <p className="text-xs text-[#a0a8a0]">{stats.acceptanceRate}% rate</p>
            </div>
          </div>

          {/* Pending Proposals */}
          <div className="text-center">
            <div className="bg-[#3a4a2a] rounded-lg p-4">
              <ClockIcon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              <p className="text-sm text-[#d2d7cb]">Pending</p>
            </div>
          </div>

          {/* Total Value */}
          <div className="text-center">
            <div className="bg-[#3a4a2a] rounded-lg p-4">
              <div className="h-8 w-8 bg-[#e6ff4a] rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-[#313c2c] font-bold text-sm">$</span>
              </div>
              <p className="text-2xl font-bold text-[#e6ff4a]">{formatCurrency(stats.totalValue)}</p>
              <p className="text-sm text-[#d2d7cb]">Total Value</p>
              <p className="text-xs text-[#a0a8a0]">{formatCurrency(stats.acceptedValue)} accepted</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Proposals */}
      {proposals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Proposals</h3>
          <div className="space-y-3">
            {proposals.slice(0, 3).map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between p-3 bg-[#3a4a2a] rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{proposal.title}</h4>
                  <p className="text-xs text-[#a0a8a0]">{proposal.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#e6ff4a]">
                    {formatCurrency(proposal.totalAmount)}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    proposal.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {proposals.length > 3 && (
            <div className="text-center mt-4">
              <a
                href="/proposals"
                className="text-[#e6ff4a] hover:text-[#d4f53a] text-sm font-medium transition"
              >
                View all proposals →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 