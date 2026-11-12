import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';

interface ParentAnnouncementsModuleProps {
  selectedChildName: string;
}

const STORAGE_KEY_READ_ANNOUNCEMENTS = 'schlar_parent_read_announcements_v1';

export const ParentAnnouncementsModule: React.FC<ParentAnnouncementsModuleProps> = ({
  selectedChildName,
}) => {
  const { announcements } = useSchoolData();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readIds, setReadIds] = useState<string[]>([]);

  // Load read status from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_READ_ANNOUNCEMENTS);
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load read announcements', e);
    }
  }, []);

  const toggleRead = (id: string) => {
    const next = readIds.includes(id) ? readIds.filter((x) => x !== id) : [...readIds, id];
    setReadIds(next);
    try {
      localStorage.setItem(STORAGE_KEY_READ_ANNOUNCEMENTS, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist read state', e);
    }
  };

  const markAllRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY_READ_ANNOUNCEMENTS, JSON.stringify(allIds));
    } catch (e) {
      console.warn('Failed to persist read state', e);
    }
  };

  const parentAnnouncements = announcements.filter(
    (a) => a.targetAudience === 'parents' || a.targetAudience === 'all'
  );

  const filteredAnnouncements = parentAnnouncements.filter((ann) => {
    if (filterCategory !== 'all' && ann.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (
      searchQuery &&
      !ann.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ann.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const unreadCount = parentAnnouncements.filter((a) => !readIds.includes(a.id)).length;

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Overview Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              School Communications
            </span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
              Announcements & Circulars
            </span>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border hover:bg-black/5 flex items-center gap-1"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <Check className="w-3 h-3" />
              <span>Mark Read ({unreadCount})</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs no-scrollbar">
          {(['all', 'Academic', 'Event', 'Administrative', 'Examination'] as const).map((cat) => {
            const isSelected = filterCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all border whitespace-nowrap ${
                  isSelected ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
                }`}
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {cat === 'all' ? 'All Bulletins' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter announcements by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {/* Announcements List Feed */}
      <div className="space-y-2">
        {filteredAnnouncements.length === 0 ? (
          <div
            className="p-6 rounded-xl border text-center space-y-2 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <Bell className="w-7 h-7 text-slate-400 mx-auto" />
            <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
              No circulars found
            </span>
            <p className="text-slate-500 text-[11px]">
              No school bulletins matched the selected filter.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRead = readIds.includes(ann.id);
            const isUrgent = ann.priority === 'urgent';
            const isImportant = ann.priority === 'important';

            return (
              <div
                key={ann.id}
                onClick={() => toggleRead(ann.id)}
                className="p-3.5 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all space-y-2 shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: isUrgent
                    ? 'rgba(239, 68, 68, 0.4)'
                    : isImportant
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                      )}
                      <span className="font-bold text-xs truncate" style={{ color: 'var(--color-text)' }}>
                        {ann.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {ann.authorStaffName} ({ann.authorRole}) · {ann.publishDate}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-800'
                        : isImportant
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {ann.priority}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <span>Audience: {ann.targetAudience}</span>
                  <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {isRead ? 'Tap to mark unread' : 'Tap to mark read'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
