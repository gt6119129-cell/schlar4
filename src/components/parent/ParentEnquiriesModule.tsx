import React, { useState, useEffect } from 'react';
import { LinkedChild } from '../../data/mockData';
import {
  Mail,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  MessageSquare,
  User,
  X,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface ParentEnquiriesModuleProps {
  childrenList: LinkedChild[];
  selectedChild: LinkedChild;
}

export interface ParentEnquiry {
  id: string;
  childId: string;
  childName: string;
  category: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  replies: {
    id: string;
    sender: 'Parent' | 'School Administration' | 'Teacher';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

const STORAGE_KEY_PARENT_ENQUIRIES = 'schlar_parent_enquiries_v1';

export const ParentEnquiriesModule: React.FC<ParentEnquiriesModuleProps> = ({
  childrenList,
  selectedChild,
}) => {
  const [enquiries, setEnquiries] = useState<ParentEnquiry[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState<ParentEnquiry | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formChildId, setFormChildId] = useState(selectedChild.id);
  const [formCategory, setFormCategory] = useState('Academic / Homework');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize and load enquiries
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PARENT_ENQUIRIES);
      if (stored) {
        setEnquiries(JSON.parse(stored));
      } else {
        const initialEnquiries: ParentEnquiry[] = [
          {
            id: 'enq-101',
            childId: 'child-1-maya',
            childName: 'Maya Chen',
            category: 'Academic / Homework',
            subject: 'Robotics Tournament Travel Details',
            message:
              'Hello Ms. Henderson, I wanted to inquire about departure logistics and teacher chaperone details for the upcoming Regional Robotics Tournament.',
            submittedAt: 'Oct 17, 2026, 09:15 AM',
            status: 'Resolved',
            replies: [
              {
                id: 'rep-1',
                sender: 'Teacher',
                senderName: 'Ms. Sarah Henderson',
                message:
                  'Dear Mrs. Chen, the bus departs from the main entrance at 7:15 AM on Saturday. Dr. Vance and I will be accompanying the team. Full itinerary packets will be distributed on Monday.',
                timestamp: 'Oct 17, 2026, 11:30 AM',
              },
            ],
          },
          {
            id: 'enq-102',
            childId: 'child-2-leo',
            childName: 'Leo Chen',
            category: 'Attendance & Health',
            subject: 'Verification of medical leave slip for Oct 15',
            message:
              'Submitting confirmation that Leo has been cleared by pediatrician to resume regular physical education classes following his recovery.',
            submittedAt: 'Oct 16, 2026, 02:40 PM',
            status: 'Resolved',
            replies: [
              {
                id: 'rep-2',
                sender: 'School Administration',
                senderName: 'Campus Nurse Desk',
                message:
                  'Medical clearance noted and updated in Leo health records. Coach Taylor has been informed.',
                timestamp: 'Oct 16, 2026, 03:15 PM',
              },
            ],
          },
        ];
        setEnquiries(initialEnquiries);
        localStorage.setItem(STORAGE_KEY_PARENT_ENQUIRIES, JSON.stringify(initialEnquiries));
      }
    } catch (e) {
      console.warn('Failed to load enquiries', e);
    }
  }, []);

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formMessage.trim()) {
      setFeedback({ type: 'error', message: 'Please provide both a subject and enquiry message.' });
      return;
    }

    const linkedChildRecord = childrenList.find((c) => c.id === formChildId) || selectedChild;

    const newEnquiry: ParentEnquiry = {
      id: `enq-${Date.now()}`,
      childId: linkedChildRecord.id,
      childName: linkedChildRecord.name,
      category: formCategory,
      subject: formSubject.trim(),
      message: formMessage.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Open',
      replies: [],
    };

    const nextList = [newEnquiry, ...enquiries];
    setEnquiries(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_PARENT_ENQUIRIES, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to persist enquiry', e);
    }

    setFeedback({
      type: 'success',
      message: `Enquiry logged successfully. Case #${newEnquiry.id} dispatched to faculty desk.`,
    });

    setTimeout(() => {
      setShowNewModal(false);
      setFeedback(null);
      setFormSubject('');
      setFormMessage('');
      setActiveEnquiry(newEnquiry);
    }, 1200);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeEnquiry) return;

    const updatedReplies = [
      ...activeEnquiry.replies,
      {
        id: `rep-${Date.now()}`,
        sender: 'Parent' as const,
        senderName: 'Mrs. Li Chen',
        message: replyMessage.trim(),
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ];

    const updatedEnquiry = { ...activeEnquiry, replies: updatedReplies };
    const nextList = enquiries.map((enq) => (enq.id === activeEnquiry.id ? updatedEnquiry : enq));

    setEnquiries(nextList);
    setActiveEnquiry(updatedEnquiry);
    setReplyMessage('');

    try {
      localStorage.setItem(STORAGE_KEY_PARENT_ENQUIRIES, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to persist reply', e);
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    if (filterCategory !== 'all' && enq.category !== filterCategory) {
      return false;
    }
    if (
      searchQuery &&
      !enq.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !enq.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
              Parent Communications
            </span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
              Teacher Inquiries & Messages
            </span>
          </div>

          <button
            onClick={() => {
              setFormChildId(selectedChild.id);
              setShowNewModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Message</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Cases' },
              { id: 'Academic / Homework', label: 'Academic' },
              { id: 'Attendance & Health', label: 'Attendance' },
              { id: 'Fee & Billing', label: 'Fees' },
              { id: 'Transport & Safety', label: 'Transport' },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all border whitespace-nowrap ${
                filterCategory === c.id ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
              }`}
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter message threads..."
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

      {/* Thread List */}
      <div className="space-y-2">
        {filteredEnquiries.length === 0 ? (
          <div
            className="p-6 rounded-xl border text-center space-y-2 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <Mail className="w-7 h-7 text-slate-400 mx-auto" />
            <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
              No messages found
            </span>
            <p className="text-slate-500 text-[11px]">
              Tap &ldquo;New Message&rdquo; to send an enquiry to school staff.
            </p>
          </div>
        ) : (
          filteredEnquiries.map((enq) => {
            const isResolved = enq.status === 'Resolved';
            return (
              <div
                key={enq.id}
                onClick={() => setActiveEnquiry(enq)}
                className="p-3.5 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all space-y-1.5 shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold block truncate" style={{ color: 'var(--color-text)' }}>
                      {enq.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Child: {enq.childName} · {enq.category}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {enq.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <span>{enq.submittedAt}</span>
                  <span className="font-bold text-teal-600 flex items-center gap-0.5">
                    <span>{enq.replies.length} replies</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NEW MESSAGE MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-200 space-y-3.5"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
                  Compose Faculty Inquiry
                </h3>
                <span className="text-[11px] text-slate-500">Greenfield Parent Desk</span>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateEnquiry} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Student
                  </label>
                  <select
                    value={formChildId}
                    onChange={(e) => setFormChildId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {childrenList.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <option value="Academic / Homework">Academic / Homework</option>
                    <option value="Attendance & Health">Attendance & Health</option>
                    <option value="Fee & Billing">Fee & Billing</option>
                    <option value="Transport & Safety">Transport & Safety</option>
                    <option value="General Enquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question regarding Algebra homework due Friday"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Message Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your inquiry clearly for the homeroom advisor or administration."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none leading-relaxed"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD DETAIL MODAL SHEET */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-200 space-y-3.5 max-h-[85vh] flex flex-col"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {activeEnquiry.category} · {activeEnquiry.childName}
                </span>
                <h3 className="text-sm font-extrabold truncate max-w-[260px]" style={{ color: 'var(--color-text)' }}>
                  {activeEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {/* Original Parent Message */}
              <div
                className="p-3 rounded-xl border space-y-1 text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Mrs. Li Chen (Guardian)</span>
                  <span className="text-[10px] text-slate-400 font-normal">{activeEnquiry.submittedAt}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeEnquiry.message}
                </p>
              </div>

              {/* Staff / Faculty Replies */}
              {activeEnquiry.replies.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl border space-y-1 text-xs ml-3"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary), 0.04)',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]" style={{ color: 'var(--color-primary)' }}>
                    <span>{rep.senderName} ({rep.sender})</span>
                    <span className="text-[10px] text-slate-400 font-normal">{rep.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-[11px]">
                    {rep.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="pt-2 border-t shrink-0 flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <input
                type="text"
                placeholder="Type response to school staff..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="submit"
                className="p-2 text-white rounded-lg shadow-xs hover:opacity-90 shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
                title="Send Reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
