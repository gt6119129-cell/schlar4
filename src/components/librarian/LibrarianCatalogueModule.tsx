import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  Edit2,
  Archive,
  Layers,
  MapPin,
  Barcode,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { BookTitle, BookCopy } from '../../types/library';
import { INITIAL_BOOK_CATEGORIES } from '../../data/initialLibraryData';
import { useSchoolData } from '../../context/SchoolDataContext';

export const LibrarianCatalogueModule: React.FC = () => {
  const {
    bookTitles: titles,
    bookCopies: copies,
    addBookTitle,
    updateBookTitle,
  } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'issued'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<BookTitle | null>(null);
  const [detailTitle, setDetailTitle] = useState<BookTitle | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    authors: '',
    isbn: '',
    categoryId: 'cat-sci',
    publisher: '',
    publicationYear: 2024,
    edition: '1st Edition',
    language: 'English',
    description: '',
    shelfLocation: 'Stack S-01',
    rackNumber: 'Rack 1',
    initialCopiesCount: 3,
    purchasePrice: 45,
    supplier: 'Standard Educational Book Supplies',
  });

  const categories = INITIAL_BOOK_CATEGORIES;

  // Filtered titles
  const filteredTitles = useMemo(() => {
    return titles.filter((book) => {
      const matchSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || book.categoryId === selectedCategory;
      const matchAvail =
        availabilityFilter === 'all'
          ? true
          : availabilityFilter === 'available'
          ? book.availableCopies > 0
          : book.availableCopies === 0;

      return matchSearch && matchCat && matchAvail;
    });
  }, [titles, searchQuery, selectedCategory, availabilityFilter]);

  // Copies belonging to detailTitle
  const titleCopies = useMemo(() => {
    if (!detailTitle) return [];
    return copies.filter((c) => c.titleId === detailTitle.id);
  }, [detailTitle, copies]);

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      subtitle: '',
      authors: '',
      isbn: '',
      categoryId: categories[0]?.id || 'cat-sci',
      publisher: '',
      publicationYear: 2024,
      edition: '1st Edition',
      language: 'English',
      description: '',
      shelfLocation: 'Stack S-01',
      rackNumber: 'Rack 1',
      initialCopiesCount: 3,
      purchasePrice: 45,
      supplier: 'Standard Educational Book Supplies',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();

    // Check duplicate ISBN
    const isDuplicate = titles.some(
      (b) => b.isbn.trim().toLowerCase() === formData.isbn.trim().toLowerCase() && (!editingTitle || b.id !== editingTitle.id)
    );
    if (isDuplicate) {
      setFeedbackMessage({ type: 'error', text: `A title with ISBN ${formData.isbn} already exists in the catalogue.` });
      return;
    }

    const cat = categories.find((c) => c.id === formData.categoryId);
    const authorList = formData.authors.split(',').map((a) => a.trim()).filter(Boolean);

    if (editingTitle) {
      // Update
      const res = updateBookTitle(editingTitle.id, {
        title: formData.title,
        subtitle: formData.subtitle,
        authors: authorList,
        isbn: formData.isbn,
        categoryId: formData.categoryId,
        categoryName: cat?.name || editingTitle.categoryName,
        publisher: formData.publisher,
        publicationYear: Number(formData.publicationYear),
        edition: formData.edition,
        language: formData.language,
        description: formData.description,
        shelfLocation: formData.shelfLocation,
        rackNumber: formData.rackNumber,
        purchasePrice: Number(formData.purchasePrice),
        supplier: formData.supplier,
      });

      if (res.isValid) {
        setEditingTitle(null);
        setFeedbackMessage({ type: 'success', text: `Updated title "${formData.title}" successfully.` });
      } else {
        setFeedbackMessage({ type: 'error', text: res.message || 'Update failed.' });
        return;
      }
    } else {
      // Create new title & generated physical copies
      const copiesToAddCount = Math.max(1, Number(formData.initialCopiesCount) || 1);

      const res = addBookTitle(
        {
          isbn: formData.isbn,
          title: formData.title,
          subtitle: formData.subtitle,
          authors: authorList,
          categoryId: formData.categoryId,
          categoryName: cat?.name || 'General',
          publisher: formData.publisher,
          publicationYear: Number(formData.publicationYear),
          edition: formData.edition,
          language: formData.language,
          description: formData.description,
          shelfLocation: formData.shelfLocation,
          rackNumber: formData.rackNumber,
          totalCopies: copiesToAddCount,
          issuedCopies: 0,
          reservedCopies: 0,
          acquisitionDate: new Date().toISOString().split('T')[0],
          purchasePrice: Number(formData.purchasePrice),
          supplier: formData.supplier,
          status: 'active',
          coverEmoji: '📖',
        },
        copiesToAddCount
      );

      if (res.isValid) {
        setIsAddModalOpen(false);
        setFeedbackMessage({
          type: 'success',
          text: `Catalogued "${formData.title}" with ${copiesToAddCount} accessioned physical volumes.`,
        });
      } else {
        setFeedbackMessage({ type: 'error', text: res.message || 'Creation failed.' });
        return;
      }
    }

    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleArchiveTitle = (titleToArchive: BookTitle) => {
    if (titleToArchive.issuedCopies > 0) {
      setFeedbackMessage({
        type: 'error',
        text: `Cannot archive "${titleToArchive.title}" while ${titleToArchive.issuedCopies} physical copies are currently checked out.`,
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }

    updateBookTitle(titleToArchive.id, { status: 'archived' });
    setFeedbackMessage({
      type: 'success',
      text: `Archived catalogue title "${titleToArchive.title}".`,
    });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Book Catalogue & Bibliography
          </h2>
          <p className="text-xs text-slate-500">
            Standard OPAC catalogue with ISBN validation, Dewey taxonomy, and volume holdings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Title</span>
        </button>
      </div>

      {/* FEEDBACK BANNER */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
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
            placeholder="Search by Title, Author, ISBN, or Shelf location..."
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
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Availability Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)' }}>
            {(['all', 'available', 'issued'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setAvailabilityFilter(filterKey)}
                className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                  availabilityFilter === filterKey ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATALOGUE TABLE */}
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Title & Details</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">ISBN</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Shelf Stack</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Copies</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredTitles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No catalogue titles match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTitles.map((book) => {
                  const isAvailable = book.availableCopies > 0;

                  return (
                    <tr key={book.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      {/* Title & Author */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl shrink-0 mt-0.5">{book.coverEmoji || '📖'}</span>
                          <div>
                            <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                              {book.title}
                            </span>
                            {book.subtitle && (
                              <span className="text-[11px] text-slate-400 block line-clamp-1">{book.subtitle}</span>
                            )}
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              by {book.authors.join(', ')} · {book.publisher} ({book.publicationYear})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ISBN */}
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {book.isbn}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {book.categoryName}
                        </span>
                      </td>

                      {/* Shelf Stack */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{book.shelfLocation}</span>
                        </div>
                      </td>

                      {/* Copies Breakdown */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-[11px]">
                          <span className="font-bold text-emerald-600">{book.availableCopies}</span>
                          <span className="text-slate-400">/</span>
                          <span>{book.totalCopies}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            book.status === 'archived'
                              ? 'bg-slate-200 text-slate-700'
                              : isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {book.status === 'archived' ? 'Archived' : isAvailable ? 'Available' : 'All Issued'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailTitle(book)}
                            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
                            title="View Copies & Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingTitle(book);
                              setFormData({
                                title: book.title,
                                subtitle: book.subtitle || '',
                                authors: book.authors.join(', '),
                                isbn: book.isbn,
                                categoryId: book.categoryId,
                                publisher: book.publisher,
                                publicationYear: book.publicationYear,
                                edition: book.edition || '1st Edition',
                                language: book.language,
                                description: book.description,
                                shelfLocation: book.shelfLocation,
                                rackNumber: book.rackNumber,
                                initialCopiesCount: book.totalCopies,
                                purchasePrice: book.purchasePrice || 45,
                                supplier: book.supplier || '',
                              });
                            }}
                            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
                            title="Edit Title Information"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {book.status !== 'archived' && (
                            <button
                              onClick={() => handleArchiveTitle(book)}
                              className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                              title="Archive Title"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: VIEW COPIES & BARCODES */}
      {detailTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {detailTitle.categoryName}
                </span>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                  {detailTitle.title}
                </h3>
                <p className="text-xs text-slate-500">
                  ISBN {detailTitle.isbn} · {detailTitle.authors.join(', ')}
                </p>
              </div>
              <button onClick={() => setDetailTitle(null)} className="p-1 rounded hover:bg-black/5">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {detailTitle.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Publisher</span>
                <span className="font-semibold">{detailTitle.publisher}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Location</span>
                <span className="font-semibold">{detailTitle.shelfLocation}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Available</span>
                <span className="font-bold text-emerald-600">{detailTitle.availableCopies} of {detailTitle.totalCopies}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Replacement Cost</span>
                <span className="font-semibold">${detailTitle.purchasePrice || 45}</span>
              </div>
            </div>

            {/* Copies Sub-table */}
            <div className="border rounded-xl overflow-hidden mt-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="p-3 border-b bg-black/[0.02] flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                <h4 className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                  Physical Copy Inventory ({titleCopies.length} accessioned items)
                </h4>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b text-[10px] uppercase text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="py-2 px-3">Accession No</th>
                    <th className="py-2 px-3">Barcode</th>
                    <th className="py-2 px-3">Condition</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Shelf Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {titleCopies.map((copy) => (
                    <tr key={copy.id}>
                      <td className="py-2 px-3 font-mono font-bold text-teal-700">{copy.accessionNumber}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{copy.barcode}</td>
                      <td className="py-2 px-3 capitalize">{copy.condition}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            copy.circulationStatus === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {copy.circulationStatus}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{copy.shelfLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setDetailTitle(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || editingTitle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveTitle}
            className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingTitle ? 'Edit Catalogue Title' : 'Catalogue New Book Title'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingTitle(null);
                }}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Principia Mathematica"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ISBN-13 *</label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="e.g. 978-0123456789"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category / Dewey Subject *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Authors (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="e.g. Richard Feynman, Robert Leighton"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  placeholder="e.g. MIT Press"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Publication Year</label>
                <input
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Shelf Location</label>
                <input
                  type="text"
                  value={formData.shelfLocation}
                  onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                  placeholder="e.g. Stack S-02"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              {!editingTitle && (
                <div>
                  <label className="font-semibold block mb-1">Initial Physical Copies *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.initialCopiesCount}
                    onChange={(e) => setFormData({ ...formData, initialCopiesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border outline-none font-bold"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Will auto-generate unique accession numbers & barcodes.
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Purchase Price (₹ INR)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Bibliographic notes, summary, or target audience..."
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
                  setEditingTitle(null);
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
                {editingTitle ? 'Save Changes' : 'Confirm & Accession'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
