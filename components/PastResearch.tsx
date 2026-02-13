import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Problem } from '../types';
import { Clock, Search, TrendingUp, ExternalLink } from 'lucide-react';
import ProblemCard from './ProblemCard';

interface PastResearchProps {
  userProfile: UserProfile;
  onNavigateToDiscover?: () => void;
}

interface SearchHistory {
  id: string;
  topic: string;
  results: Problem[];
  created_at: string;
}

export const PastResearch: React.FC<PastResearchProps> = ({ userProfile, onNavigateToDiscover }) => {
  const [searches, setSearches] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<SearchHistory | null>(null);

  useEffect(() => {
    fetchSearchHistory();
  }, [userProfile.id]);

  const fetchSearchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('searches')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSearches(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (selectedSearch) {
    return (
      <div className="animate-in fade-in duration-500">
        <button
          onClick={() => setSelectedSearch(null)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-6"
        >
          ← Back to History
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2">
            <span className="text-green-500">"{selectedSearch.topic}"</span>
          </h2>
          <p className="text-zinc-500">
            Researched {formatDate(selectedSearch.created_at)} • {selectedSearch.results.length} problems found
          </p>
        </div>

        <div className="space-y-6">
          {selectedSearch.results.map((problem: Problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-3">
          Past Research
        </h1>
        <p className="text-zinc-400 text-lg">
          Review your previous searches and revisit discovered problems
        </p>
      </div>

      {searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 rounded-full bg-zinc-900/50 border border-white/5 mb-6">
            <Search className="text-zinc-600 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No research history yet</h3>
          <p className="text-zinc-500 max-w-md mb-8">
            Start discovering problems by running your first search
          </p>
          <button
            onClick={onNavigateToDiscover || (() => window.location.href = '/')}
            className="px-6 py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-400 transition-colors"
          >
            Start Researching
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {searches.map((search) => (
            <div
              key={search.id}
              onClick={() => setSelectedSearch(search)}
              className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-green-500/30 hover:bg-zinc-900/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">
                    {search.topic}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(search.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={14} />
                      {search.results.length} problems
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-green-500/10 transition-colors">
                  <ExternalLink size={18} className="text-zinc-500 group-hover:text-green-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
