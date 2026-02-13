import React, { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const VerifyPayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const handleVerify = async () => {
    if (!paymentId.trim()) {
      setMessage('Please enter your Payment ID from Razorpay');
      return;
    }

    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setMessage('Please log in first');
        setLoading(false);
        return;
      }

      // Call Supabase Edge Function to verify payment
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: { paymentId: paymentId.trim() },
      });

      if (error) {
        console.error('Verification error:', error);
        setMessage(error.message || 'Payment verification failed. Please check your Payment ID.');
        setLoading(false);
        return;
      }

      if (data.success) {
        setMessage('✅ Payment verified! Your Pro upgrade is active. Refreshing...');
        setIsSuccess(true);
        // Reload page after 2 seconds to show updated UI
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage(data.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setMessage(err.message || 'Error verifying payment. Please try again.');
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
        After completing payment on Razorpay, enter your Payment ID below to activate Pro
      </p>
      
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle size={14} />
          Verify Payment
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Enter Payment ID (e.g., pay_xxxxx)"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={loading || !paymentId.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Verify
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setPaymentId('');
                setMessage('');
              }}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
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
