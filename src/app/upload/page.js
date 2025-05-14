'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setMessage('Uploading...');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setMessage(`Successfully uploaded ${result.insertedCount} fixtures`);
      setUploadResult(result);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container min-h-screen mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Upload Fixtures CSV</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Select CSV file:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {uploadResult && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Upload Summary</h2>
          <p>Fixtures inserted: {uploadResult.Count}</p>
          
          <h3 className="font-medium mt-4 mb-2">Sample Data:</h3>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(uploadResult.fixtures, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}