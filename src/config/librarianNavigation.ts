import { AdminNavItem } from './adminNavigation';

export const LIBRARIAN_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Circulation snapshot: titles, physical copies, active loans, overdue alerts, and fines',
  },
  {
    id: 'book-catalogue',
    label: 'Book Catalogue',
    icon: 'BookMarked',
    isFolder: false,
    requiredPermission: 'library.manage',
    description: 'Digital catalog search: ISBN, Dewey classification, authors, subjects, and editions',
  },
  {
    id: 'book-inventory',
    label: 'Book Inventory',
    icon: 'Library',
    isFolder: false,
    requiredPermission: 'library.manage',
    description: 'Physical copies, accession numbers, barcode tags, condition grading, and shelf stacks',
  },

  // ----------------------------------------------------
  // CIRCULATION FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-circulation',
    label: 'Circulation Desk',
    icon: 'ScanLine',
    isFolder: true,
    children: [
      {
        id: 'issue-books',
        label: 'Issue Book',
        icon: 'PlusCircle',
        requiredPermission: 'library.manage',
        description: 'Check-out terminal: borrower verification, borrowing limits, and due date slip assignment',
      },
      {
        id: 'return-books',
        label: 'Return Book',
        icon: 'CheckSquare',
        requiredPermission: 'library.manage',
        description: 'Check-in terminal: condition inspection, fine assessment, and shelf restock staging',
      },
      {
        id: 'reservations',
        label: 'Renewals & Holds',
        icon: 'Clock',
        requiredPermission: 'library.manage',
        description: 'Active loan renewals, waitlist reservations queue, and hold collection alerts',
      },
      {
        id: 'overdue-books',
        label: 'Overdue & Fines',
        icon: 'AlertTriangle',
        requiredPermission: 'library.manage',
        description: 'Overdue tracking, fine calculation with grace period, payment collection, and waivers',
      },
    ],
  },

  // ----------------------------------------------------
  // CATALOGUE & MEMBERS FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-management',
    label: 'Catalog & Members',
    icon: 'Layers',
    isFolder: true,
    children: [
      {
        id: 'lib-members',
        label: 'Library Members',
        icon: 'Users',
        requiredPermission: 'students.view',
        description: 'Registered student and faculty borrowing accounts, quotas, and loan histories',
      },
      {
        id: 'lib-categories',
        label: 'Subject Categories',
        icon: 'Tag',
        requiredPermission: 'library.manage',
        description: 'Dewey decimal taxonomy, subject classifications, and shelf category management',
      },
      {
        id: 'lib-stock-verification',
        label: 'Stock Verification',
        icon: 'ShieldCheck',
        requiredPermission: 'library.manage',
        description: 'Annual barcode physical inventory audits, condition logs, and missing volume tracking',
      },
    ],
  },

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------
  {
    id: 'library-reports',
    label: 'Library Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Circulation frequency metrics, top circulating books, overdue ledgers, and loss audits',
  },
];
