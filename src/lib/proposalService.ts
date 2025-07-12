import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface ProposalItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: 'materials' | 'labor' | 'equipment' | 'other';
}

export interface ProposalSection {
  id: string;
  title: string;
  description?: string;
  items: ProposalItem[];
  subtotal: number;
}

export interface LandscapeProposal {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  projectAddress: string;
  projectDescription: string;
  estimatedStartDate: Date;
  estimatedDuration: number; // in days
  sections: ProposalSection[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  terms: string;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateProposalData {
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  projectAddress: string;
  projectDescription: string;
  estimatedStartDate: Date;
  estimatedDuration: number;
  sections: ProposalSection[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  terms: string;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
}

export interface UpdateProposalData extends Partial<CreateProposalData> {
  updatedAt: Timestamp;
}

class ProposalService {
  private static instance: ProposalService;
  private readonly COLLECTION_NAME = 'proposals';

  private constructor() {}

  public static getInstance(): ProposalService {
    if (!ProposalService.instance) {
      ProposalService.instance = new ProposalService();
    }
    return ProposalService.instance;
  }

  // Get all proposals for a user
  async getProposals(userId: string, options?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<LandscapeProposal[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId)
      );

      // Add status filter if provided
      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }

      // Add date filters if provided
      if (options?.startDate) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(options.startDate)));
      }
      if (options?.endDate) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(options.endDate)));
      }

      // Add ordering - only if no status filter is applied to avoid index issues
      if (!options?.status) {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const proposals: LandscapeProposal[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        proposals.push({
          id: doc.id,
          title: data.title,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          clientAddress: data.clientAddress,
          projectAddress: data.projectAddress,
          projectDescription: data.projectDescription,
          estimatedStartDate: data.estimatedStartDate.toDate(),
          estimatedDuration: data.estimatedDuration,
          sections: data.sections,
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          totalAmount: data.totalAmount,
          terms: data.terms,
          notes: data.notes,
          status: data.status,
          validUntil: data.validUntil.toDate(),
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      return proposals;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw new Error('Failed to fetch proposals');
    }
  }

  // Get a single proposal by ID
  async getProposal(proposalId: string): Promise<LandscapeProposal | null> {
    try {
      const proposalDoc = await getDocs(query(
        collection(db, this.COLLECTION_NAME),
        where('__name__', '==', proposalId)
      ));

      if (proposalDoc.empty) {
        return null;
      }

      const doc = proposalDoc.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        projectAddress: data.projectAddress,
        projectDescription: data.projectDescription,
        estimatedStartDate: data.estimatedStartDate.toDate(),
        estimatedDuration: data.estimatedDuration,
        sections: data.sections,
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        totalAmount: data.totalAmount,
        terms: data.terms,
        notes: data.notes,
        status: data.status,
        validUntil: data.validUntil.toDate(),
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } catch (error) {
      console.error('Error fetching proposal:', error);
      throw new Error('Failed to fetch proposal');
    }
  }

  // Create a new proposal
  async createProposal(userId: string, proposalData: CreateProposalData): Promise<LandscapeProposal> {
    try {
      // Validate required fields
      if (!proposalData.title || !proposalData.clientName || !proposalData.clientEmail) {
        throw new Error('Title, client name, and client email are required');
      }

      // Calculate totals if not provided
      let subtotal = proposalData.subtotal;
      let taxAmount = proposalData.taxAmount;
      let totalAmount = proposalData.totalAmount;

      if (proposalData.sections && proposalData.sections.length > 0) {
        subtotal = proposalData.sections.reduce((sum, section) => sum + section.subtotal, 0);
        taxAmount = subtotal * (proposalData.taxRate / 100);
        totalAmount = subtotal + taxAmount;
      }

      const newProposal = {
        ...proposalData,
        subtotal,
        taxAmount,
        totalAmount,
        userId,
        estimatedStartDate: Timestamp.fromDate(proposalData.estimatedStartDate),
        validUntil: Timestamp.fromDate(proposalData.validUntil),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), newProposal);
      
      return {
        id: docRef.id,
        ...proposalData,
        subtotal,
        taxAmount,
        totalAmount,
        userId,
        createdAt: newProposal.createdAt,
        updatedAt: newProposal.updatedAt
      } as LandscapeProposal;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  // Update an existing proposal
  async updateProposal(proposalId: string, userId: string, proposalData: Partial<CreateProposalData>): Promise<void> {
    try {
      const updateData: any = {
        ...proposalData,
        updatedAt: Timestamp.now()
      };

      // Convert dates to Timestamps if provided
      if (proposalData.estimatedStartDate) {
        updateData.estimatedStartDate = Timestamp.fromDate(proposalData.estimatedStartDate);
      }
      if (proposalData.validUntil) {
        updateData.validUntil = Timestamp.fromDate(proposalData.validUntil);
      }

      // Recalculate totals if sections are updated
      if (proposalData.sections) {
        const subtotal = proposalData.sections.reduce((sum, section) => sum + section.subtotal, 0);
        const taxAmount = subtotal * ((proposalData.taxRate || 0) / 100);
        const totalAmount = subtotal + taxAmount;
        
        updateData.subtotal = subtotal;
        updateData.taxAmount = taxAmount;
        updateData.totalAmount = totalAmount;
      }

      const proposalRef = doc(db, this.COLLECTION_NAME, proposalId);
      await updateDoc(proposalRef, updateData);
    } catch (error) {
      console.error('Error updating proposal:', error);
      throw error;
    }
  }

  // Delete a proposal
  async deleteProposal(proposalId: string, userId: string): Promise<void> {
    try {
      const proposalRef = doc(db, this.COLLECTION_NAME, proposalId);
      await deleteDoc(proposalRef);
    } catch (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  }

  // Calculate proposal totals
  calculateTotals(sections: ProposalSection[], taxRate: number): {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  } {
    const subtotal = sections.reduce((sum, section) => sum + section.subtotal, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100
    };
  }

  // Calculate section totals
  calculateSectionTotal(items: ProposalItem[]): number {
    return Math.round(items.reduce((sum, item) => sum + item.totalPrice, 0) * 100) / 100;
  }

  // Calculate item total
  calculateItemTotal(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
  }
}

export const proposalService = ProposalService.getInstance(); 