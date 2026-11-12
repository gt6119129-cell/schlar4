import React from 'react';
import { DemoNotification } from '../../data/mockData';
import { X, Check, CheckCheck, Bell, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DemoNotification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  currentRoleName: string;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onToggleRead,
  onMarkAllRead,
  currentRoleName,
}) => {
  if (!isOpen) return null;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm h-full flex flex-col justify-between shadow-2xl border-l transition-colors animate-in slide-in-from-right duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between gap-3 shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Notifications
              </h3>
              <span className="text-[11px] text-slate-500">
                {currentRoleName} · {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold flex items-center gap-1 p-1 hover:underline text-slate-600 dark:text-slate-300"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:opacity-75"
              aria-label="Close notification panel"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleRead(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  item.read
                    ? 'opacity-70 bg-transparent'
                    : 'shadow-xs'
                }`}
                style={{
                  backgroundColor: item.read ? 'transparent' : 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`text-xs ${item.read ? 'font-semibold' : 'font-extrabold'}`}
                    style={{ color: 'var(--color-text)' }}
                  >
                    {item.title}
                  </span>
                  {!item.read && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                </div>

                <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {item.message}
                </p>

                <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                  <span>{item.timestamp}</span>
                  <span className="font-semibold">{item.read ? 'Read' : 'Mark as read'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 space-y-1">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
              <p>No new notifications for {currentRoleName}.</p>
            </div>
          )}
        </div>

        {/* Honest Demo Notification Footer */}
        <div
          className="p-3 border-t text-[11px] text-slate-400 flex items-center justify-between shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span>Deterministic Demo Events</span>
          <span>SCHLAR Dispatch</span>
        </div>
      </div>
    </div>
  );
};
