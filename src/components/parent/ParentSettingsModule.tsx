import React, { useState, useEffect } from 'react';
import { LinkedChild } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { PRESET_PALETTES } from '../../config/palettes';
import { ThemePalette } from '../../types/theme';
import {
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Palette,
  Globe,
  Save,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface ParentSettingsModuleProps {
  childrenList: LinkedChild[];
}

interface ParentSettingsData {
  displayName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  weeklyDigest: boolean;
  language: string;
}

const STORAGE_KEY_PARENT_SETTINGS = 'schlar_parent_settings_v1';

export const ParentSettingsModule: React.FC<ParentSettingsModuleProps> = ({
  childrenList,
}) => {
  const { activePalette, selectPalette } = useTheme();

  const [settings, setSettings] = useState<ParentSettingsData>({
    displayName: 'Mrs. Li Chen',
    email: 'li.chen@innovate.org',
    phone: '+91 98450 23488',
    address: 'Flat 402, Prestige Palms, Indiranagar, Bengaluru, Karnataka 560038',
    emergencyContact: 'Mr. David Chen (Spouse)',
    emergencyPhone: '+91 98450 23489',
    emailAlerts: true,
    smsAlerts: true,
    weeklyDigest: true,
    language: 'English (India)',
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PARENT_SETTINGS);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse parent settings', e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_PARENT_SETTINGS, JSON.stringify(settings));
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch (err) {
      console.warn('Failed to save parent settings', err);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color: 'var(--color-secondary)' }}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Account & Preferences</span>
          </div>
          <h1 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Profile & Settings
          </h1>
          <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            Manage contact info, alerts, and theme palette.
          </p>
        </div>

        {savedFeedback && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-3.5">
        {/* Guardian Profile Information Card */}
        <div
          className="p-4 rounded-xl border shadow-xs transition-colors space-y-3.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              <h3 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                Guardian Contact Details
              </h3>
            </div>
            <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Primary</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div>
              <label className="font-semibold block mb-1">Guardian Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Registered Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Primary Mobile Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Residential Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>

          <div className="pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <label className="font-semibold block mb-1">Emergency Secondary Contact</label>
              <input
                type="text"
                value={settings.emergencyContact}
                onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={settings.emergencyPhone}
                onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>

          <div
            className="p-3 rounded-xl border bg-black/[0.015] dark:bg-white/[0.015] flex items-center justify-between text-[11px] text-slate-500"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span>Linked Student Profiles: {childrenList.map((c) => c.name).join(', ')}</span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Official Student Records Protected</span>
            </span>
          </div>
        </div>

        {/* Notifications & Communications Preferences */}
        <div
          className="p-4 rounded-xl border shadow-xs transition-colors space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 pb-2.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <Bell className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
            <h3 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
              Notifications & Alerts
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <div className="pr-2">
                <span className="font-bold block text-xs" style={{ color: 'var(--color-text)' }}>
                  Email Circulars & Notices
                </span>
                <span className="text-[10px] text-slate-500">
                  School announcements and schedules.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                className="rounded shrink-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <div className="pr-2">
                <span className="font-bold block text-xs" style={{ color: 'var(--color-text)' }}>
                  SMS Urgent Broadcasts
                </span>
                <span className="text-[10px] text-slate-500">
                  Urgent closures and emergency alerts.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.smsAlerts}
                onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                className="rounded shrink-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <div className="pr-2">
                <span className="font-bold block text-xs" style={{ color: 'var(--color-text)' }}>
                  Weekly Homework Digest
                </span>
                <span className="text-[10px] text-slate-500">
                  Weekly summary of tests & tasks.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                className="rounded shrink-0"
              />
            </label>
          </div>
        </div>

        {/* Theme Shortcut */}
        <div
          className="p-4 rounded-xl border shadow-xs transition-colors space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
              <h3 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                Theme Appearance
              </h3>
            </div>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--color-secondary)' }}>
              {activePalette.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_PALETTES.map((pal: ThemePalette) => {
              const isSelected = activePalette.id === pal.id;
              return (
                <button
                  type="button"
                  key={pal.id}
                  onClick={() => selectPalette(pal.id)}
                  className={`p-2 rounded-lg border text-left transition-all text-xs ${
                    isSelected ? 'ring-2 shadow-xs' : 'hover:opacity-85'
                  }`}
                  style={{
                    backgroundColor: pal.tokens.surface,
                    borderColor: isSelected ? pal.tokens.primary : 'var(--color-border)',
                    // @ts-ignore
                    '--tw-ring-color': pal.tokens.primary,
                  }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.tokens.primary }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.tokens.secondary }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.tokens.accent }} />
                  </div>
                  <span className="font-bold text-[10px] truncate block text-slate-900 dark:text-white">
                    {pal.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-1">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Save className="w-4 h-4" />
            <span>Save Account Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
