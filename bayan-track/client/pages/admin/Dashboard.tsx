import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, LogOut, LayoutDashboard, Menu, Bell, Settings } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
          <div>
            <h1 className="font-bold text-sm">Admin Panel</h1>
            <p className="text-[10px] text-slate-400">Mambog II</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-slate-800 text-white text-sm font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <Users size={18} /> Residents
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <FileText size={18} /> Reports
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <Bell size={18} /> Announcements
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-slate-800 transition text-sm font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Reveal>
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Welcome, Admin</span>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
              <Users size={16} />
            </div>
          </div>
        </header>
        </Reveal>
        
        <Reveal delay={0.4}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Residents</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">1,245</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-4 font-medium flex items-center gap-1">
              +12% <span className="text-slate-400">from last month</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Reports</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">8</h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <FileText size={20} />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-4 font-medium">
              Requires attention
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Announcements</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">24</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Bell size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 font-medium">
              Last posted 2 hours ago
            </p>
          </div>
        </div>
        </Reveal>
      </main>
    </div>
  );
}