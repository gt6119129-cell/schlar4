# SCHLAR Demo Data & Entity Architecture

Greenfield International School is seeded with interconnected, realistic fictional records ensuring that actions taken in one role workspace seamlessly reflect across other workspaces.

---

## 1. Core Entity Models & Stable Identifiers

### Academic Structure
- **Institution**: Greenfield International School (CBSE / International Baccalaureate curriculum alignment)
- **Academic Year**: 2026–2027 (Term 1: Aug–Dec, Term 2: Jan–May)
- **Grade Levels**:
  - `class-6` (Grade 6)
  - `class-7` (Grade 7)
  - `class-8` (Grade 8)
  - `class-9` (Grade 9)
  - `class-10` (Grade 10)
  - `class-11` (Grade 11 - Science & Commerce streams)
  - `class-12` (Grade 12 - Senior Secondary)
- **Class Sections**:
  - `sec-8a` (Grade 8-A, Room 204, Teacher: Ms. Sarah Henderson)
  - `sec-9b` (Grade 9-B, Room 302, Teacher: Mr. David Miller)
  - `sec-10a` (Grade 10-A, Room 401, Teacher: Dr. Angela Cooper)
- **Campuses & Rooms**:
  - `room-204` (Main Academic Block, Floor 2, Capacity 36)
  - `room-stem-a` (STEM Science Wing, Floor 1, Capacity 32)
  - `room-lib-main` (East Reading Wing, Capacity 120)

### Key Personnel Identifiers
- **Principal**: Dr. Arthur Vance (`staff-vance`)
- **Vice Principal**: Mrs. Catherine Ward (`staff-ward`)
- **Key Demo Teacher**: Ms. Sarah Henderson (`staff-henderson`) — Subject: Mathematics & General Science; Assigned Sections: `sec-8a`, `sec-9b`, `sec-10a`.
- **Senior Science Lead**: Mr. David Miller (`staff-miller`)
- **Accountant**: Mr. Jonathan Sterling (`staff-sterling`)
- **HR Manager**: Mrs. Miriam Patel (`staff-patel`)
- **Librarian**: Mrs. Eleanor Vance (`staff-el-vance`)
- **Transport Manager**: Mr. Robert Gallagher (`staff-gallagher`)
- **Lead Receptionist**: Ms. Chloe Bennett (`staff-bennett`)
- **Exam Coordinator**: Mr. Marcus Chen (`staff-chen`)

### Key Demo Students & Linked Guardians
- **Student `stu-001`**: Leo Henderson (Grade 8-A, Admission #GIS-2024-0812)
  - Linked Guardian: Mrs. Sarah Henderson (`par-001`, Phone: `+1 (555) 234-5678`)
  - Transport Assignment: Route 1 (North Suburbs Corridor, Bus #09)
  - Library Card: `LIB-STU-001`
  - Fee Account: Billed $4,200 / Paid $4,200 (Balance: $0.00)
- **Student `stu-002`**: Maya Henderson (Grade 6-B, Admission #GIS-2026-0619)
  - Linked Guardian: Mrs. Sarah Henderson (`par-001`) — Demonstrates multi-child switching in Parent App!
  - Fee Account: Billed $3,800 / Paid $3,800
- **Student `stu-003`**: Ethan Martinez (Grade 10-A, Admission #GIS-2023-1004)
  - Guardian: Mr. Carlos Martinez
  - Transport Assignment: Route 3 (West Valley Line, Bus #14)

---

## 2. Relational Cross-Role Data Graph

```text
[Guardian: par-001]
       │
       ├── Linked To ──> [Student: Leo Henderson (stu-001)]
       │                        │
       │                        ├── Enrolled in ──> [Section: Grade 8-A]
       │                        │                        │
       │                        │                        └── Taught by ──> [Teacher: Ms. Henderson]
       │                        │                                               │
       │                        │                                               └── Period Roll Call (P1-P6)
       │                        ├── Assigned to ──> [Bus Route: North Suburbs]
       │                        │                        │
       │                        │                        └── Managed by ──> [Transport: Gallagher]
       │                        ├── Member of ────> [Library Card: LIB-STU-001]
       │                        │                        │
       │                        │                        └── Issued by ───> [Librarian: Vance]
       │                        └── Account ──────> [Fee Ledger: Term 1 Tuition]
       │                                                 │
       │                                                 └── Audited by ──> [Accountant: Sterling]
       │
       └── Linked To ──> [Student: Maya Henderson (stu-002)] (Child Switcher Verification)
```

---

## 3. Data Persistence & Lifecycle

1. **LocalStorage Mechanism**:
   - Master data is stored under the JSON key `schlar_school_data_v1`.
   - On initial app boot, if the storage key is absent, the system hydrates from the seed constants (`INITIAL_*`).
   - Every state change (creating a student, saving attendance, recording a fee payment) synchronously serializes back to `localStorage`.

2. **Benchmark Demo Reset**:
   - Both the top header and the user profile menu include a **Reset Demo** trigger.
   - Invoking `resetAllSchoolDataToDefaults()` prompts for confirmation, wipes browser overrides, and resets the application back to the pristine state.
   - Unrelated theme settings (such as custom saved color palettes stored in `schlar_custom_palettes_v1`) are safely preserved.

3. **Fictional Data Limitations**:
   - All student, staff, and guardian records are synthetic.
   - Financial transactions and receipt numbers do not interface with real merchant gateways or banking ACH systems.
   - SMS and email notification logs simulate delivery internally without consuming external telephony APIs.
