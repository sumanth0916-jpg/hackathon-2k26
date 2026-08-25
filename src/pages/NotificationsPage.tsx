import React from 'react';
import { Link } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { BellRing, CheckCheck, Siren, HeartHandshake, ShieldCheck, Info, ArrowRight } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsAsRead, currentUser } = useLifeLink();

  const userNotifs = notifications.filter(
    (n) => n.user_id === currentUser?.id || n.user_id === 'broadcast' || !currentUser
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <Siren className="size-4 text-rose-600 animate-bounce" />;
      case 'offer':
      case 'consent':
        return <HeartHandshake className="size-4 text-emerald-600" />;
      case 'system':
        return <ShieldCheck className="size-4 text-teal-600" />;
      default:
        return <Info className="size-4 text-blue-600" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">Notifications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Live updates for matches, donor responses, and emergency proximity alerts.
          </p>
        </div>

        {userNotifs.some((n) => !n.read) && (
          <button
            onClick={() => markNotificationsAsRead()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <CheckCheck className="size-3.5 text-slate-500" />
            Mark all read
          </button>
        )}
      </div>

      {userNotifs.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <BellRing className="size-10 text-muted-foreground mx-auto" />
          <h3 className="font-display text-base font-bold mt-3">You're all caught up</h3>
          <p className="text-xs text-muted-foreground mt-1">
            New matches, offers, and nearby emergencies will appear here instantly.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {userNotifs.map((notif) => (
            <li
              key={notif.id}
              className={`card-surface p-4 transition-all ${
                !notif.read
                  ? 'border-primary/40 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'bg-card opacity-90'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-sm truncate">{notif.title}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <div className="mt-2.5">
                      <Link
                        to={notif.link}
                        onClick={() => markNotificationsAsRead(notif.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        View case <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
