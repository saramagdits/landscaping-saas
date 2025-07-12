'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { proposalService, LandscapeProposal } from '@/lib/proposalService';
import { pdfService } from '@/lib/pdfService';
import { PencilIcon, ArrowLeftIcon, PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CompanyHeader } from './CompanyHeader';

interface ProposalViewProps {
  proposalId: string;
}

export const ProposalView = ({ proposalId }: ProposalViewProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [proposal, setProposal] = useState<LandscapeProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProposal();
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedProposal = await proposalService.getProposal(proposalId);
      setProposal(loadedProposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposal');
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (proposal) {
      await pdfService.downloadProposalPDF(proposal, undefined, user?.uid);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Proposal not found'}
        </div>
        <button
          onClick={() => router.push('/proposals')}
          className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 hover:bg-[#d4f53a] transition"
        >
          Back to Proposals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Company Header */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <CompanyHeader />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-8 print:mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 print:text-2xl">{proposal.title}</h1>
          <p className="text-lg text-[#d2d7cb] print:text-sm">
            Created on {proposal.createdAt.toDate().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => router.push(`/proposals/${proposalId}/edit`)}
            className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#d4f53a] transition"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-[#4a5a3a] text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#5a6a4a] transition"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#5a6a4a] text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#6a7a5a] transition"
          >
            <PrinterIcon className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
          {proposal.status.toUpperCase()}
        </span>
        <button
          onClick={() => router.push('/proposals')}
          className="text-[#e6ff4a] hover:text-[#d4f53a] transition print:hidden flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Proposals
        </button>
      </div>

      {/* Client Information */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <h2 className="text-2xl font-bold mb-6 print:text-xl">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Client Name</h3>
            <p>{proposal.clientName}</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Email</h3>
            <p>{proposal.clientEmail}</p>
          </div>
          {proposal.clientPhone && (
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Phone</h3>
              <p>{proposal.clientPhone}</p>
            </div>
          )}
          {proposal.clientAddress && (
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Address</h3>
              <p>{proposal.clientAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <h2 className="text-2xl font-bold mb-6 print:text-xl">Project Information</h2>
        <div className="space-y-4">
          {proposal.projectAddress && (
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Project Address</h3>
              <p>{proposal.projectAddress}</p>
            </div>
          )}
          {proposal.projectDescription && (
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Project Description</h3>
              <p className="whitespace-pre-wrap">{proposal.projectDescription}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Estimated Start Date</h3>
              <p>{proposal.estimatedStartDate.toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Duration</h3>
              <p>{proposal.estimatedDuration} days</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Valid Until</h3>
              <p>{proposal.validUntil.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Sections */}
      {proposal.sections.length > 0 && (
        <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
          <h2 className="text-2xl font-bold mb-6 print:text-xl">Proposal Details</h2>
          <div className="space-y-8">
            {proposal.sections.map((section) => (
              <div key={section.id} className="border border-[#5a6a4a] print:border-gray-300 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                  {section.description && (
                    <p className="text-[#d2d7cb] print:text-gray-600">{section.description}</p>
                  )}
                </div>

                {section.items.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#5a6a4a] print:border-gray-300">
                          <th className="text-left py-2 font-semibold">Item</th>
                          <th className="text-left py-2 font-semibold">Description</th>
                          <th className="text-right py-2 font-semibold">Qty</th>
                          <th className="text-left py-2 font-semibold">Unit</th>
                          <th className="text-right py-2 font-semibold">Unit Price</th>
                          <th className="text-right py-2 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item) => (
                          <tr key={item.id} className="border-b border-[#5a6a4a] print:border-gray-200">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-[#d2d7cb] print:text-gray-600">{item.description}</td>
                            <td className="py-2 text-right">{item.quantity}</td>
                            <td className="py-2">{item.unit}</td>
                            <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-2 text-right font-semibold text-[#e6ff4a] print:text-black">
                              {formatCurrency(item.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-[#e6ff4a] print:border-black">
                          <td colSpan={5} className="py-2 text-right font-semibold">Section Total:</td>
                          <td className="py-2 text-right font-bold text-[#e6ff4a] print:text-black">
                            {formatCurrency(proposalService.calculateSectionTotal(section.items))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms and Notes */}
      {(proposal.terms || proposal.notes) && (
        <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
          <h2 className="text-2xl font-bold mb-6 print:text-xl">Terms and Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposal.terms && (
              <div>
                <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Terms and Conditions</h3>
                <p className="whitespace-pre-wrap">{proposal.terms}</p>
              </div>
            )}
            {proposal.notes && (
              <div>
                <h3 className="font-semibold text-[#e6ff4a] print:text-black mb-2">Additional Notes</h3>
                <p className="whitespace-pre-wrap">{proposal.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <h2 className="text-2xl font-bold mb-6 print:text-xl">Summary</h2>
        <div className="flex justify-end">
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(proposal.subtotal)}</span>
            </div>
            {proposal.taxRate > 0 && (
              <div className="flex justify-between">
                <span>Tax ({proposal.taxRate}%):</span>
                <span>{formatCurrency(proposal.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t border-[#5a6a4a] print:border-gray-300 pt-3">
              <span>Total:</span>
              <span className="text-[#e6ff4a] print:text-black">{formatCurrency(proposal.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}; 