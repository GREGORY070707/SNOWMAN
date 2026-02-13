
import React, { useState, useRef, useEffect } from 'react';
import { Search, History, Settings, HelpCircle, BarChart3, Target, LogOut, Zap, User, CreditCard } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { UpgradeButton } from './UpgradeButton';
import { VerifyPayment } from './VerifyPayment';
import { PricingModal } from './PricingModal';

interface LayoutProps {
  children: React.ReactNode;
  userProfile?: UserProfile | null;
  onNavigate?: (view: 'discover' | 'past-research' | 'market-trends') => void;
  currentView?: 'discover' | 'past-research' | 'market-trends';
}

const Layout: React.FC<LayoutProps> = ({ children, userProfile, onNavigate, currentView = 'discover' }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
            <Target className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">SignalFinder</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            icon={<Search size={20} />} 
            label="Discover" 
            active={currentView === 'discover'}
            onClick={() => onNavigate?.('discover')}
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Past Research"
            active={currentView === 'past-research'}
            onClick={() => onNavigate?.('past-research')}
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Market Trends"
            active={currentView === 'market-trends'}
            onClick={() => onNavigate?.('market-trends')}
          />
        </nav>

        {/* Upgrade Section - Show only for non-pro users */}
        {userProfile && !userProfile.is_pro && (
          <div className="space-y-3">
            <UpgradeButton 
              userProfile={userProfile} 
              onOpenModal={() => setIsPricingModalOpen(true)} 
            />
            <VerifyPayment />
          </div>
        )}

        {userProfile && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 border border-white/10 flex items-center justify-center text-white text-sm font-bold">
                {userProfile.first_name?.[0]?.toUpperCase()}{userProfile.last_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userProfile.first_name} {userProfile.last_name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 truncate">{userProfile.email}</span>
                  {userProfile.is_pro && (
                    <span className="px-1.5 py-0.5 rounded-full bg-green-500 text-[8px] font-black text-black">PRO</span>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all text-xs font-bold"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}

        <div className="pt-6 border-t border-white/5 space-y-1">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem icon={<HelpCircle size={20} />} label="Help Center" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-500">Workspace / Research / Discovery</span>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <Zap size={14} className="text-green-500 fill-green-500" />
                <span className="text-xs font-bold text-green-500">{userProfile.credits} Research Credits</span>
              </div>
            )}
             <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors">
              New Project
            </button>
            {userProfile && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 border border-white/10 flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform"
                >
                  {userProfile.first_name?.[0]?.toUpperCase()}{userProfile.last_name?.[0]?.toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                  >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                          {userProfile.first_name?.[0]?.toUpperCase()}{userProfile.last_name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {userProfile.first_name} {userProfile.last_name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <Zap size={12} className="text-green-500 fill-green-500" />
                        <span className="text-xs font-bold text-green-500">{userProfile.credits} Credits Left</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm">
                        <CreditCard size={16} />
                        <span>Billing</span>
                      </button>
                      
                      {!userProfile.is_pro && (
                        <button 
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsPricingModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all text-sm"
                        >
                          <Zap size={16} className="fill-blue-400" />
                          <span>Upgrade to Pro</span>
                        </button>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-sm"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Pricing Modal */}
      {userProfile && (
        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          userProfile={userProfile}
          onUpgradeSuccess={() => {
            // Refresh will happen in the modal
          }}
        />
      )}

      {/* CSS for dropdown animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active 
      ? 'bg-white/5 text-white border border-white/10' 
      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
  }`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default Layout;
