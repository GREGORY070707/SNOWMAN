
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import SearchInput from './components/SearchInput';
import ProblemCard from './components/ProblemCard';
import ProgressIndicator from './components/ProgressIndicator';
import { Auth } from './components/Auth';
import { ResearchEngine } from './services/researchEngine';
import { Problem, ResearchStatus, UserProfile } from './types';
import { supabase } from './lib/supabase';
import { Target, ArrowLeft, Download, Share2, Info, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<ResearchStatus>(ResearchStatus.IDLE);
  const [currentStep, setCurrentStep] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const engine = new ResearchEngine();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setUserProfile(data);
    }
  };

  const handleSearch = useCallback(async (newTopic: string) => {
    if (!userProfile) return;

    // Check Pro status first - Pro users bypass credit check
    if (!userProfile.is_pro && userProfile.credits <= 0) {
      setError('You have run out of research credits. Please upgrade to Pro for unlimited searches.');
      setStatus(ResearchStatus.FAILED);
      return;
    }

    setTopic(newTopic);
    setStatus(ResearchStatus.PLANNING);
    setError(null);
    setProblems([]);

    try {
      const results = await engine.run(newTopic, (step) => {
        setCurrentStep(step);
        if (step.includes('Web')) setStatus(ResearchStatus.SEARCHING);
        if (step.includes('Pattern')) setStatus(ResearchStatus.ANALYZING);
      });

      // Only deduct credits for non-pro users
      if (!userProfile.is_pro) {
        const { error: creditError } = await supabase
          .from('profiles')
          .update({ credits: userProfile.credits - 1 })
          .eq('id', userProfile.id);

        if (!creditError) {
          setUserProfile({ ...userProfile, credits: userProfile.credits - 1 });
        }
      }
      
      // Save search results
      await supabase.from('searches').insert({
        user_id: userProfile.id,
        topic: newTopic,
        results: results
      });

      setProblems(results);
      setStatus(ResearchStatus.COMPLETED);
    } catch (err) {
      setError('Oops! Research execution failed. Please check your API configuration or try a different topic.');
      setStatus(ResearchStatus.FAILED);
    }
  }, [userProfile]);

  const reset = () => {
    setStatus(ResearchStatus.IDLE);
    setProblems([]);
    setTopic('');
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="text-green-500 animate-spin" size={40} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
        <Auth />
      </div>
    );
  }

  return (
    <Layout userProfile={userProfile}>
      {status === ResearchStatus.IDLE && (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <SearchInput onSearch={handleSearch} isLoading={false} />
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <FeatureItem 
              icon={<Target className="text-green-500" />}
              title="Validated Complaints"
              description="We scan Reddit, IndieHackers, and niche forums for actual 'I hate' and 'why is there no' phrases."
            />
            <FeatureItem 
              icon={<Download className="text-blue-500" />}
              title="Receipt Attribution"
              description="Every problem comes with direct links to the source threads so you can read the context yourself."
            />
            <FeatureItem 
              icon={<Share2 className="text-purple-500" />}
              title="Signal Scoring"
              description="Complex AI weighting on Frequency, Pain, and Monetization signals helps you pick the right bet."
            />
          </div>
        </div>
      )}

      {(status === ResearchStatus.PLANNING || 
        status === ResearchStatus.SEARCHING || 
        status === ResearchStatus.ANALYZING) && (
        <ProgressIndicator currentStep={currentStep} />
      )}

      {status === ResearchStatus.FAILED && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Info className="text-red-500 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Research Stalled</h2>
          <p className="text-zinc-500 max-w-md mb-8">{error}</p>
          <button 
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {status === ResearchStatus.COMPLETED && (
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-6"
              >
                <ArrowLeft size={16} /> Back to Search
              </button>
              <h2 className="text-3xl font-black text-white mb-2">
                Validated Problems in <span className="text-green-500">"{topic}"</span>
              </h2>
              <p className="text-zinc-500 max-w-xl">
                We've analyzed 40+ data points across 5 platforms. Here are the top {problems.length} signals based on pain intensity and frequency.
              </p>
            </div>
            <div className="flex gap-3">
               <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                 <Download size={18} /> Export CSV
               </button>
               <button className="px-5 py-2.5 rounded-xl bg-green-500 text-black text-sm font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20">
                 Save to Workspace
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 text-center">
             <h3 className="text-xl font-bold text-white mb-2">Want to track this space?</h3>
             <p className="text-zinc-500 mb-6 max-w-md mx-auto">Get real-time alerts when new complaints about {topic} hit the web.</p>
             <button className="px-8 py-3 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-colors">
               Enable Auto-Monitoring
             </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl glass hover:border-white/10 transition-all border border-transparent">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
    <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
  </div>
);

export default App;
