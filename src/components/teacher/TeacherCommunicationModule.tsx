import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Bell,
  MessageSquare,
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Send,
  Users,
  Info,
  Clock,
} from 'lucide-react';
import { SchoolAnnouncement } from '../../types/school';

interface TeacherCommunicationModuleProps {
  initialSubTab?: string;
}

export const TeacherCommunicationModule: React.FC<TeacherCommunicationModuleProps> = ({
  initialSubTab = 'teacher-announcements',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);

  const { announcements, sections, addAuditLog } = useSchoolData();

  // Ms. Sarah Henderson assigned sections: 8-A, 9-B, 10-A
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Class notices state (local demo)
  const [classNotices, setClassNotices] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
      sectionName: string;
      date: string;
      status: 'published' | 'draft';
    }>
  >([
    {
      id: 'not-01',
      title: 'Quadratic Equations Practice Problem Set Reminder',
      content: 'Please ensure questions 1 to 15 from Chapter 4 are completed in exercise notebooks before Friday class.',
      sectionName: 'Grade 9-B',
      date: '2026-10-18',
      status: 'published',
    },
    {
      id: 'not-02',
      title: 'Lab 204 Compass & Geometry Box Required',
      content: 'Bring your geometry instruments tomorrow for demonstration period 3.',
      sectionName: 'Grade 10-A',
      date: '2026-10-17',
      status: 'published',
    },
  ]);

  // Notice modal
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeSection, setNoticeSection] = useState(mySections[0]?.name || 'Grade 9-B');
  const [noticeContent, setNoticeContent] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Messages state (local faculty-parent simulated thread)
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'David Mitchell (Father of Emily Mitchell, 9-B)',
      time: 'Yesterday 04:15 PM',
      text: 'Good afternoon Ms. Henderson, Emily mentioned she was having difficulty with problem 12 on parabola intercepts. Could she attend the Thursday tutorial?',
      replied: true,
      reply: 'Good afternoon Mr. Mitchell. Absolutely, I have added Emily to the Thursday Period 5 clinic.',
    },
    {
      id: 'msg-2',
      sender: 'Dr. Arthur Sterling (Vice Principal)',
      time: 'Oct 17 09:30 AM',
      text: 'Please review the midterm syllabus pacing indicators for Grade 10-A before our Academic Council meeting.',
      replied: true,
      reply: 'Syllabus indicators updated and sign-off requested.',
    },
  ]);
  const [replyInput, setReplyInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice = {
      id: `not-${Date.now()}`,
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      sectionName: noticeSection,
      date: '2026-10-19',
      status: 'published' as const,
    };

    setClassNotices([newNotice, ...classNotices]);
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Class Notice Published',
      module: 'Communication / Notices',
      details: `Posted "${newNotice.title}" for ${newNotice.sectionName}`,
      severity: 'info',
    });

    setToastMessage(`Class notice posted for ${newNotice.sectionName}.`);
    setTimeout(() => setToastMessage(null), 3000);
    setNoticeModalOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleSendReply = (msgId: string) => {
    if (!replyInput.trim()) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, replied: true, reply: replyInput.trim() } : m
      )
    );
    setReplyingToId(null);
    setReplyInput('');
    setToastMessage('Reply sent (local demo communication).');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SUBTABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              School Communications
            </span>
            <span className="text-xs text-slate-500">Bulletins & Classroom Notices</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Communication & Notices</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional announcements, cohort advisory bulletins, and parent correspondence.
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs shrink-0 overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('teacher-announcements')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-announcements'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            School Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-class-notices')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-class-notices'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Class Notices ({classNotices.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-messages')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-messages'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Classroom Messages ({messages.length})
          </button>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUBTAB 1: SCHOOL ANNOUNCEMENTS */}
      {activeTab === 'teacher-announcements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{ann.publishDate}</span>
                  </div>

                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                  <span>Audience: {ann.targetAudience}</span>
                  <span className="font-semibold text-emerald-600">Active Circular</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CLASS NOTICES */}
      {activeTab === 'teacher-class-notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Assigned Cohort Class Notices
            </h3>
            <button
              onClick={() => setNoticeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Draft Class Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {classNotices.map((not) => (
              <div
                key={not.id}
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {not.sectionName}
                    </span>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                      {not.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{not.date}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{not.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MESSAGES */}
      {activeTab === 'teacher-messages' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              Classroom communication simulator. External SMS and real parent email notifications are not active in this frontend prototype.
            </span>
          </div>

          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                    {m.sender}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{m.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                  "{m.text}"
                </p>

                {m.replied && m.reply && (
                  <div className="pl-4 border-l-2 border-indigo-500 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Your Response:</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{m.reply}</p>
                  </div>
                )}

                {replyingToId === m.id && (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Type your response to the parent inquiry..."
                      className="w-full p-2.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg border"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(m.id)}
                        className="px-3.5 py-1 text-xs font-semibold text-white rounded-lg shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}

                {!m.replied && replyingToId !== m.id && (
                  <div className="pt-2">
                    <button
                      onClick={() => setReplyingToId(m.id)}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply to message</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CLASS NOTICE MODAL */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handlePostNotice}
            className="w-full max-w-md p-6 rounded-2xl border shadow-xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="border-b pb-3">
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Draft Class Notice
              </h3>
              <p className="text-xs text-slate-500">Post an advisory note to your assigned section.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Notice Heading
                </label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Bring Protractor & Compass on Thursday"
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Target Cohort Section
                </label>
                <select
                  value={noticeSection}
                  onChange={(e) => setNoticeSection(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {mySections.map((sec) => (
                    <option key={sec.id} value={sec.name}>
                      {sec.name} ({sec.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Notice Content
                </label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="State the reminder, homework deadline, or required classroom supplies..."
                  className="w-full p-2.5 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setNoticeModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Post Class Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
