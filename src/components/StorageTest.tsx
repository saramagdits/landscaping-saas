'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const StorageTest = () => {
  const { user } = useAuth();
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      setResult(`Selected file: ${file.name} (${file.size} bytes)`);
    }
  };

  const testUpload = async () => {
    if (!testFile || !user?.uid) {
      setResult('No file selected or user not authenticated');
      return;
    }

    setUploading(true);
    setResult('Starting upload test...');

    try {
      // Test upload to a simple path
      const testRef = ref(storage, `test/${user.uid}/test-${Date.now()}.txt`);
      const testContent = new Blob(['Test file content'], { type: 'text/plain' });
      
      setResult('Uploading test file...');
      const snapshot = await uploadBytes(testRef, testContent);
      
      setResult('Getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setResult(`✅ Upload successful! URL: ${downloadURL}`);
    } catch (error) {
      console.error('Storage test error:', error);
      setResult(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#4a5a3a] rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Firebase Storage Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
            Select Test File
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
          />
        </div>
        
        <button
          onClick={testUpload}
          disabled={!testFile || uploading}
          className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 hover:bg-[#d4f53a] transition disabled:opacity-50"
        >
          {uploading ? 'Testing...' : 'Test Upload'}
        </button>
        
        {result && (
          <div className="bg-[#5a6a4a] rounded-lg p-4">
            <p className="text-sm text-[#d2d7cb] whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 