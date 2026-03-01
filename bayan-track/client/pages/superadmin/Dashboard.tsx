import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Settings, LogOut, Database, UserPlus, Activity, Lock } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">SA</div>
          <div>
            <h1 className="font-bold text-sm">Super Admin</h1>
            <p className="text-[10px] text-slate-400">Control Center</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 text-sm font-medium">
            <Shield size={18} /> Overview
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <UserPlus size={18} /> Manage Admins
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <Database size={18} /> System Logs
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <Settings size={18} /> Global Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-slate-800 transition text-sm font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Reveal>
        <header className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-indigo-400" /> System Status
          </h2>
          <p className="text-slate-400 text-sm mt-1">Monitoring active sessions and system health.</p>
        </header>
        </Reveal>
        
        <Reveal delay={0.4}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Admins</p>
                <h3 className="text-3xl font-bold text-white mt-2">4</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <UserPlus size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Across all departments</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Database Status</p>
                <h3 className="text-3xl font-bold text-emerald-400 mt-2">Healthy</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Database size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Last backup: 1 hour ago</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Security Level</p>
                <h3 className="text-3xl font-bold text-blue-400 mt-2">High</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Lock size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">2FA Enforced for Admins</p>
          </div>
        </div>
        </Reveal>
      </main>
    </div>
  );
}