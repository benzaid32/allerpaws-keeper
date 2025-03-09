
import React from 'react';
import { PlusCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SymptomDiaryHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
        Symptom Diary
      </h1>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          onClick={() => navigate('/symptom-diary/new')}
          className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Entry
        </Button>
        <Button
          onClick={() => navigate('/symptoms-management')}
          variant="outline"
          className="flex-1 sm:flex-initial border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Activity className="h-4 w-4 mr-2" />
          Manage Symptoms
        </Button>
      </div>
    </div>
  );
};

export default SymptomDiaryHeader;
