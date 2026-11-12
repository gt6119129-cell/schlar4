import { AdminNavItem } from './adminNavigation';

export const TRANSPORT_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Fleet operational health: active buses, on-time arrivals, passenger loads, and safety alerts',
  },
  {
    id: 'routes',
    label: 'Route Directory',
    icon: 'MapPin',
    isFolder: false,
    requiredPermission: 'transport.manage',
    description: 'Morning and afternoon transit corridors, ordered stop sequences, and route schedules',
  },
  {
    id: 'transport-assignments',
    label: 'Student Allocations',
    icon: 'Users',
    isFolder: false,
    requiredPermission: 'transport.manage',
    description: 'Student route assignments, designated stop allocations, service types, and capacity validation',
  },

  // ----------------------------------------------------
  // FLEET MANAGEMENT FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-fleet',
    label: 'Fleet & Personnel',
    icon: 'Bus',
    isFolder: true,
    children: [
      {
        id: 'vehicles',
        label: 'Vehicles Registry',
        icon: 'Truck',
        requiredPermission: 'transport.manage',
        description: 'Buses and vans: registration, capacity, status, road permits, and document compliance',
      },
      {
        id: 'drivers',
        label: 'Drivers & Attendants',
        icon: 'UserCheck',
        requiredPermission: 'transport.manage',
        description: 'Commercial driver licences, expiry dates, route duty rosters, and medical fitness',
      },
      {
        id: 'vehicle-maintenance',
        label: 'Fleet Maintenance',
        icon: 'Wrench',
        requiredPermission: 'transport.manage',
        description: 'Scheduled preventive services, oil changes, brake inspections, and workshop work orders',
      },
    ],
  },

  // ----------------------------------------------------
  // DAILY OPERATIONS FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-operations',
    label: 'Daily Operations',
    icon: 'SlidersHorizontal',
    isFolder: true,
    children: [
      {
        id: 'transport-boarding',
        label: 'Boarding Register',
        icon: 'CheckSquare',
        requiredPermission: 'transport.manage',
        description: 'Morning and afternoon route boarding verification, stop manifests, and absentee alerts',
      },
      {
        id: 'transport-expenses',
        label: 'Fuel & Expenses',
        icon: 'Fuel',
        requiredPermission: 'transport.manage',
        description: 'Diesel refuels, toll passes, fleet operating expenses, and vendor receipts',
      },
      {
        id: 'transport-notices',
        label: 'Safety & Incidents',
        icon: 'AlertTriangle',
        requiredPermission: 'transport.manage',
        description: 'Incident register, route detours, minor mechanical alerts, and emergency circulars',
      },
    ],
  },

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------
  {
    id: 'transport-reports',
    label: 'Transport Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Route capacity utilization, fleet operating costs, student manifests, and compliance audit',
  },
];
