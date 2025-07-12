import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  updatedAt: any;
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  email: '',
  website: '',
  logoUrl: '',
  updatedAt: serverTimestamp(),
};

export class CompanyService {
  // Get company information for a user
  static async getCompanyInfo(uid: string): Promise<CompanyInfo> {
    try {
      const companyDoc = await getDoc(doc(db, 'users', uid, 'company', 'info'));
      if (companyDoc.exists()) {
        return companyDoc.data() as CompanyInfo;
      }
      return DEFAULT_COMPANY_INFO;
    } catch (error) {
      console.error('Error fetching company info:', error);
      return DEFAULT_COMPANY_INFO;
    }
  }

  // Update company information
  static async updateCompanyInfo(uid: string, companyInfo: Partial<CompanyInfo>): Promise<void> {
    try {
      const companyRef = doc(db, 'users', uid, 'company', 'info');
      await setDoc(companyRef, {
        ...companyInfo,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  }

  // Upload company logo
  static async uploadLogo(uid: string, file: File): Promise<string> {
    try {
      console.log('Starting logo upload for user:', uid, 'File:', file.name, 'Size:', file.size);
      
      // Delete existing logo if it exists
      const existingInfo = await this.getCompanyInfo(uid);
      if (existingInfo.logoUrl) {
        console.log('Deleting existing logo:', existingInfo.logoUrl);
        await this.deleteLogo(uid, existingInfo.logoUrl);
      }

      // Create a unique filename to avoid conflicts
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `logo_${timestamp}.${fileExtension}`;
      
      console.log('Uploading to path:', `company-logos/${uid}/${uniqueFileName}`);
      
      // Upload new logo
      const logoRef = ref(storage, `company-logos/${uid}/${uniqueFileName}`);
      console.log('Uploading file...');
      const snapshot = await uploadBytes(logoRef, file);
      console.log('Upload completed, getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);

      // Update company info with new logo URL
      console.log('Updating company info with new logo URL...');
      await this.updateCompanyInfo(uid, { logoUrl: downloadURL });
      console.log('Company info updated successfully');

      return downloadURL;
    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          code: (error as any).code,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  // Delete company logo
  static async deleteLogo(uid: string, logoUrl: string): Promise<void> {
    try {
      if (!logoUrl) return;

      // Extract the path from the URL
      const urlParts = logoUrl.split('/');
      const pathIndex = urlParts.findIndex(part => part === 'o');
      if (pathIndex !== -1) {
        const encodedPath = urlParts[pathIndex + 1];
        const decodedPath = decodeURIComponent(encodedPath);
        const logoRef = ref(storage, decodedPath);
        await deleteObject(logoRef);
      }

      // Remove logo URL from company info
      await this.updateCompanyInfo(uid, { logoUrl: '' });
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw error;
    }
  }

  // Get formatted company address
  static getFormattedAddress(companyInfo: CompanyInfo): string {
    const parts = [
      companyInfo.address,
      companyInfo.city,
      companyInfo.state,
      companyInfo.zipCode
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  // Get company display name
  static getCompanyDisplayName(companyInfo: CompanyInfo): string {
    return companyInfo.name || 'Your Company';
  }
} 