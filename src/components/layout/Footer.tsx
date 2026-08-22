import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur pb-20 md:pb-8 pt-10 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg ai-gradient flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">
                LostX<span className="text-purple-600">.ai</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              AI-powered lost & found intelligence for modern campus communities. Photos, descriptions, location, and time reconciled automatically.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Campus verified • Privacy-first</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="hover:text-indigo-600 transition">
                  Browse Public Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-indigo-600 transition">
                  Submit Lost Report
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-indigo-600 transition">
                  Submit Found Report
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-purple-600 transition font-medium">
                  AI Match Live Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Campus Hubs */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Campus Drop-Off Hubs
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Central Library Helpdesk</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>CS Block Admin Atrium</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Student Cafeteria Info Desk</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Main Campus Gate Security</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Disclaimer & Tech Specs */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              AI Hackathon Architecture
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px] mb-2">
              Powered by Google Gemini 2.5 Flash Multimodal Vision, Firebase serverless, and 5-factor weighted similarity analysis.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700">Safety Notice: </span>
              AI results indicate potential matches. Final item handover requires campus claimant verification.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} LostX.ai. Built for Smart Campus Hackathon.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for student reconnection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
