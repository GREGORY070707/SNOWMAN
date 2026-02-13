import React, { useState } from 'react';
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '900px',
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
            color: '#71717a',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#fff',
            marginBottom: '12px'
          }}>
            Upgrade to Pro
          </h2>
          <p style={{ color: '#71717a', fontSize: '16px' }}>
            Unlock unlimited searches and advanced features
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Free Plan */}
          <div style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '8px'
            }}>
              Free
            </h3>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#fff'
              }}>
                ₹0
              </span>
              <span style={{ color: '#71717a', fontSize: '16px' }}>/one-time</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Feature text="4 research credits" />
              <Feature text="Basic problem analysis" />
              <Feature text="Community support" />
              <Feature text="Search history (7 days)" />
            </div>

            <button
              disabled
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#27272a',
                color: '#71717a',
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
            backgroundColor: '#0d0d0d',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '32px',
            position: 'relative'
          }}>
            {/* Most Popular badge */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#6366f1',
              color: '#fff',
              padding: '4px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Most Popular
            </div>

            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '8px'
            }}>
              Pro
            </h3>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#10b981'
              }}>
                ₹99
              </span>
              <span style={{ color: '#71717a', fontSize: '16px' }}>/one-time</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
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
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#000',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={20} fill="#000" />
              Upgrade to Pro
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          color: '#52525b', 
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Secure payment powered by Razorpay
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
    marginBottom: '12px'
  }}>
    <Check 
      size={20} 
      style={{ 
        color: highlighted ? '#10b981' : '#71717a',
        flexShrink: 0
      }} 
    />
    <span style={{ 
      color: highlighted ? '#e5e5e5' : '#71717a',
      fontSize: '14px'
    }}>
      {text}
    </span>
  </div>
);
