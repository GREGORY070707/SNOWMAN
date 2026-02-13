import React, { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const VerifyPayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage('Please log in first');
        setLoading(false);
        return;
      }

      // Refresh profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setMessage('Error checking status. Please try again.');
        setLoading(false);
        return;
      }

      if (profile.is_pro) {
        setMessage('✅ Your Pro upgrade is active! Refreshing...');
        setIsSuccess(true);
        // Reload page after 2 seconds to show updated UI
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage('Payment not yet processed. Please wait a few moments and try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setMessage('Error verifying payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={16} className="text-blue-500" />
        <h3 className="text-sm font-bold text-white">Completed Payment?</h3>
      </div>
      <p className="text-xs text-zinc-400 mb-3">
        After completing payment on Razorpay, click below to activate your Pro status
      </p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <CheckCircle size={14} />
            Verify Payment
          </>
        )}
      </button>
      {message && (
        <div className={`mt-3 p-2 rounded-lg flex items-start gap-2 ${
          isSuccess 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-blue-500/10 border border-blue-500/20'
        }`}>
          {isSuccess ? (
            <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-xs ${isSuccess ? 'text-green-400' : 'text-blue-400'}`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
