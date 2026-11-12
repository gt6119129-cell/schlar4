import React, { useState, useEffect, useRef } from 'react';
import { RoleConfig } from '../../config/roles';
import { usePermissions } from '../../context/PermissionContext';
import { Search, X, ArrowRight, CornerDownLeft, Layers, Shield } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: RoleConfig;
  onSelectNavItem: (navItemId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectNavItem,
}) => {
  const { isNavAllowed } = usePermissions();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter permitted nav items matching query
  const permittedNavItems = currentRole.navItems.filter((item) => isNavAllowed(currentRole.id, item));

  const filteredResults = permittedNavItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.plannedFeatures && item.plannedFeatures.some((f) => f.toLowerCase().includes(q)))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target) {
        onSelectNavItem(target.id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-colors flex flex-col max-h-[82vh]"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div
          className="p-3.5 border-b flex items-center gap-3 shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${currentRole.name} modules, records, and workflows...`}
            className="w-full bg-transparent border-none outline-none text-sm placeholder:opacity-50"
            style={{ color: 'var(--color-text)' }}
            aria-label="Global Search"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 rounded hover:opacity-75" aria-label="Clear query">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          ) : (
            <kbd
              className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border text-slate-400"
              style={{ borderColor: 'var(--color-border)' }}
            >
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Permitted Modules for {currentRole.name}</span>
            <span>{filteredResults.length} Available</span>
          </div>

          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNavItem(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'shadow-xs' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-background)' : 'transparent',
                    borderColor: isSelected ? 'var(--color-border)' : 'transparent',
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {item.label}
                      </span>
                      {item.requiredPermission && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-500">
                          {item.requiredPermission}
                        </span>
                      )}
                    </div>
                    <p className="text-xs line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5" style={{ color: 'var(--color-primary)' }}>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5" />}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                No permitted modules found matching "{query}".
              </p>
              <p>Try searching for overview, attendance, timetable, or records.</p>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div
          className="p-3 border-t text-[11px] flex items-center justify-between text-slate-400 shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-[10px]">SCHLAR RBAC Verified</span>
        </div>
      </div>
    </div>
  );
};
