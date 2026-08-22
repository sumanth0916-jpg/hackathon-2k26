import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { User, Mail, Shield, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, signInWithDemoUser, signOut } = useAuth();
  const { resetDemoData, isResetting } = useDemo();
  const { showToast } = useNotifications();

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={currentUser.displayName || 'Profile'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.displayName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition self-start sm:self-auto"
        >
          Sign Out
        </button>
      </div>

      {/* Account Info Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Student Campus Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-1">User Identifier (UID)</span>
            <span className="font-mono text-slate-800 font-bold">{currentUser.uid}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-1">Campus Verification</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active University Account
            </span>
          </div>
        </div>

        {/* Demo Personas Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 mb-3">
            Quick Persona Switcher (Judge Mode)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => signInWithDemoUser('sarah')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                currentUser.uid === 'user-sarah'
                  ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              Sarah Chen
              <span className="block text-[10px] text-slate-500 font-normal">Lost Backpack</span>
            </button>

            <button
              onClick={() => signInWithDemoUser('alex')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                currentUser.uid === 'user-alex'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              Alex Rivera
              <span className="block text-[10px] text-slate-500 font-normal">Lost Student ID</span>
            </button>

            <button
              onClick={() => signInWithDemoUser('admin')}
              className={`p-3 rounded-xl border text-left text-xs transition ${
                currentUser.uid === 'user-admin'
                  ? 'border-slate-900 bg-slate-900 text-white font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              Safety Admin
              <span className="block text-[10px] opacity-70 font-normal">Moderator Access</span>
            </button>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Pristine Demo Dataset</h4>
            <p className="text-[11px] text-slate-500">Restore the 12 campus lost & found demo records</p>
          </div>

          <button
            onClick={resetDemoData}
            disabled={isResetting}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
