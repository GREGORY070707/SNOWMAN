
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSearch(topic);
    }
  };

  const suggestions = [
    "AI for real estate agents",
    "Shopify app pain points",
    "Productivity for remote managers",
    "Tools for boutique gym owners"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Find Your Next <span className="text-green-500">Big Problem.</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed">
          Analyze real complaints, Reddit threads, and G2 reviews across any niche in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group mb-8">
        <div className="absolute inset-0 bg-green-500/10 blur-2xl group-focus-within:bg-green-500/20 transition-all rounded-full" />
        <div className="relative flex items-center p-2 rounded-2xl glass border border-white/10 group-focus-within:border-green-500/40 transition-all shadow-2xl">
          <div className="pl-4 text-zinc-500">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Automation struggles for small gym owners'"
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg text-white placeholder:text-zinc-400 font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="px-6 py-4 rounded-xl bg-green-500 text-black font-bold flex items-center gap-2 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/20"
          >
            {isLoading ? 'Analyzing...' : (
              <>
                <Sparkles size={18} />
                Find Opportunities
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mr-2 self-center">Try searching:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;
