
import React from 'react';
import { Search, History, Settings, HelpCircle, BarChart3, Target, LogOut, Zap, User } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  userProfile?: UserProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ children, userProfile }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
          <NavItem icon={<Search size={20} />} label="Discover" active />
          <NavItem icon={<History size={20} />} label="Past Research" />
          <NavItem icon={<BarChart3 size={20} />} label="Market Trends" />
        </nav>

        {userProfile && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-500">
                <User size={20} />
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 border border-white/10" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active 
      ? 'bg-white/5 text-white border border-white/10' 
      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
  }`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default Layout;
