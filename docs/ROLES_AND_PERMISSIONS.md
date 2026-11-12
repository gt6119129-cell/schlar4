# SCHLAR Roles and Permission Matrix (RBAC)

SCHLAR strictly enforces **ten institutional roles**. There are no generic "Student" or "Super Admin" roles.

---

## 1. Summary of Ten Roles

| Role | Category | Platform Scope | Primary Operational Responsibility |
| :--- | :--- | :--- | :--- |
| **1. Admin** | Executive Governance | Web Workspace | School-wide institutional configuration, student admissions, timetable generation, fee overviews, and statutory reports. |
| **2. Vice Principal** | Academic Administration | Web Workspace | Academic curriculum pacing, teacher substitute coordination, timetable monitoring, period attendance compliance, and examination moderation. |
| **3. Teacher** | Classroom & Instruction | Web Portal & Mobile App | Daily period attendance matrix (✓/X), homework briefs, grading rubrics, marks entry, and student progress notes. |
| **4. Parent** | Family & Progress | **Mobile App Only** | Ward switcher, attendance calendar, homework checklist, timetable, fee statements, transit alerts, and exam report cards. |
| **5. Accountant** | Finance & Accounts | Web Workspace | Fee structures, student ledger auditing, payment terminal, receipt voucher printing, dues aging analysis, and bank reconciliation. |
| **6. HR Manager** | Human Resources | Web Workspace | Staff directory, employee service profiles, biometric attendance timesheets, leave approvals, recruitment, and qualification vault. |
| **7. Librarian** | Library Resources | Web Workspace | Dewey decimal digital catalogue, physical volume barcode inventory, loan check-out/check-in desks, overdue fines, and reservations. |
| **8. Transport Manager** | Fleet & Logistics | Web Workspace | Route corridors with pickup stops, bus vehicle registry, commercial driver rosters, student boarding allocations, and fleet maintenance. |
| **9. Receptionist** | Front Office | Web Workspace | Visitor gate pass registration, visitor check-in/out, admission inquiries triage, executive appointment booking, and courier dispatches. |
| **10. Exam Coordinator** | Assessment Operations | Web Workspace | Examination calendar, hall ticket generation, desk allocation, teacher marks submission tracking, grade curve preparation, and result release. |

---

## 2. Strict Experience Boundaries

### Parent: Strictly Mobile-App-Only
- **Rationale**: Modern parents interact with school notifications, bus tracking, and attendance alerts on smartphones.
- **Enforcement**:
  - `RoleSelectionGrid.tsx` marks Parent with `Smartphone · Mobile App Only` badge.
  - Clicking Parent directly boots `ParentMobileShell.tsx`.
  - There is no web portal route or toggle for parents.
  - Parents can ONLY view records for their verified linked children (e.g. Leo Henderson, Maya Henderson). Cross-family record access is blocked.

### Teacher: Dual Web and Mobile Experience
- **Web Instructional Portal**: Designed for desktop/laptop in classrooms and staffrooms. Features the **Multi-Period Timetable Grid View** (1 row per student, P1–P6 columns, sticky student columns, fast `✓`/`X` toggling).
- **Faculty Mobile App**: Designed for on-the-go teachers taking quick roll calls or checking today's timetable periods between classrooms.

### Admin vs. Vice Principal Separation
- **Admin**: Has institutional authority to configure terms, fee categories, user permissions, and master settings (`settings.manage`, `fees.manage_structure`, `admissions.manage`).
- **Vice Principal**: Focused strictly on academic and instructional oversight (`timetable.view`, `attendance.approve`, `marks.edit`, `exams.manage`). Vice Principal cannot delete fee tiers or modify school-wide master settings.

---

## 3. Comprehensive Permission Registry

