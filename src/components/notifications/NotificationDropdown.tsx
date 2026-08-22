import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Sparkles, Inbox, CheckCircle2, Clock, Bell, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/time';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_found':
        return <Sparkles className="w-4 h-4 text-purple-600 shrink-0 animate-pulse" />;
      case 'claim_received':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'claim_accepted':
      case 'reunited':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Campus Notifications
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          {notifications.length} alerts
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No new notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              AI match alerts and claims will show up here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                if (n.linkUrl) {
                  navigate(n.linkUrl);
                  onClose();
                }
              }}
              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                !n.read ? 'bg-indigo-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{n.title}</h5>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-4 pt-2 border-t border-slate-100 text-center">
        <button
          onClick={() => {
            navigate('/dashboard');
            onClose();
          }}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
        >
          <span>View All in Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
