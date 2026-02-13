import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown, Flame, Users, Clock, ArrowRight } from 'lucide-react';

interface TrendData {
  topic: string;
  searchCount: number;
  lastSearched: string;
  trend: 'up' | 'down' | 'stable';
}

export const MarketTrends: React.FC = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    fetchTrends();
  }, [timeRange]);

  const fetchTrends = async () => {
    setLoading(true);
    
    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Fetch searches from all users in the time range
    const { data, error } = await supabase
      .from('searches')
      .select('topic, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Aggregate by topic
      const topicMap = new Map<string, { count: number; lastSearched: string }>();
      
      data.forEach((search) => {
        const topic = search.topic.toLowerCase().trim();
        const existing = topicMap.get(topic);
        
        if (existing) {
          topicMap.set(topic, {
            count: existing.count + 1,
            lastSearched: search.created_at > existing.lastSearched ? search.created_at : existing.lastSearched
          });
        } else {
          topicMap.set(topic, {
            count: 1,
            lastSearched: search.created_at
          });
        }
      });

      // Convert to array and sort by count
      const trendsArray: TrendData[] = Array.from(topicMap.entries())
        .map(([topic, data]) => ({
          topic,
          searchCount: data.count,
          lastSearched: data.lastSearched,
          trend: data.count > 3 ? 'up' : data.count > 1 ? 'stable' : 'down'
        }))
        .sort((a, b) => b.searchCount - a.searchCount)
        .slice(0, 20); // Top 20 trends

      setTrends(trendsArray);
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-3">
          Market Trends
        </h1>
        <p className="text-zinc-400 text-lg">
          See what problems other users are researching across the platform
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-8">
        {(['24h', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              timeRange === range
                ? 'bg-green-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
          </button>
        ))}
      </div>

      {trends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 rounded-full bg-zinc-900/50 border border-white/5 mb-6">
            <TrendingUp className="text-zinc-600 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No trends yet</h3>
          <p className="text-zinc-500 max-w-md">
            Be the first to discover problems and set the trends
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div
              key={trend.topic}
              className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-green-500/30 hover:bg-zinc-900/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500/30' :
                    index === 1 ? 'bg-zinc-400/20 text-zinc-400 border-2 border-zinc-400/30' :
                    index === 2 ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500/30' :
                    'bg-white/5 text-zinc-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-500 transition-colors capitalize">
                    {trend.topic}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {trend.searchCount} {trend.searchCount === 1 ? 'search' : 'searches'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(trend.lastSearched)}
                    </span>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {trend.trend === 'up' && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                      <Flame size={14} className="text-green-500 fill-green-500" />
                      <span className="text-xs font-bold text-green-500">Hot</span>
                    </div>
                  )}
                  {trend.trend === 'down' && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/20">
                      <TrendingDown size={14} className="text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-500">Cool</span>
                    </div>
                  )}
                  <ArrowRight size={18} className="text-zinc-600 group-hover:text-green-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <h3 className="text-lg font-bold text-white mb-2">How Market Trends Work</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Market Trends shows you what problems other SignalFinder users are researching. 
          The more searches a topic gets, the higher it ranks. This helps you identify hot 
          markets and validate your ideas by seeing what others are exploring.
        </p>
      </div>
    </div>
  );
};