```text
students.view           - View student directory, profiles, and attendance status
students.create         - Register new student admission records
students.edit           - Update student demographic details and section transfers
students.archive        - Archive or issue transfer certificates

staff.view              - View faculty directory, qualifications, and department affiliations
staff.manage            - Create, edit, and approve staff leave requests

attendance.view         - View student attendance registers and summaries
attendance.create       - Record daily period roll call
attendance.edit         - Correct or amend previously committed attendance registers
attendance.approve      - Formally approve attendance registers and medical leaves
attendance.export       - Export attendance records to CSV or state compliance reports

timetable.view          - View weekly instructional schedules and room occupancy
timetable.create        - Generate timetable periods and section slots
timetable.edit          - Modify room allocations and resolve teacher conflicts

assignments.view        - View class homework assignments and briefs
assignments.create      - Dispatch homework and project rubrics
assignments.edit        - Edit assignment deadlines and grading criteria

marks.view              - View assessment scores and student report cards
marks.enter             - Enter formative marks in teacher gradebook
marks.edit              - Moderate marks or adjust grading curves

results.publish         - Formally authorize release of term report cards to parents

fees.view               - View fee structures and student account balances
fees.record_payment     - Record simulated cash, card, or check tuition payments
fees.issue_receipt      - Issue and reprint official payment vouchers
fees.manage_structure   - Configure tuition tiers, installments, and late fee policies
fees.approve_concession - Authorize merit scholarships or hardship fee waivers

library.manage          - Manage book catalogue, loans, returns, reservations, and fines
transport.manage        - Manage bus routes, stops, vehicle maintenance, and driver rosters
admissions.manage       - Triage prospective student inquiries and campus tours
visitors.manage         - Register visitor identities and issue gate passes

announcements.view      - View campus circulars and notices
announcements.create    - Publish targeted announcements to faculty, parents, or staff
messages.view           - View internal campus communications
messages.send           - Send inquiries or replies between faculty and administration

reports.view            - Access operational and departmental analytics
reports.export          - Export filtered reports to CSV/print format
settings.manage         - Configure academic terms, grading scales, and school metadata
permissions.manage      - View and adjust role capability matrices
```

---

## 4. Role-to-Permission Mapping Table

| Permission | Admin | Vice Principal | Teacher | Parent | Accountant | HR Manager | Librarian | Transport | Receptionist | Exam Coord |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `students.view` | ✓ | ✓ | ✓ (assigned) | ✓ (wards) | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `students.create` | ✓ | — | — | — | — | — | — | — | — | — |
| `students.edit` | ✓ | — | — | — | — | — | — | — | — | — |
| `staff.view` | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ | — |
| `staff.manage` | ✓ | — | — | — | — | ✓ | — | — | — | — |
| `attendance.view` | ✓ | ✓ | ✓ | ✓ (wards) | — | ✓ (staff) | — | — | — | — |
| `attendance.create` | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| `attendance.edit` | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| `attendance.approve`| ✓ | ✓ | — | — | — | — | — | — | — | — |
| `timetable.view` | ✓ | ✓ | ✓ | ✓ (child) | — | — | — | — | — | ✓ |
| `timetable.create` | ✓ | ✓ | — | — | — | — | — | — | — | — |
| `fees.view` | ✓ | — | — | ✓ (child) | ✓ | — | — | — | — | — |
| `fees.record_payment`| ✓ | — | — | — | ✓ | — | — | — | — | — |
| `fees.manage_structure`| ✓ | — | — | — | ✓ | — | — | — | — | — |
| `library.manage` | ✓ | — | — | — | — | — | ✓ | — | — | — |
| `transport.manage` | ✓ | — | — | — | — | — | — | ✓ | — | — |
| `visitors.manage` | ✓ | — | — | — | — | — | — | — | ✓ | — |
| `exams.manage` | ✓ | ✓ | — | — | — | — | — | — | — | ✓ |
| `marks.view` | ✓ | ✓ | ✓ | ✓ (child) | — | — | — | — | — | ✓ |
| `marks.enter` | — | — | ✓ | — | — | — | — | — | — | — |
| `results.publish` | ✓ | — | — | — | — | — | — | — | — | ✓ |
| `settings.manage` | ✓ | — | — | — | — | ✓ (dept) | — | — | — | — |
| `permissions.manage`| ✓ | — | — | — | — | — | — | — | — | — |
