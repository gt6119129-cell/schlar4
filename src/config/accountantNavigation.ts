import { AdminNavItem } from './adminNavigation';

export const ACCOUNTANT_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Financial snapshot, collection pacing, outstanding balances, and recent receipts',
  },
  {
    id: 'acc-collection-overview',
    label: 'Collection Overview',
    icon: 'TrendingUp',
    isFolder: false,
    requiredPermission: 'fees.view',
    description: 'Annual and termly revenue collections, category breakdowns, and performance pacing',
  },
  {
    id: 'outstanding-balances',
    label: 'Outstanding Balances',
    icon: 'AlertTriangle',
    isFolder: false,
    requiredPermission: 'fees.view',
    description: 'Aging dues matrix, overdue student ledgers, and collection follow-up logging',
  },
  {
    id: 'financial-reports',
    label: 'Financial Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Statutory balance sheets, daily cash registers, and auditor reconciliation packages',
  },
  {
    id: 'acc-activity-log',
    label: 'Activity Log',
    icon: 'History',
    isFolder: false,
    requiredPermission: 'fees.view',
    description: 'Audit trail of recorded fees, fee assignments, concession approvals, and receipt reprints',
  },

  // ----------------------------------------------------
  // EXPANDABLE FOLDERS
  // ----------------------------------------------------

  // 1. Fee Management Folder
  {
    id: 'folder-fee-management',
    label: 'Fee Management',
    icon: 'SlidersHorizontal',
    isFolder: true,
    children: [
      {
        id: 'fee-structure',
        label: 'Fee Structure',
        icon: 'Layers',
        requiredPermission: 'fees.manage_structure',
        description: 'Tiered tuition matrices, lab charges, facility levies, and installment schedules',
      },
      {
        id: 'student-fee-records',
        label: 'Student Fee Records',
        icon: 'Users',
        requiredPermission: 'fees.view',
        description: 'Individual student accounts, billed amounts, credits, and ledger history',
      },
      {
        id: 'acc-assign-fees',
        label: 'Assign Fees',
        icon: 'UserPlus',
        requiredPermission: 'fees.manage_structure',
        description: 'Assign fee structures to classes, cohorts, or individual students with validation',
      },
      {
        id: 'concessions',
        label: 'Concessions',
        icon: 'Award',
        requiredPermission: 'fees.approve_concession',
        description: 'Merit scholarships, staff child discounts, and financial hardship adjustments',
      },
      {
        id: 'acc-refunds-adjustments',
        label: 'Refunds & Adjustments',
        icon: 'RotateCcw',
        requiredPermission: 'fees.manage_structure',
        description: 'Authorized fee refunds, ledger adjustments, and audit-logged reversals',
      },
    ],
  },

  // 2. Collections Folder
  {
    id: 'folder-collections',
    label: 'Collections',
    icon: 'CreditCard',
    isFolder: true,
    children: [
      {
        id: 'collect-record-fees',
        label: 'Collect & Record Fees',
        icon: 'PlusCircle',
        requiredPermission: 'fees.record_payment',
        description: 'Cash, bank wire, card, and check collection terminal with allocation engine',
      },
      {
        id: 'acc-payment-history',
        label: 'Payment History',
        icon: 'CheckCircle2',
        requiredPermission: 'fees.view',
        description: 'Log of verified payment transactions, bank clearances, and transaction references',
      },
      {
        id: 'receipts',
        label: 'Receipts',
        icon: 'Receipt',
        requiredPermission: 'fees.issue_receipt',
        description: 'Numbered fee vouchers, automated receipt generation, and printable vouchers',
      },
      {
        id: 'acc-reversed-transactions',
        label: 'Reversed & Cancelled',
        icon: 'XCircle',
        requiredPermission: 'fees.view',
        description: 'Audit archive of bounced checks, cancelled drafts, and reversed vouchers',
      },
    ],
  },

  // 3. Reconciliation Folder
  {
    id: 'folder-reconciliation',
    label: 'Reconciliation',
    icon: 'Scale',
    isFolder: true,
    children: [
      {
        id: 'acc-reconciliation-overview',
        label: 'Reconciliation Overview',
        icon: 'CheckSquare',
        requiredPermission: 'reports.view',
        description: 'Bank statement matching summary, cleared settlements, and discrepancy audits',
      },
      {
        id: 'acc-unmatched-payments',
        label: 'Unmatched Payments',
        icon: 'HelpCircle',
        requiredPermission: 'reports.view',
        description: 'Unidentified bank wires, reference discrepancies, and exception resolution desk',
      },
      {
        id: 'acc-reconciliation-history',
        label: 'Reconciliation History',
        icon: 'FileText',
        requiredPermission: 'reports.view',
        description: 'Historical bank statement audits, batch approvals, and cleared ledgers',
      },
    ],
  },
];
