# SCHLAR — School Management Platform

> **Greenfield International School** Comprehensive Institutional Operations & Academic Coordination Platform

SCHLAR is a frontend-only school management and institutional coordination platform engineered for modern K-12 and international school environments. Built with a high-density, accessible interface, SCHLAR delivers ten dedicated role workspaces, dual web/mobile faculty experiences, a dedicated parent mobile application, and a 12-palette design token engine with live custom HEX editing.

---

## Key System Pillars

1. **Exactly Ten Role Workspaces (RBAC)**
   - **Admin**: Executive institutional governance, admissions, classes & sections, master timetable builder, school-wide reports, and system settings.
   - **Vice Principal**: Academic oversight, syllabus pacing audits, teacher coordination, timetable conflict resolution, and student interventions.
   - **Teacher**: Dual web portal and mobile app for period roll call (multi-period timetable matrix with sticky student columns), assignments, continuous evaluation, and marks entry.
   - **Parent (Strictly Mobile-Only)**: Ward selector, real-time period attendance, homework checklist, timetable, fee statements, transit alerts, and exam results.
   - **Accountant / Fee Manager**: Tiered fee structures, student ledgers, simulated payment receipts, overdue balances, and financial reconciliation.
   - **HR / Staff Manager**: Employee directory, service profiles, biometric timesheet attendance, leave request approvals, and recruitment pipelines.
   - **Librarian**: Dewey decimal digital catalogue, physical volume barcode holdings, circulation loan check-out/return desks, overdue fines, and reservations.
   - **Transport Manager**: Fleet vehicle records, commercial driver licenses, morning/afternoon route corridors with pickup stops, and student transit manifests.
   - **Receptionist / Front Office**: Digital visitor gate pass register, visitor check-in/out, admission inquiries, appointment calendar, and mail/courier logs.
   - **Exam Coordinator**: Exam calendar, assessment setup, examination timetable, hall ticket generation, teacher marks submission tracking, and result publication.

2. **Strict Experience Boundaries**
   - **Parent Role**: Strictly mobile-only. Never renders or exposes a web portal.
   - **Teacher Role**: Full desktop instructional web portal and optimized mobile faculty app.
   - **Admin vs. Vice Principal**: Segregated administrative authority and distinct operational scopes.
   - **Zero Role Drift**: No generic "Student" or "Super Admin" roles.

3. **12-Palette Design Token Engine**
   - Default palette: **Petrol & Copper** (Primary: `#164E55`, Secondary: `#287B7A`, Accent: `#C47D54`, Background: `#F5F0E7`, Surface: `#FFFFFF`).
   - 12 pre-calibrated institutional palettes with 60-30-10 color discipline and WCAG 2.2 AA contrast adherence.
   - Custom HEX editor supporting live token overrides, export/import of JSON schemas, and CSS variable downloads.

4. **Multi-Period Timetable Attendance Matrix**
   - Dedicated matrix view: **1 row per student**, **applicable periods as columns** (P1 through P6).
   - Sticky student columns (`Roll #` and `Student Full Name`) preventing lost context during horizontal touch-scroll on tablet/mobile.
   - Standard symbols: `✓` (Present — emerald), `X` (Absent — rose), `⏱` (Late — amber), `E` (Excused — blue).
   - Instant single-click cell toggling, column-wide quick fill, and explanatory audit logging for amended registers.

---

## Technology Stack

- **Framework**: React 19 SPA
- **Build Tool**: Vite 8 (with `@vitejs/plugin-react` and `@tailwindcss/vite`)
- **Styling**: Tailwind CSS v4, dynamic CSS custom properties (`var(--color-*)`)
- **Icons**: Lucide React (`lucide-react`)
- **Animation**: Motion (`motion`)
- **Language**: TypeScript 5.7+
- **Persistence**: Browser `localStorage` (key: `schlar_school_data_v1`) with simulated latency and benchmark demo reset

---

## Getting Started

### Prerequisites

- Node.js 20+ / Bun 1.1+
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

### Installation & Execution

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript type check and linter
npm run lint

# Compile production bundle
npm run build
```

---

## How to Access & Demonstrate Workspaces

1. **Landing & Role Grid**: Open the application at `http://localhost:3000`. The home page displays the institutional hero, the 10-role selector grid, the theme gallery, and the custom token editor.
2. **Accessing Workspaces**:
   - Click any role card (e.g., Admin, Accountant, Librarian) to launch its workspace directly.
   - Clicking **Parent** immediately opens the dedicated simulated mobile phone shell.
   - Clicking **Teacher** opens a platform selection modal to choose between the **Web Portal** or the **Mobile App**.
3. **Switching Roles On-the-Fly**: Use the header role switcher dropdown in the top application bar (`Role: <Name>`) to switch between workspaces.
4. **Quick Navigation (Global Search)**: Press `Cmd + K` or `Ctrl + K` to trigger the search modal and filter through modules, students, and institutional records.
5. **Theme Switching**: Switch between 12 institutional palettes in the Theme Gallery or open the Theme Editor to customize any HEX value.
6. **Resetting Demo Data**: Click **Reset Demo** in the top header or in the user profile menu to restore the benchmark fictional dataset across all 10 roles.

---

## Documentation Index

- [Architecture & Token System](docs/ARCHITECTURE.md)
- [Roles & Permissions (RBAC)](docs/ROLES_AND_PERMISSIONS.md)
- [Demo Data & Entity Relationships](docs/DEMO_DATA.md)
- [Testing & Quality Assurance](docs/TESTING.md)
- [Known Limitations & Production Roadmap](docs/LIMITATIONS.md)

---

## License

Demonstration Project for Greenfield International School Operations.
All fictional data, student names, and credentials are provided strictly for evaluation purposes.
