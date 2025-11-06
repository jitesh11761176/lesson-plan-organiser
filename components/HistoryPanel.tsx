import React from 'react';
import { LessonPlan } from '../types';

interface HistoryPanelProps {
  history: LessonPlan[];
  onSelectPlan: (plan: LessonPlan) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectPlan }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Generation History</h2>
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <i className="fas fa-history text-4xl text-gray-300 mb-4"></i>
          <p>No lesson plans generated yet.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {history.map((plan) => (
            <li key={plan.id}>
              <button
                onClick={() => onSelectPlan(plan)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="font-semibold text-gray-800">
                  {plan.meta.subject} - Class {plan.meta.classNumber}
                </div>
                <div className="text-sm text-gray-500">
                  {plan.meta.dateRange}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Generated on: {new Date(plan.timestamp).toLocaleString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;