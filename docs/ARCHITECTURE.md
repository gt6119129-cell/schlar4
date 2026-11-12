# SCHLAR System Architecture

## 1. Directory Structure

```text
/
├── public/                 # Static assets and icons
├── src/
│   ├── config/             # Role configurations, navigation items, permission matrices
│   │   ├── roles.ts        # 10 role definitions, categories, nav items, mock stats
│   │   └── permissions.ts  # Permission registry and RBAC defaults
│   ├── context/            # React Context state providers
│   │   ├── PermissionContext.tsx # Centralized RBAC permission evaluator
│   │   ├── SchoolDataContext.tsx # Master mock database, relations, and CRUD operations
│   │   └── ThemeContext.tsx      # Palette token engine, appearance modes, customizer
│   ├── data/               # Seed datasets for Greenfield International School
│   │   ├── initialSchoolData.ts    # Classes, sections, students, teachers, timetable
│   │   ├── initialFinanceData.ts   # Fee structures, obligations, transactions
│   │   ├── initialLibraryData.ts   # Books, copies, loans, reservations, fines
│   │   ├── initialTransportData.ts # Routes, vehicles, drivers, boarding manifests
│   │   ├── initialReceptionData.ts # Visitors, enquiries, appointments, dispatches
│   │   └── mockData.ts             # Notifications, system logs, linked parent wards
│   ├── types/              # TypeScript interfaces and domain schemas
│   │   ├── school.ts       # Academics, attendance, staff, timetable, exams
│   │   ├── finance.ts      # Tuition tiers, vouchers, concessions, payment methods
│   │   ├── library.ts      # Dewey catalog, copies, circulation records
│   │   ├── transport.ts    # Fleet inventory, transit stops, capacity
│   │   ├── reception.ts    # Gate passes, admissions triage, mail
│   │   └── theme.ts        # Design tokens, palette structures, HEX schemas
│   ├── components/         # Modular UI presentation layer
│   │   ├── admin/          # Admin workspace modules (Admissions, Timetable, Staff, etc.)
│   │   ├── viceprincipal/  # VP academic monitoring, teacher coordination, exams
│   │   ├── teacher/        # Web portal & faculty mobile app (Attendance matrix, marks)
│   │   ├── parent/         # Dedicated parent mobile shell (Child switcher, fees, bus)
│   │   ├── accountant/     # Fee collections, ledgers, concessions, reconciliation
│   │   ├── hr/             # Staff directory, leave approvals, attendance timesheets
│   │   ├── librarian/      # Catalogue, issue/return terminal, fines, reservations
│   │   ├── transport/      # Routes, fleet, driver manifests, vehicle maintenance
│   │   ├── receptionist/   # Visitor registration desk, admission enquiries, calls
│   │   ├── examcoordinator/# Assessment calendar, hall tickets, marks moderation
│   │   ├── workspace/      # Shared workspace shells, sidebars, top application bars
│   │   ├── landing/        # Landing hero, 10-role selector grid
│   │   ├── themes/         # Theme gallery, custom HEX palette editor, dialogs
│   │   ├── common/         # Architecture modal, notifications drawer, global search
│   │   └── brand/          # SVG logos, wordmarks, and compact badges
│   ├── utils/              # Export/import utilities, formatters, validation helpers
│   ├── index.css           # Tailwind CSS imports, focus rings, accessibility tokens
│   ├── main.tsx            # DOM root bootstrap
│   └── App.tsx             # Root router, hash listener, modal layer
├── index.html              # HTML5 entry with meta descriptions
├── package.json            # Scripts and dependencies
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 2. Application Entry & Routing Architecture

### Hash-Based Workspace Routing
SCHLAR uses zero-dependency, collision-free hash routing (`#role=<id>&platform=<web|mobile>`) designed specifically for embedded iframe resilience, clean deep-linking, and fast browser history navigation:
- `window.location.hash = ''`: Main Landing & Role Selection Grid.
- `window.location.hash = 'role=admin&platform=web'`: Admin Executive Workspace.
- `window.location.hash = 'role=parent&platform=mobile'`: Parent Mobile Shell (Strictly mobile-only).
- `window.location.hash = 'role=teacher&platform=web'`: Teacher Web Instructional Portal.
- `window.location.hash = 'role=teacher&platform=mobile'`: Teacher Faculty Mobile App.

