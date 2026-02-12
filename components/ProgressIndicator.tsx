
import React from 'react';
import { Loader2, Search, Brain, Target, Globe } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const getIcon = (text: string) => {
    if (text.includes('Planning')) return <Target className="text-blue-400" />;
    if (text.includes('Web') || text.includes('Search')) return <Globe className="text-emerald-400" />;
    if (text.includes('Pattern') || text.includes('Analysis')) return <Brain className="text-purple-400" />;
    return <Search className="text-zinc-400" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-green-500/15 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-28 h-28 rounded-full border border-white/10 flex items-center justify-center">
          <Loader2 size={48} className="text-green-500 animate-spin transition-all duration-1000" />
          <div className="absolute inset-2 rounded-full border border-dashed border-green-500/20 animate-[spin_10s_linear_infinite]" />
        </div>
      </div>
      
      <div className="text-center max-w-md w-full px-6">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Signal Discovery in Progress</h3>
        <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
          Switching models for faster validation. Estimated wait: 10-15 seconds.
        </p>
        
        <div className="space-y-4 text-left glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />
           <div className="flex items-center gap-4">
             <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
               {getIcon(currentStep)}
             </div>
             <div className="flex-1">
               <p className="text-sm font-bold text-white tracking-tight">{currentStep}</p>
               <div className="mt-3 w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                 <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
               </div>
             </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProgressIndicator;
