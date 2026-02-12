
import React, { useState } from 'react';
import { Problem } from '../types';
import { ChevronDown, ChevronUp, ExternalLink, Quote, AlertTriangle, Lightbulb, Users, BarChart } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 6) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
  };

  return (
    <div className={`glass rounded-2xl transition-all duration-300 ${isExpanded ? 'ring-1 ring-green-500/30' : 'hover:bg-white/5'}`}>
      <div 
        className="p-6 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-400">
                #{problem.rank}
              </span>
              <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getScoreColor(problem.signalScore)}`}>
                Signal: {problem.signalScore.toFixed(1)}/10
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
              {problem.problemStatement}
            </h3>
          </div>
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
          </div>
        </div>

        {/* Mini Preview Scores */}
        {!isExpanded && (
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Users size={14} className="text-zinc-600" />
              <span>Freq: <span className="text-zinc-300">{problem.scores.frequency}/10</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <AlertTriangle size={14} className="text-zinc-600" />
              <span>Pain: <span className="text-zinc-300">{problem.scores.painIntensity}/10</span></span>
            </div>
             <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <BarChart size={14} className="text-zinc-600" />
              <span>Gap: <span className="text-zinc-300">{problem.scores.competitiveGap}/10</span></span>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-6 pb-8 pt-2 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
             {/* Fixed arithmetic errors by explicitly casting Object.entries values to number */}
             {(Object.entries(problem.scores) as Array<[string, number]>).map(([key, value]) => (
               <div key={key} className="p-3 rounded-xl bg-black/40 border border-white/5">
                 <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                 <div className="flex items-end gap-1">
                    <span className="text-lg font-bold text-white">{value}</span>
                    <span className="text-[10px] text-zinc-600 mb-1">/10</span>
                 </div>
                 <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${value * 10}%`, opacity: value / 10 }}
                    />
                 </div>
               </div>
             ))}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Quote size={18} className="text-green-500" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Verbatim Evidence</h4>
            </div>
            <div className="space-y-3">
              {problem.evidence.map((quote, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 group">
                  <p className="text-zinc-300 italic mb-2 leading-relaxed">"{quote.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase">{quote.source} • {quote.platform}</span>
                    <a 
                      href={quote.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] flex items-center gap-1 text-green-500/70 hover:text-green-400 transition-colors"
                    >
                      Verify Receipt <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-orange-500" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Competitive Gaps</h4>
              </div>
              <div className="space-y-4">
                {problem.existingSolutions.map((solution, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-600">
                      {solution.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-sm font-medium text-zinc-200">{solution.name}</span>
                         <span className="text-[10px] text-zinc-500">{solution.rating}/5</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-tight">{solution.complaintSummary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-green-400" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400">Validation Protocol</h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                {problem.suggestedNextStep}
              </p>
              <button className="w-full py-2.5 rounded-lg bg-green-500 text-black text-xs font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/10">
                Download Interview Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
