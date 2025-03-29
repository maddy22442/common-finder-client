import React, { useState } from 'react';
import { Upload, FileUp, Loader2, AlertCircle, Trash2, Download } from 'lucide-react';

interface ApiResponse {
  count: number;
  commonAddresses: string[];
}

const rainbowColors = [
  'text-red-400', 'text-orange-400', 'text-yellow-400',
  'text-green-400', 'text-blue-400', 'text-indigo-400', 'text-purple-400'
];

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length < 2) {
        setError('Please select at least 2 files');
        setFiles([]);
      } else {
        setFiles(fileList);
        setError(null);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) {
      setError('Please select at least 2 files');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    try {
      const response = await fetch('http://localhost:3000/api/find-common', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Processing failed');
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result.commonAddresses.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'common_addresses.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <Upload className="mx-auto h-12 w-12 text-indigo-400" />
          <h1 className="mt-3 text-3xl font-bold">Common Address Finder</h1>
          <p className="mt-2 text-gray-400">Upload files to find common addresses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-500 p-6 rounded-lg text-center">
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <label className="block mt-2 cursor-pointer text-indigo-400 font-medium">
              Upload Files
              <input
                type="file"
                multiple
                accept=".txt,.json"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-sm text-gray-500">TXT or JSON files only</p>
          </div>
          
          {files.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Selected Files:</h4>
              <ul className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                    <span className="text-sm">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-900 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || files.length < 2}
            className={`w-full py-2 px-4 rounded-md text-white font-medium shadow-sm transition-all ${
              isLoading || files.length < 2
                ? 'bg-indigo-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 inline-block" /> Processing...
              </>
            ) : (
              'Find Common Addresses'
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-lg font-medium">Results</h2>
            <p className="mt-2 text-sm">Found {result.count} common addresses</p>
            <div className="mt-4 max-h-60 overflow-y-auto bg-gray-700 p-4 rounded-md">
              <ul className="text-sm space-y-2">
                {result.commonAddresses.map((address, index) => (
                  <li key={index} className="font-mono">
                    {address.split('').map((char, charIndex) => (
                      <span 
                      key={charIndex} 
                      className={`text-lg font-mono italic text-xl ${rainbowColors[charIndex % rainbowColors.length]}`}
                    >
                      {char}
                    </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={downloadResult}
              className="mt-4 flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm"
            >
              <Download className="w-5 h-5 mr-2" /> Download Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
