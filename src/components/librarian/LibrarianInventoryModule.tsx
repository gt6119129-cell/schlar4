import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Barcode,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Wrench,
  MapPin,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { BookCopy, BookCondition, CirculationStatus } from '../../types/library';
import { INITIAL_BOOK_COPIES, INITIAL_BOOK_TITLES } from '../../data/initialLibraryData';

export const LibrarianInventoryModule: React.FC = () => {
  const [copies, setCopies] = useState<BookCopy[]>(INITIAL_BOOK_COPIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add Copy to existing title state
  const [isAddCopyModalOpen, setIsAddCopyModalOpen] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState(INITIAL_BOOK_TITLES[0]?.id || '');
  const [newCopyData, setNewCopyData] = useState({
    shelfLocation: 'Stack S-02 (Slot 5)',
    condition: 'new' as BookCondition,
    price: 45,
    conditionNotes: '',
  });

  const filteredCopies = useMemo(() => {
    return copies.filter((copy) => {
      const matchSearch =
        copy.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCondition = conditionFilter === 'all' || copy.condition === conditionFilter;
      const matchStatus = statusFilter === 'all' || copy.circulationStatus === statusFilter;

      return matchSearch && matchCondition && matchStatus;
    });
  }, [copies, searchQuery, conditionFilter, statusFilter]);

  const handleUpdateCondition = (copyId: string, newCondition: BookCondition, newStatus?: CirculationStatus) => {
    setCopies(
      copies.map((c) => {
        if (c.id === copyId) {
          return {
            ...c,
            condition: newCondition,
            circulationStatus: newStatus || (newCondition === 'damaged' ? 'under-repair' : c.circulationStatus),
            lastVerifiedDate: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );
    setSelectedCopy(null);
    setFeedback(`Updated volume condition to ${newCondition}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddCopy = (e: React.FormEvent) => {
    e.preventDefault();
    const parentTitle = INITIAL_BOOK_TITLES.find((t) => t.id === selectedTitleId);
    if (!parentTitle) return;

    const newAcc = `ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBarcode = `89026${Math.floor(10000 + Math.random() * 90000)}`;

    const newCopy: BookCopy = {
      id: `cpy-${Date.now()}`,
      titleId: parentTitle.id,
      bookTitle: parentTitle.title,
      accessionNumber: newAcc,
      barcode: newBarcode,
      condition: newCopyData.condition,
      circulationStatus: 'available',
      shelfLocation: newCopyData.shelfLocation,
      purchaseDate: new Date().toISOString().split('T')[0],
      price: Number(newCopyData.price),
      conditionNotes: newCopyData.conditionNotes,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    setCopies([newCopy, ...copies]);
    setIsAddCopyModalOpen(false);
    setFeedback(`Added copy ${newAcc} for "${parentTitle.title}".`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Physical Book Inventory & Accessions
          </h2>
          <p className="text-xs text-slate-500">
            Copy-level tracking with accession numbers, barcode identifiers, condition grades, and shelf slots.
          </p>
        </div>

        <button
          onClick={() => setIsAddCopyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Accession New Copy</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FILTER BAR */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs flex-1 max-w-md"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Accession No, Barcode, Title, or Shelf..."
            className="w-full bg-transparent border-none outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Condition Filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Conditions</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="damaged">Damaged</option>
            <option value="lost">Lost</option>
            <option value="missing">Missing</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Circulation Statuses</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="reserved">Reserved</option>
            <option value="under-repair">Under Repair</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* COPIES TABLE */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: 'var(--color-table-header, #f9fafb)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Accession No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Barcode</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Title</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Shelf Location</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Condition</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredCopies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No physical book copies match the filters.
                  </td>
                </tr>
              ) : (
                filteredCopies.map((copy) => {
                  const isAvailable = copy.circulationStatus === 'available';
                  const isDamaged = copy.condition === 'damaged';

                  return (
                    <tr key={copy.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-teal-700">
                        {copy.accessionNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {copy.barcode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                          {copy.bookTitle}
                        </span>
                        {copy.conditionNotes && (
                          <span className="text-[10px] text-amber-600 block italic">
                            Note: {copy.conditionNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                        {copy.shelfLocation}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                            copy.condition === 'new'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : copy.condition === 'good'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : copy.condition === 'damaged'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {copy.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : copy.circulationStatus === 'issued'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {copy.circulationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedCopy(copy)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold border hover:bg-black/5"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          Inspect / Grade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT / UPDATE CONDITION MODAL */}
      {selectedCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-700">
                  {selectedCopy.accessionNumber}
                </span>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Condition Inspection & Re-grading
                </h3>
              </div>
              <button onClick={() => setSelectedCopy(null)} className="p-1 rounded hover:bg-black/5">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Title</span>
                <span className="font-semibold">{selectedCopy.bookTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Current Status</span>
                <span className="font-medium capitalize">{selectedCopy.circulationStatus} (Condition: {selectedCopy.condition})</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="font-semibold block mb-2 text-xs">Select New Condition Grade:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['new', 'good', 'fair', 'damaged'] as BookCondition[]).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleUpdateCondition(selectedCopy.id, grade)}
                    className="p-2.5 rounded-lg border font-semibold capitalize text-center hover:bg-black/5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    Grade as {grade}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpdateCondition(selectedCopy.id, 'damaged', 'under-repair')}
                className="px-3 py-1.5 rounded-lg border text-rose-700 border-rose-200 hover:bg-rose-50 font-semibold"
              >
                Send to Repair Stacks
              </button>
              <button
                onClick={() => setSelectedCopy(null)}
                className="px-3 py-1.5 rounded-lg border hover:bg-black/5 font-semibold"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESSION NEW COPY MODAL */}
      {isAddCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleAddCopy}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Barcode className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Accession Volume to Title
                </h3>
              </div>
              <button type="button" onClick={() => setIsAddCopyModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Catalogue Title *</label>
                <select
                  value={selectedTitleId}
                  onChange={(e) => setSelectedTitleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {INITIAL_BOOK_TITLES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.isbn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Shelf Slot Location *</label>
                <input
                  type="text"
                  required
                  value={newCopyData.shelfLocation}
                  onChange={(e) => setNewCopyData({ ...newCopyData, shelfLocation: e.target.value })}
                  placeholder="e.g. Stack S-02 (Slot 5)"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Initial Condition</label>
                <select
                  value={newCopyData.condition}
                  onChange={(e) => setNewCopyData({ ...newCopyData, condition: e.target.value as BookCondition })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="new">New (Mint)</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Purchase Value (₹ INR)</label>
                <input
                  type="number"
                  value={newCopyData.price}
                  onChange={(e) => setNewCopyData({ ...newCopyData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsAddCopyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Accession Copy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
