import React from 'react';
import { X, Check, Zap, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile
}) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    // Open Razorpay payment link in new tab
    window.open('https://rzp.io/rzp/RbSHdYgS', '_blank');
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
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5558e3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              Upgrade to Pro
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

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
