import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, Sparkles, User } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const MobileBottomNav: React.FC = () => {
  const { unreadCount } = useNotifications();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Explore', path: '/search', icon: <Search className="w-5 h-5" /> },
    {
      name: 'Report',
      path: '/report',
      icon: (
        <div className="w-10 h-10 -mt-4 rounded-full ai-gradient text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <PlusCircle className="w-5 h-5" />
        </div>
      ),
      isFab: true,
    },
    {
      name: 'AI Matches',
      path: '/matches',
      icon: (
        <div className="relative">
          <Sparkles className="w-5 h-5 text-purple-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-600" />
          )}
        </div>
      ),
    },
    { name: 'Dashboard', path: '/dashboard', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200 py-1 px-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                item.isFab
                  ? ''
                  : isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            {item.icon}
            {!item.isFab && (
              <span className="text-[10px] mt-0.5">{item.name}</span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
