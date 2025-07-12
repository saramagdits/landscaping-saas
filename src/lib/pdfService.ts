import { LandscapeProposal } from './proposalService';
import { CompanyService } from './companyService';

export class PDFService {
  private static instance: PDFService;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return '#808080';
      case 'sent': return '#3b82f6';
      case 'accepted': return '#22c55e';
      case 'rejected': return '#ef4444';
      case 'expired': return '#f59e0b';
      default: return '#808080';
    }
  }

  // All the following methods now use dynamic import for jsPDF
  private async addHeader(doc: any, proposal: LandscapeProposal, userId?: string): Promise<void> {
    let currentY = 30;
    
    // Try to get company information
    let companyInfo = null;
    if (userId) {
      try {
        companyInfo = await CompanyService.getCompanyInfo(userId);
      } catch (error) {
        console.warn('Could not load company info for PDF:', error);
      }
    }
    
    // Company header (left side)
    if (companyInfo && companyInfo.name) {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(74, 90, 58); // #4a5a3a
      doc.text(companyInfo.name, 20, currentY);
      currentY += 8;
      
      if (companyInfo.address || companyInfo.city || companyInfo.state || companyInfo.zipCode) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const address = CompanyService.getFormattedAddress(companyInfo);
        if (address) {
          doc.text(address, 20, currentY);
          currentY += 6;
        }
      }
      
      if (companyInfo.phone) {
        doc.text(`Phone: ${companyInfo.phone}`, 20, currentY);
        currentY += 6;
      }
      
      if (companyInfo.email) {
        doc.text(`Email: ${companyInfo.email}`, 20, currentY);
        currentY += 6;
      }
      
      if (companyInfo.website) {
        doc.text(`Website: ${companyInfo.website}`, 20, currentY);
        currentY += 6;
      }
    } else {
      // Fallback to generic header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(74, 90, 58); // #4a5a3a
      doc.text('Landscape Pro', 20, currentY);
      currentY += 15;
    }
    
    // Proposal title and details (right side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(proposal.title, 120, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Created: ${this.formatDate(proposal.createdAt.toDate())}`, 120, 45);
    doc.text(`Valid Until: ${this.formatDate(proposal.validUntil)}`, 120, 55);
    
    // Status badge
    const statusText = proposal.status.toUpperCase();
    const statusWidth = doc.getTextWidth(statusText);
    const statusColor = this.getStatusColor(proposal.status);
    doc.setFillColor(statusColor);
    doc.rect(180, 25, statusWidth + 10, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, 185, 35);
  }

  private async addClientInfo(doc: any, proposal: LandscapeProposal, yPosition: number): Promise<number> {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 90, 58);
    doc.text('Client Information', 20, yPosition);
    let currentY = yPosition + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const leftColumn = 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', leftColumn, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(proposal.clientName, leftColumn + 25, currentY);
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', leftColumn, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(proposal.clientEmail, leftColumn + 25, currentY);
    currentY += 8;
    if (proposal.clientPhone) {
      doc.setFont('helvetica', 'bold');
      doc.text('Phone:', leftColumn, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(proposal.clientPhone, leftColumn + 25, currentY);
      currentY += 8;
    }
    if (proposal.clientAddress) {
      doc.setFont('helvetica', 'bold');
      doc.text('Address:', leftColumn, currentY);
      doc.setFont('helvetica', 'normal');
      const addressLines = doc.splitTextToSize(proposal.clientAddress, 60);
      doc.text(addressLines, leftColumn + 25, currentY);
      currentY += (addressLines.length * 8);
    }
    return currentY + 10;
  }

  private async addProjectInfo(doc: any, proposal: LandscapeProposal, yPosition: number): Promise<number> {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 90, 58);
    doc.text('Project Information', 20, yPosition);
    let currentY = yPosition + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    if (proposal.projectAddress) {
      doc.setFont('helvetica', 'bold');
      doc.text('Project Address:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      const addressLines = doc.splitTextToSize(proposal.projectAddress, 150);
      doc.text(addressLines, 20, currentY + 8);
      currentY += (addressLines.length * 8) + 8;
    }
    if (proposal.projectDescription) {
      doc.setFont('helvetica', 'bold');
      doc.text('Project Description:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(proposal.projectDescription, 150);
      doc.text(descLines, 20, currentY + 8);
      currentY += (descLines.length * 8) + 8;
    }
    doc.setFont('helvetica', 'bold');
    doc.text('Timeline:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 8;
    doc.text(`Start Date: ${this.formatDate(proposal.estimatedStartDate)}`, 25, currentY);
    currentY += 8;
    doc.text(`Duration: ${proposal.estimatedDuration} days`, 25, currentY);
    currentY += 8;
    doc.text(`Valid Until: ${this.formatDate(proposal.validUntil)}`, 25, currentY);
    return currentY + 15;
  }

  private async addProposalSections(doc: any, proposal: LandscapeProposal, yPosition: number): Promise<number> {
    if (proposal.sections.length === 0) {
      return yPosition;
    }
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 90, 58);
    doc.text('Proposal Details', 20, yPosition);
    let currentY = yPosition + 15;
    for (const section of proposal.sections) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(section.title, 20, currentY);
      currentY += 8;
      if (section.description) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const descLines = doc.splitTextToSize(section.description, 150);
        doc.text(descLines, 25, currentY);
        currentY += (descLines.length * 6) + 5;
      }
      if (section.items.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const headers = ['Item', 'Description', 'Qty', 'Unit', 'Unit Price', 'Total'];
        const columnWidths = [40, 50, 15, 20, 25, 25];
        let xPos = 20;
        doc.setFillColor(74, 90, 58);
        doc.rect(20, currentY - 5, 175, 10, 'F');
        doc.setTextColor(255, 255, 255);
        headers.forEach((header, index) => {
          doc.text(header, xPos, currentY);
          xPos += columnWidths[index];
        });
        currentY += 15;
        doc.setTextColor(0, 0, 0);
        for (const item of section.items) {
          if (currentY > 250) {
            doc.addPage();
            currentY = 30;
          }
          xPos = 20;
          doc.setFont('helvetica', 'normal');
          const itemLines = doc.splitTextToSize(item.name, columnWidths[0] - 2);
          doc.text(itemLines, xPos, currentY);
          xPos += columnWidths[0];
          const descLines = doc.splitTextToSize(item.description, columnWidths[1] - 2);
          doc.text(descLines, xPos, currentY);
          xPos += columnWidths[1];
          doc.text(item.quantity.toString(), xPos, currentY);
          xPos += columnWidths[2];
          doc.text(item.unit, xPos, currentY);
          xPos += columnWidths[3];
          doc.text(this.formatCurrency(item.unitPrice), xPos, currentY);
          xPos += columnWidths[4];
          doc.setFont('helvetica', 'bold');
          doc.text(this.formatCurrency(item.totalPrice), xPos, currentY);
          currentY += Math.max(itemLines.length, descLines.length) * 6 + 5;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(74, 90, 58);
        doc.text(`Section Total: ${this.formatCurrency(section.subtotal)}`, 140, currentY);
        currentY += 15;
      }
      currentY += 10;
    }
    return currentY;
  }

  private async addTotals(doc: any, proposal: LandscapeProposal, yPosition: number): Promise<number> {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.rect(120, yPosition - 10, 75, 50, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(120, yPosition - 10, 75, 50, 'S');
    let currentY = yPosition;
    doc.text('Subtotal:', 125, currentY);
    doc.text(this.formatCurrency(proposal.subtotal), 170, currentY);
    currentY += 10;
    doc.text('Tax:', 125, currentY);
    doc.text(`${proposal.taxRate}%`, 170, currentY);
    currentY += 10;
    doc.text('Tax Amount:', 125, currentY);
    doc.text(this.formatCurrency(proposal.taxAmount), 170, currentY);
    currentY += 10;
    doc.setFontSize(16);
    doc.setTextColor(74, 90, 58);
    doc.text('TOTAL:', 125, currentY);
    doc.text(this.formatCurrency(proposal.totalAmount), 170, currentY);
    return yPosition + 60;
  }

  private async addTermsAndNotes(doc: any, proposal: LandscapeProposal, yPosition: number): Promise<void> {
    let currentY = yPosition;
    if (proposal.terms) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(74, 90, 58);
      doc.text('Terms and Conditions', 20, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const termsLines = doc.splitTextToSize(proposal.terms, 150);
      doc.text(termsLines, 20, currentY);
      currentY += (termsLines.length * 6) + 15;
    }
    if (proposal.notes) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(74, 90, 58);
      doc.text('Notes', 20, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const notesLines = doc.splitTextToSize(proposal.notes, 150);
      doc.text(notesLines, 20, currentY);
    }
  }

  public async generateProposalPDF(proposal: LandscapeProposal, userId?: string): Promise<any> {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    await this.addHeader(doc, proposal, userId);
    let currentY = await this.addClientInfo(doc, proposal, 90);
    currentY = await this.addProjectInfo(doc, proposal, currentY);
    currentY = await this.addProposalSections(doc, proposal, currentY);
    currentY = await this.addTotals(doc, proposal, currentY);
    await this.addTermsAndNotes(doc, proposal, currentY);
    return doc;
  }

  public async downloadProposalPDF(proposal: LandscapeProposal, filename?: string, userId?: string): Promise<void> {
    const doc = await this.generateProposalPDF(proposal, userId);
    const defaultFilename = `${proposal.title.replace(/[^a-zA-Z0-9]/g, '_')}_proposal.pdf`;
    doc.save(filename || defaultFilename);
  }

  public async getProposalPDFAsBlob(proposal: LandscapeProposal, userId?: string): Promise<Blob> {
    const doc = await this.generateProposalPDF(proposal, userId);
    return doc.output('blob');
  }
}

export const pdfService = PDFService.getInstance(); 