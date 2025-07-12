'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyHeader } from './CompanyHeader';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  DocumentArrowDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

interface InvoiceViewProps {
  invoiceId: string;
}

export const InvoiceView = ({ invoiceId }: InvoiceViewProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock invoice data for demonstration
    const mockInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: 'INV-2024-001',
      clientName: 'John Smith',
      clientEmail: 'john.smith@example.com',
      clientAddress: '123 Main Street, Anytown, CA 90210',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      items: [
        {
          id: '1',
          description: 'Landscape Design Consultation',
          quantity: 1,
          unitPrice: 150,
          total: 150
        },
        {
          id: '2',
          description: 'Tree Planting Services',
          quantity: 3,
          unitPrice: 200,
          total: 600
        },
        {
          id: '3',
          description: 'Irrigation System Installation',
          quantity: 1,
          unitPrice: 1200,
          total: 1200
        }
      ],
      subtotal: 1950,
      taxRate: 8.5,
      taxAmount: 165.75,
      totalAmount: 2115.75,
      status: 'sent',
      notes: 'Payment due within 30 days. Late fees may apply.'
    };

    setInvoice(mockInvoice);
    setLoading(false);
  }, [invoiceId]);

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
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    // This would integrate with the PDF service
    console.log('Downloading invoice PDF...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Invoice not found
        </div>
        <button
          onClick={() => router.push('/invoices')}
          className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-3 hover:bg-[#d4f53a] transition"
        >
          Back to Invoices
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

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8 print:mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 print:text-2xl">INVOICE</h1>
          <p className="text-lg text-[#d2d7cb] print:text-sm">
            #{invoice.invoiceNumber}
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
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

      {/* Status and Dates */}
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
          {invoice.status.toUpperCase()}
        </span>
        <button
          onClick={() => router.push('/invoices')}
          className="text-[#e6ff4a] hover:text-[#d4f53a] transition print:hidden flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Invoices
        </button>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Information */}
        <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
          <h2 className="text-2xl font-bold mb-6 print:text-xl">Bill To</h2>
          <div className="space-y-2">
            <p className="font-semibold text-white print:text-black">{invoice.clientName}</p>
            <p className="text-[#d2d7cb] print:text-gray-600">{invoice.clientEmail}</p>
            {invoice.clientAddress && (
              <p className="text-[#d2d7cb] print:text-gray-600">{invoice.clientAddress}</p>
            )}
          </div>
        </div>

        {/* Invoice Information */}
        <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
          <h2 className="text-2xl font-bold mb-6 print:text-xl">Invoice Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#d2d7cb] print:text-gray-600">Invoice Number:</span>
              <span className="font-semibold">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#d2d7cb] print:text-gray-600">Issue Date:</span>
              <span>{invoice.issueDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#d2d7cb] print:text-gray-600">Due Date:</span>
              <span>{invoice.dueDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#d2d7cb] print:text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <h2 className="text-2xl font-bold mb-6 print:text-xl">Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#5a6a4a] print:border-gray-300">
                <th className="text-left py-2 font-semibold">Description</th>
                <th className="text-right py-2 font-semibold">Qty</th>
                <th className="text-right py-2 font-semibold">Unit Price</th>
                <th className="text-right py-2 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-[#5a6a4a] print:border-gray-200">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right font-semibold text-[#e6ff4a] print:text-black">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <div className="flex justify-end">
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t border-[#5a6a4a] print:border-gray-300 pt-3">
              <span>Total:</span>
              <span className="text-[#e6ff4a] print:text-black">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-[#4a5a3a] rounded-xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
          <h2 className="text-2xl font-bold mb-6 print:text-xl">Notes</h2>
          <p className="whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

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