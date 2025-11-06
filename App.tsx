import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';
import HistoryPanel from './components/HistoryPanel';
import SettingsModal from './components/SettingsModal';
import DashboardView from './components/DashboardView';
import { LessonPlan, LessonPlanData, FileAttachment, SignatureImages } from './types';
import { generateLessonPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);
  const [history, setHistory] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [signatures, setSignatures] = useState<SignatureImages>({ teacher: null, principal: null });
  const [currentView, setCurrentView] = useState<'generator' | 'dashboard'>('generator');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('lessonPlanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedSignatures = localStorage.getItem('signatures');
      if (storedSignatures) {
        setSignatures(JSON.parse(storedSignatures));
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  const handleGeneratePlan = async (
    classNumber: string,
    subject: string,
    dateRange: string,
    file: FileAttachment | null,
    isBilingual: boolean
  ) => {
    if (!file) {
      setError('Please upload a syllabus file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActivePlan(null);
    if (isHistoryVisible) setIsHistoryVisible(false);
    if (currentView === 'dashboard') setCurrentView('generator');


    const previousReflections = history.length > 0 ? history[0].reflections_and_remedial_plan : null;

    try {
      const generatedData: LessonPlanData = await generateLessonPlan(
        classNumber,
        subject,
        dateRange,
        file,
        isBilingual,
        previousReflections
      );
      
      const newPlan: LessonPlan = {
        ...generatedData,
        id: `plan-${Date.now()}`,
        timestamp: Date.now(),
        meta: { classNumber, subject, dateRange }
      };

      setActivePlan(newPlan);

      const updatedHistory = [newPlan, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('lessonPlanHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectPlan = (plan: LessonPlan) => {
    setActivePlan(plan);
    setIsHistoryVisible(false);
    setCurrentView('generator');
  };

  const handleSaveSignatures = (newSignatures: SignatureImages) => {
    setSignatures(newSignatures);
    localStorage.setItem('signatures', JSON.stringify(newSignatures));
    setIsSettingsVisible(false);
  }
  
  const toggleView = (view: 'generator' | 'dashboard') => {
      if (view === 'generator' && currentView === 'generator') {
          // If we are already on generator view, reset the active plan to show the input form
          setActivePlan(null);
          setError(null);
      } else {
        setCurrentView(view);
      }
       setIsHistoryVisible(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {isSettingsVisible && <SettingsModal currentSignatures={signatures} onSave={handleSaveSignatures} onClose={() => setIsSettingsVisible(false)} />}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                 <button onClick={() => toggleView('generator')} className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">KVS AI Lesson Plan Generator</h1>
                 </button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => toggleView('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
              </button>
              <button onClick={() => { setIsHistoryVisible(!isHistoryVisible); if(currentView === 'dashboard') setCurrentView('generator'); }} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isHistoryVisible ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <i className="fas fa-history mr-2"></i>History
              </button>
               <button onClick={() => setIsSettingsVisible(true)} className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors">
                <i className="fas fa-cog mr-2"></i>Settings
              </button>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' ? (
          <DashboardView history={history} onSelectPlan={handleSelectPlan} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              {isHistoryVisible ? 
                <HistoryPanel history={history} onSelectPlan={handleSelectPlan} /> : 
                <InputForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
              }
            </div>
            <div className="lg:col-span-8">
              <LessonPlanDisplay plan={activePlan} isLoading={isLoading} error={error} signatures={signatures} />
            </div>
          </div>
        )}
      </main>

       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Designed for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;