import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface UpgradeButtonProps {
  userProfile: UserProfile;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({ userProfile }) => {
  const handleUpgrade = () => {
    // Open Razorpay payment link in new tab
    window.open('https://rzp.io/rzp/RbSHdYgS', '_blank');
  };

  // Don't show button if user is already Pro
  if (userProfile.is_pro) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-green-500 fill-green-500" />
        <h3 className="text-sm font-bold text-white">Upgrade to Pro</h3>
      </div>
      <p className="text-xs text-zinc-400 mb-3">
        Get unlimited research + 1000 credits for just ₹99 (one-time)
      </p>
      <button
        onClick={handleUpgrade}
        className="w-full px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
      >
        Unlock Pro for ₹99
        <ExternalLink size={14} />
      </button>
      <p className="text-[10px] text-zinc-500 mt-2 text-center">
        Secure payment via Razorpay
      </p>
    </div>
  );
};
