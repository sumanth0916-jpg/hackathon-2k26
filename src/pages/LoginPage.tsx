import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithDemoUser } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoSignIn = (persona: 'sarah' | 'alex' | 'admin') => {
    signInWithDemoUser(persona);
    showToast(
      'Signed In Successfully',
      `Welcome to LostX.ai as ${persona === 'admin' ? 'Campus Safety Admin' : persona === 'sarah' ? 'Sarah Chen' : 'Alex Rivera'}`,
      'success'
    );
    navigate(from, { replace: true });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      showToast('Signed In with Google', 'Welcome to LostX.ai.', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.warn('Google sign in error, fallback to demo:', err);
      handleDemoSignIn('sarah');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Fast mock login for campus email
    signInWithDemoUser('sarah');
    showToast('Signed In', `Authenticated as ${email}`, 'success');
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl ai-gradient flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">LostX.ai</h1>
        <p className="text-xs text-slate-500">
          Sign in with your university account to submit and claim items.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Google One-Click CTA */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400">
            Or Demo Personas (Instant)
          </span>
        </div>

        {/* Hackathon Judge Demo Switcher */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDemoSignIn('sarah')}
            className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 text-left text-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="Sarah"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-slate-900 block">Sarah Chen (Student)</span>
                <span className="text-[10px] text-slate-500">Lost Black Lenovo Backpack</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoSignIn('alex')}
            className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-left text-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100"
                alt="Alex"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-slate-900 block">Alex Rivera (Student)</span>
                <span className="text-[10px] text-slate-500">Lost Campus ID Badge</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoSignIn('admin')}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Campus Safety Admin</span>
                <span className="text-[10px] text-slate-500">Full Moderation Controls</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Campus Email Form */}
        <form onSubmit={handleEmailSubmit} className="pt-2 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@campus.edu"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl ai-gradient text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 transition"
          >
            Sign In with Campus Email
          </button>
        </form>
      </div>
    </div>
  );
};
