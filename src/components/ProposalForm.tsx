'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { proposalService, CreateProposalData, ProposalSection, ProposalItem } from '@/lib/proposalService';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ProposalFormProps {
  proposalId?: string;
  mode: 'create' | 'edit';
}

export const ProposalForm = ({ proposalId, mode }: ProposalFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<CreateProposalData>({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    projectAddress: '',
    projectDescription: '',
    estimatedStartDate: new Date(),
    estimatedDuration: 1,
    sections: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0,
    terms: '',
    notes: '',
    status: 'draft',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });

  useEffect(() => {
    if (mode === 'edit' && proposalId) {
      loadProposal();
    }
  }, [proposalId, mode]);

  const loadProposal = async () => {
    if (!proposalId) return;

    try {
      setLoading(true);
      const proposal = await proposalService.getProposal(proposalId);
      if (proposal) {
        setFormData({
          title: proposal.title,
          clientName: proposal.clientName,
          clientEmail: proposal.clientEmail,
          clientPhone: proposal.clientPhone,
          clientAddress: proposal.clientAddress,
          projectAddress: proposal.projectAddress,
          projectDescription: proposal.projectDescription,
          estimatedStartDate: proposal.estimatedStartDate,
          estimatedDuration: proposal.estimatedDuration,
          sections: proposal.sections,
          subtotal: proposal.subtotal,
          taxRate: proposal.taxRate,
          taxAmount: proposal.taxAmount,
          totalAmount: proposal.totalAmount,
          terms: proposal.terms,
          notes: proposal.notes,
          status: proposal.status,
          validUntil: proposal.validUntil
        });
        // Expand all sections by default when editing
        setExpandedSections(new Set(proposal.sections.map(s => s.id)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Recalculate totals
      const totals = proposalService.calculateTotals(formData.sections, formData.taxRate);
      const updatedFormData = {
        ...formData,
        ...totals
      };

      if (mode === 'create') {
        await proposalService.createProposal(user.uid, updatedFormData);
        router.push('/proposals');
      } else if (proposalId) {
        await proposalService.updateProposal(proposalId, user.uid, updatedFormData);
        router.push('/proposals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save proposal');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newSection: ProposalSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      items: [],
      subtotal: 0
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setExpandedSections(prev => new Set([...prev, newSection.id]));
  };

  const updateSection = (sectionId: string, updates: Partial<ProposalSection>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  };

  const addItem = (sectionId: string) => {
    const newItem: ProposalItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: '',
      quantity: 1,
      unit: 'piece',
      unitPrice: 0,
      totalPrice: 0,
      category: 'materials'
    };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    }));
  };

  const updateItem = (sectionId: string, itemId: string, updates: Partial<ProposalItem>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId
                  ? { ...item, ...updates }
                  : item
              )
            }
          : section
      )
    }));
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return proposalService.calculateItemTotal(quantity, unitPrice);
  };

  const updateItemTotal = (sectionId: string, itemId: string, quantity: number, unitPrice: number) => {
    const totalPrice = calculateItemTotal(quantity, unitPrice);
    updateItem(sectionId, itemId, { quantity, unitPrice, totalPrice });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Client Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Email *
            </label>
            <input
              type="email"
              required
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Phone
            </label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Address
            </label>
            <input
              type="text"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Project Information</h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Address
            </label>
            <input
              type="text"
              value={formData.projectAddress}
              onChange={(e) => setFormData({ ...formData, projectAddress: e.target.value })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Description
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Start Date
              </label>
              <input
                type="date"
                value={formData.estimatedStartDate.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, estimatedStartDate: new Date(e.target.value) })}
                className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Duration (days)
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value) })}
                className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Sections */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Proposal Sections</h2>
          <button
            type="button"
            onClick={addSection}
            className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#d4f53a] transition w-full sm:w-auto justify-center"
          >
            <PlusIcon className="h-5 w-5" />
            Add Section
          </button>
        </div>

        {formData.sections.length === 0 ? (
          <div className="text-center py-8 text-[#d2d7cb]">
            <p>No sections added yet. Click "Add Section" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.sections.map((section) => (
              <div key={section.id} className="border border-[#5a6a4a] rounded-lg overflow-hidden">
                {/* Section Header */}
                <div className="bg-[#3a4a2a] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="text-[#e6ff4a] hover:text-[#d4f53a] transition p-1"
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="bg-transparent text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] rounded px-2 py-1 flex-1 min-w-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="text-red-400 hover:text-red-300 transition p-1"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Section Content */}
                {expandedSections.has(section.id) && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Section Description
                      </label>
                      <textarea
                        value={section.description || ''}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
                      />
                    </div>

                    {/* Items */}
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h4 className="text-lg font-semibold">Items</h4>
                        <button
                          type="button"
                          onClick={() => addItem(section.id)}
                          className="bg-[#5a6a4a] text-white font-semibold rounded-lg px-3 py-2 text-sm hover:bg-[#6a7a5a] transition flex items-center gap-1 w-full sm:w-auto justify-center"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>

                      {section.items.length === 0 ? (
                        <p className="text-[#d2d7cb] text-sm">No items in this section.</p>
                      ) : (
                        <div className="space-y-3">
                          {section.items.map((item) => (
                            <div key={item.id} className="bg-[#3a4a2a] rounded-lg p-3 space-y-3">
                              {/* Mobile-friendly item layout */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Item Name</label>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(section.id, item.id, { name: e.target.value })}
                                    placeholder="Item name"
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                                  <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => updateItem(section.id, item.id, { description: e.target.value })}
                                    placeholder="Description"
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Qty</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.quantity}
                                    onChange={(e) => updateItemTotal(section.id, item.id, parseFloat(e.target.value) || 0, item.unitPrice)}
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Unit</label>
                                  <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) => updateItem(section.id, item.id, { unit: e.target.value })}
                                    placeholder="Unit"
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Unit Price</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(e) => updateItemTotal(section.id, item.id, item.quantity, parseFloat(e.target.value) || 0)}
                                    placeholder="Unit price"
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                                  <select
                                    value={item.category}
                                    onChange={(e) => updateItem(section.id, item.id, { category: e.target.value as any })}
                                    className="w-full px-2 py-2 border border-[#5a6a4a] rounded focus:outline-none focus:ring-1 focus:ring-[#e6ff4a] bg-[#2a3a1a] text-white text-sm"
                                  >
                                    <option value="materials">Materials</option>
                                    <option value="labor">Labor</option>
                                    <option value="equipment">Equipment</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="text-right">
                                  <span className="text-sm text-gray-400">Total: </span>
                                  <span className="font-semibold text-[#e6ff4a] text-lg">
                                    {formatCurrency(item.totalPrice)}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(section.id, item.id)}
                                  className="text-red-400 hover:text-red-300 transition p-2"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section Total */}
                    <div className="text-right">
                      <span className="text-lg font-semibold text-[#e6ff4a]">
                        Section Total: {formatCurrency(proposalService.calculateSectionTotal(section.items))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms and Notes */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Terms and Notes</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Terms and Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={6}
              placeholder="Enter your terms and conditions..."
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={6}
              placeholder="Enter any additional notes..."
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
        </div>
      </div>

      {/* Tax and Totals */}
      <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Tax and Totals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-[#5a6a4a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ff4a] bg-[#3a4a2a] text-white"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-1">Subtotal</p>
            <p className="text-2xl font-bold text-[#e6ff4a]">
              {formatCurrency(proposalService.calculateTotals(formData.sections, formData.taxRate).subtotal)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-[#e6ff4a]">
              {formatCurrency(proposalService.calculateTotals(formData.sections, formData.taxRate).totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/proposals')}
          className="bg-[#5a6a4a] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#6a7a5a] transition w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 hover:bg-[#d4f53a] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#313c2c] border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            `${mode === 'create' ? 'Create' : 'Update'} Proposal`
          )}
        </button>
      </div>
    </form>
  );
}; 