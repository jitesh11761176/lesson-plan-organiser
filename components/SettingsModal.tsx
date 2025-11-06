
import React, { useState } from 'react';
import { SignatureImages } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (signatures: SignatureImages) => void;
  currentSignatures: SignatureImages;
}

const SignatureUpload: React.FC<{ label: string; signature: string | null; onUpload: (file: string | null) => void }> = ({ label, signature, onUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md h-32">
        {signature ? (
          <img src={signature} alt={label} className="max-h-full max-w-full" />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      <div className="mt-2 flex items-center space-x-2">
         <label htmlFor={`${label}-upload`} className="flex-1 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center">
            Upload
         </label>
        <input id={`${label}-upload`} type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
        {signature && (
            <button onClick={() => onUpload(null)} className="py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Remove
            </button>
        )}
      </div>
    </div>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave, currentSignatures }) => {
  const [signatures, setSignatures] = useState<SignatureImages>(currentSignatures);

  const handleSave = () => {
    onSave(signatures);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Settings</h3>
        </div>
        <div className="p-6 space-y-6">
            <h4 className="text-md font-semibold text-gray-700">Manage Signatures</h4>
            <SignatureUpload 
                label="Teacher's Signature" 
                signature={signatures.teacher}
                onUpload={(file) => setSignatures(s => ({...s, teacher: file}))}
            />
            <SignatureUpload 
                label="Principal's Signature" 
                signature={signatures.principal}
                onUpload={(file) => setSignatures(s => ({...s, principal: file}))}
            />
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