Hash changes are synchronously parsed in `src/App.tsx` via `window.addEventListener('hashchange')`. Invalid role identifiers automatically redirect back to the role selection grid.

### Collapsible Sidebar Folder Architecture
All nested expandable folders across workspace sidebars (Admin, Vice Principal, Accountant, HR Manager, Librarian, Transport Manager, Receptionist, and Teacher) are configured to be **closed by default** on workspace load. This maintains a clean, high-density initial view. Users can click any folder header or chevron to toggle it open on demand.

---

## 3. Design Token Architecture & Theming

### CSS Variables on Document Root
SCHLAR dynamically injects 20+ CSS custom properties into `document.documentElement` via `ThemeContext.tsx`:
- `--color-primary`: Dominant structural hue (buttons, headers, accents).
- `--color-secondary`: Supporting operational indicator.
- `--color-accent`: High-visibility callouts (badges, notification dots).
- `--color-background`: Canvas background for the entire application.
- `--color-surface`: Card containers, tables, modals, and toolbars.
- `--color-sidebar`: ChatGPT-style dark sidebar background.
- `--color-border`: Subdued borders for cards, inputs, and dividers.
- `--color-focus-ring`: Accessible 2px outline for `:focus-visible` elements.

### 12 Calibrated Institutional Palettes
Every palette is meticulously designed with 60-30-10 color harmony:
1. Classic Navy & Amber (`#1E3A8A` / `#D97706`)
2. Forest Green & Sage (`#1B4332` / `#52B788`)
3. Deep Burgundy & Gold (`#5B1425` / `#D4AF37`)
4. Slate & Coral (`#334155` / `#F97316`)
5. Royal Purple & Mint (`#4C1D95` / `#10B981`)
6. Warm Earth & Terracotta (`#5C3D2E` / `#C85A32`)
7. **Petrol & Copper (Default)** (`#164E55` / `#C47D54`)
8. Charcoal & Crimson (`#27272A` / `#DC2626`)
9. Ocean Teal & Sand (`#0F4C5C` / `#E36414`)
10. Midnight Blue & Bronze (`#0F172A` / `#CA8A04`)
11. Nordic Pine & Copper (`#19382C` / `#B85D19`)
12. Steel Blue & Ochre (`#1E3D59` / `#FF6E40`)

### Dynamic HEX Customizer
Users can customize any token through three methods:
- **Preset Customization**: Modify any existing palette.
- **Color Family Generators**: Generate harmonic palettes using dominant hues.
- **Direct HEX Input**: Enter exact 6-character hex values with real-time contrast feedback.

---

## 4. State Management & Data Persistence

### Master Entity Context (`SchoolDataContext`)
Data is stored centrally in `SchoolDataContext.tsx` and mirrored to `localStorage` under `schlar_school_data_v1`:
- **Academics**: 7 Grade levels, 14 Sections, 32 Enrolled Students, 18 Staff Members, 12 Subjects, 42 Timetable Slots, 8 Rooms.
- **Attendance**: Daily session registers with individual period timestamps and audit history.
- **Finance**: 6 Fee categories, 32 Student obligation ledgers, 24 Recorded transactions, 4 Concession waivers.
- **Library**: 20 Book titles, 60 Volume copies, 40 Member cards, 12 Active loans, 6 Overdue fine tickets.
- **Transport**: 4 Transit corridors, 4 Fleet buses, 4 Licensed drivers, 28 Student boarding allocations.
- **Reception**: 16 Registered visitors, 24 Visitor passes, 12 Admission inquiries, 8 Executive appointments.
- **Exams**: 3 Term examinations, 18 Subject assessments, 96 Student marks entries.

### One-Click Benchmark Reset
`resetAllSchoolDataToDefaults()` wipes any local modifications, clears `localStorage`, and restores pristine initial relations across all 10 roles.

---

## 5. Security & Permission Boundaries (RBAC)

The `PermissionProvider` encapsulates strict capability checks:
- **Render-time Guarding**: Tabs and buttons are conditionally displayed or disabled based on `hasPermission(roleId, permission)`.
- **Action-time Guarding**: CRUD handlers re-verify permission before executing state updates.
- **Data Filtering**: Queries like `getParentWards(parentId)` strictly filter students linked by guardian phone/email, preventing cross-family record access.
- **Frontend-only Notice**: SCHLAR clearly documents that client-side RBAC protects against UI mistakes and operational confusion, but production implementations require server-side token authentication.
