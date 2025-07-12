'use client';

import { pdfService } from '@/lib/pdfService';
import { LandscapeProposal, ProposalSection, ProposalItem } from '@/lib/proposalService';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Timestamp } from 'firebase/firestore';

export const PDFDemo = () => {
  const createSampleProposal = (): LandscapeProposal => {
    const sampleItems: ProposalItem[] = [
      {
        id: 'item-1',
        name: 'Premium Sod Installation',
        description: 'High-quality Kentucky Bluegrass sod for front yard',
        quantity: 500,
        unit: 'sq ft',
        unitPrice: 2.50,
        totalPrice: 1250.00,
        category: 'materials'
      },
      {
        id: 'item-2',
        name: 'Landscape Design Consultation',
        description: 'Professional landscape design and planning',
        quantity: 1,
        unit: 'session',
        unitPrice: 150.00,
        totalPrice: 150.00,
        category: 'labor'
      },
      {
        id: 'item-3',
        name: 'Irrigation System Installation',
        description: 'Complete sprinkler system with timer',
        quantity: 1,
        unit: 'system',
        unitPrice: 800.00,
        totalPrice: 800.00,
        category: 'equipment'
      }
    ];

    const sampleSections: ProposalSection[] = [
      {
        id: 'section-1',
        title: 'Landscaping Services',
        description: 'Complete front yard transformation including sod installation and irrigation',
        items: sampleItems,
        subtotal: 2200.00
      }
    ];

    return {
      id: 'demo-proposal',
      title: 'Front Yard Landscape Transformation',
      clientName: 'John Smith',
      clientEmail: 'john.smith@email.com',
      clientPhone: '(555) 123-4567',
      clientAddress: '123 Main Street, Anytown, CA 90210',
      projectAddress: '123 Main Street, Anytown, CA 90210',
      projectDescription: 'Transform the front yard with premium sod installation, professional landscape design, and automated irrigation system. This project will create a beautiful, low-maintenance landscape that enhances curb appeal and property value.',
      estimatedStartDate: new Date('2024-03-15'),
      estimatedDuration: 7,
      sections: sampleSections,
      subtotal: 2200.00,
      taxRate: 8.5,
      taxAmount: 187.00,
      totalAmount: 2387.00,
      terms: 'Payment terms: 50% deposit upon acceptance, remaining balance due upon completion. Warranty: 1 year on all materials and workmanship. Weather delays may affect timeline.',
      notes: 'Please ensure access to water source for irrigation system. We recommend scheduling this project during spring for optimal sod establishment.',
      status: 'draft',
      validUntil: new Date('2024-04-15'),
      userId: 'demo-user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
  };

  const handleGeneratePDF = async () => {
    const sampleProposal = createSampleProposal();
    await pdfService.downloadProposalPDF(sampleProposal, 'sample_proposal.pdf');
  };

  return (
    <div className="bg-[#4a5a3a] rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">PDF Generation Demo</h2>
      <p className="text-[#d2d7cb] mb-6">
        Test the PDF generation functionality with sample proposal data.
      </p>
      <button
        onClick={handleGeneratePDF}
        className="w-full bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#d4f53a] transition"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        Generate Sample PDF
      </button>
    </div>
  );
}; 