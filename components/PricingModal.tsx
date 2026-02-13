import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpgradeSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile,
  onUpgradeSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Razorpay checkout
      const options = {
        key: 'rzp_test_SFO7iX6k8JucVF', // Your Razorpay key
        amount: 9900, // ₹99 in paise
        currency: 'INR',
        name: 'SignalFinder Pro',
        description: 'Lifetime Pro Access',
        image: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
        prefill: {
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          email: userProfile.email,
        },
        theme: {
          color: '#6366f1'
        },
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Update user to Pro in database
          const { supabase } = await import('../lib/supabase');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_pro: true,
              credits: 1000,
              razorpay_payment_link_id: response.razorpay_payment_id
            })
            .eq('id', userProfile.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            setError('Payment successful but failed to activate Pro. Please contact support.');
          } else {
            onUpgradeSuccess();
            onClose();
            window.location.reload(); // Refresh to show Pro status
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '24px',
          maxWidth: '1000px',
          width: '100%',
          padding: '48px',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '24px'
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#fff',
            marginBottom: '12px'
          }}>
            Upgrade to Pro
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Unlock unlimited searches and advanced features
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Free Plan */}
          <div style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '40px 32px',
            position: 'relative'
          }}>
            <h3 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '16px'
            }}>
              Free
            </h3>
            <div style={{ marginBottom: '32px' }}>
              <span style={{ 
                fontSize: '56px', 
                fontWeight: 'bold', 
                color: '#fff'
              }}>
                ₹0
              </span>
              <span style={{ color: '#6b7280', fontSize: '18px' }}>/one-time</span>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <Feature text="4 research credits" />
              <Feature text="Basic problem analysis" />
              <Feature text="Community support" />
              <Feature text="Search history (7 days)" />
            </div>

            <button
              disabled
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                backgroundColor: '#27272a',
                color: '#6b7280',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'not-allowed'
              }}
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{
            backgroundColor: '#1e1b4b',
            border: '2px solid #6366f1',
            borderRadius: '20px',
            padding: '40px 32px',
            position: 'relative'
          }}>
            {/* Most Popular badge */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#6366f1',
              color: '#fff',
              padding: '6px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              Most Popular
            </div>

            <h3 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '16px'
            }}>
              Pro
            </h3>
            <div style={{ marginBottom: '32px' }}>
              <span style={{ 
                fontSize: '56px', 
                fontWeight: 'bold', 
                color: '#fff'
              }}>
                ₹99
              </span>
              <span style={{ color: '#9ca3af', fontSize: '18px' }}>/one-time</span>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <Feature text="Unlimited searches" highlighted />
              <Feature text="Advanced AI analysis" highlighted />
              <Feature text="Priority support" highlighted />
              <Feature text="Unlimited search history" highlighted />
              <Feature text="Export results to CSV" highlighted />
              <Feature text="Early access to new features" highlighted />
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                backgroundColor: loading ? '#4f46e5' : '#6366f1',
                color: '#fff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5558e3')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6366f1')}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                'Upgrade to Pro'
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Secure payment powered by Razorpay • Cancel anytime
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const Feature: React.FC<{ text: string; highlighted?: boolean }> = ({ text, highlighted }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px',
    marginBottom: '16px'
  }}>
    <Check 
      size={20} 
      style={{ 
        color: highlighted ? '#6366f1' : '#6b7280',
        flexShrink: 0
      }} 
    />
    <span style={{ 
      color: highlighted ? '#e5e7eb' : '#9ca3af',
      fontSize: '15px'
    }}>
      {text}
    </span>
  </div>
);
