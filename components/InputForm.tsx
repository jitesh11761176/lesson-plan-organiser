
import React, { useState, useCallback } from 'react';
import { FileAttachment } from '../types';

interface InputFormProps {
  onGenerate: (
    classNumber: string,
    subject: string,
    dateRange: string,
    file: FileAttachment | null,
    isBilingual: boolean
  ) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [classNumber, setClassNumber] = useState('X');
  const [subject, setSubject] = useState('Artificial Intelligence');
  const [dateRange, setDateRange] = useState('1–15 August 2025');
  const [file, setFile] = useState<FileAttachment | null>(null);
  const [fileName, setFileName] = useState('');
  const [isBilingual, setIsBilingual] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFile({
          name: selectedFile.name,
          mimeType: selectedFile.type,
          data: base64String,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(classNumber, subject, dateRange, file, isBilingual);
  };
  
  const isFormValid = classNumber && subject && dateRange && file;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Lesson Plan Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-600 mb-2">
            Class
          </label>
          <input
            type="text"
            id="class"
            value={classNumber}
            onChange={(e) => setClassNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., X"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., Artificial Intelligence"
            required
          />
        </div>
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-600 mb-2">
            Date Range
          </label>
          <input
            type="text"
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., 1–15 August 2025"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Split-up Syllabus
          </label>
          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <div className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg">
              <i className="fas fa-cloud-upload-alt text-gray-400 mr-3 text-xl"></i>
              <span className="text-gray-600">{fileName || 'Upload a file'}</span>
            </div>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
          </label>
           {fileName && <p className="text-xs text-gray-500 mt-2">File: {fileName}</p>}
        </div>
         <div className="flex items-center">
            <input
              id="bilingual"
              name="bilingual"
              type="checkbox"
              checked={isBilingual}
              onChange={(e) => setIsBilingual(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="bilingual" className="ml-2 block text-sm text-gray-700">
              Generate Bilingual Plan (English & Hindi)
            </label>
          </div>
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Plan'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
