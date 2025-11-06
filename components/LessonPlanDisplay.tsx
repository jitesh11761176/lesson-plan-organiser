
import React from 'react';
import { LessonPlan, SignatureImages } from '../types';

interface LessonPlanDisplayProps {
  plan: LessonPlan | null;
  isLoading: boolean;
  error: string | null;
  signatures: SignatureImages;
}

const Section: React.FC<{ title: string; items: string[] | undefined; icon: string }> = ({ title, items, icon }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-6 break-words">
            <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-blue-200 pb-2 mb-3 flex items-center">
                 <i className={`fas ${icon} text-blue-500 mr-3`}></i>
                {title}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-2">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );
};

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-8">
    {[...Array(6)].map((_, i) => (
      <div key={i}>
        <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const SignatureDisplay: React.FC<{ label: string, signature: string | null }> = ({ label, signature }) => (
    <div>
        <div className="h-24 flex items-end justify-center">
             {signature ? 
                <img src={signature} alt={`${label}'s signature`} className="max-h-20 max-w-full" /> :
                <div className="border-b border-gray-400 w-48"></div>
            }
        </div>
        <p className="font-bold text-center mt-2">{label}</p>
    </div>
);


const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan, isLoading, error, signatures }) => {

  const handlePrint = () => {
    const printContents = document.getElementById('printable-plan')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // to re-attach React
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Generated Lesson Plan</h2>
        {plan && (
             <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                <i className="fas fa-print mr-2"></i>Print
              </button>
        )}
      </div>
      
      {isLoading && <SkeletonLoader />}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && !plan && (
         <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">
              <i className="fas fa-file-alt"></i>
            </div>
            <p className="text-gray-500">Your lesson plan will appear here.</p>
            <p className="text-sm text-gray-400 mt-2">Fill in the details and upload a syllabus to get started.</p>
        </div>
      )}
      
      <div id="printable-plan">
      {plan && (
        <div>
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-center text-blue-700">KVS Lesson Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-center">
                <div><span className="font-semibold">Class:</span> {plan.meta.classNumber}</div>
                <div><span className="font-semibold">Subject:</span> {plan.meta.subject}</div>
                <div><span className="font-semibold">Date Range:</span> {plan.meta.dateRange}</div>
            </div>
          </div>
          <Section title="Concepts" items={plan.concepts} icon="fa-lightbulb" />
          <Section title="Learning Outcomes" items={plan.learning_outcomes} icon="fa-graduation-cap" />
          <Section title="Pedagogical Strategies" items={plan.pedagogical_strategies} icon="fa-chalkboard-teacher" />
          <Section title="Assessment Format" items={plan.assessment_format} icon="fa-tasks" />
          <Section title="Resources" items={plan.resources} icon="fa-book" />
          <Section title="Real-life Applications" items={plan.real_life_applications} icon="fa-briefcase" />
          <Section title="Values & Skills" items={plan.values_skills} icon="fa-hands-helping" />
          <Section title="Reflections & Remedial Plan" items={plan.reflections_and_remedial_plan} icon="fa-sync-alt" />


          <div className="mt-16 pt-6 border-t border-gray-200 flex justify-around text-sm text-gray-500">
            <SignatureDisplay label="Teacher's Signature" signature={signatures.teacher} />
            <SignatureDisplay label="Principal's Signature" signature={signatures.principal} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LessonPlanDisplay;
