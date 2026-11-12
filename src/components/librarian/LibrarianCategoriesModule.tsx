import React, { useState } from 'react';
import { Tag, Plus, Edit2, Archive, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { BookCategory } from '../../types/library';
import { INITIAL_BOOK_CATEGORIES, INITIAL_BOOK_TITLES } from '../../data/initialLibraryData';

export const LibrarianCategoriesModule: React.FC = () => {
  const [categories, setCategories] = useState<BookCategory[]>(INITIAL_BOOK_CATEGORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    deweyRange: '',
    description: '',
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', code: '', deweyRange: '', description: '' });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...formData }
            : c
        )
      );
      setEditingCategory(null);
      setFeedback({ type: 'success', message: `Updated category "${formData.name}".` });
    } else {
      const newCat: BookCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        code: formData.code.toUpperCase(),
        deweyRange: formData.deweyRange,
        description: formData.description,
        bookCount: 0,
        status: 'active',
      };
      setCategories([...categories, newCat]);
      setIsAddModalOpen(false);
      setFeedback({ type: 'success', message: `Created category "${formData.name}".` });
    }

    setTimeout(() => setFeedback(null), 4000);
  };

  const handleArchive = (cat: BookCategory) => {
    // Check if any books reference this category
    const linkedBooks = INITIAL_BOOK_TITLES.filter((b) => b.categoryId === cat.id);
    if (linkedBooks.length > 0) {
      setFeedback({
        type: 'error',
        message: `Cannot archive category "${cat.name}": it is currently referenced by ${linkedBooks.length} active book title(s).`,
      });
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    setCategories(categories.map((c) => (c.id === cat.id ? { ...c, status: 'archived' } : c)));
    setFeedback({ type: 'success', message: `Archived category "${cat.name}".` });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Dewey Taxonomy & Subject Categories
          </h2>
          <p className="text-xs text-slate-500">
            Define and organize catalog taxonomy, Dewey Decimal classification ranges, and shelf tags.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-xl border shadow-xs transition-colors flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {cat.code}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Dewey {cat.deweyRange || 'N/A'}
                </span>
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[11px] text-slate-500 font-medium">
                {cat.bookCount} catalogued titles
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setFormData({
                      name: cat.name,
                      code: cat.code,
                      deweyRange: cat.deweyRange || '',
                      description: cat.description,
                    });
                  }}
                  className="p-1.5 rounded hover:bg-black/5 text-slate-500 hover:text-slate-700"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {cat.status !== 'archived' && (
                  <button
                    onClick={() => handleArchive(cat)}
                    className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                    title="Archive Category"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT MODAL */}
      {(isAddModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingCategory ? 'Edit Category' : 'Create Subject Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCategory(null);
                }}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Biomedical Sciences"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. BIO-570"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Dewey Classification Range</label>
                <input
                  type="text"
                  value={formData.deweyRange}
                  onChange={(e) => setFormData({ ...formData, deweyRange: e.target.value })}
                  placeholder="e.g. 570–579"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Subject scope, topics, or grade level alignment..."
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCategory(null);
                }}
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
