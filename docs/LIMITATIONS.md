# SCHLAR System Limitations & Production Roadmap

This document provides transparent technical disclosures regarding the demonstration nature of SCHLAR and details the engineering roadmap required for a full enterprise cloud deployment.

---

## 1. Architectural & Demonstration Disclosures

### A. Frontend-Only Architecture
- SCHLAR is engineered as a high-fidelity client-side Single Page Application (SPA).
- **Current Behavior**: State changes are managed in-memory via React Context and serialized to the user's browser `localStorage` (`schlar_school_data_v1`).
- **Limitation**: Data does not synchronize across separate physical devices or browsers. If a user clears their browser cache or uses Incognito mode, the initial benchmark dataset will be reloaded.

### B. Client-Side Role & Permission Enforcement
- **Current Behavior**: UI components, navigation tabs, actions, and data filters use an internal role-based capability matrix (`PermissionContext.tsx`).
- **Limitation**: While client-side enforcement prevents UI misconfiguration and demonstrates authorization rules, it does **not** replace server-side token authentication (JWT, OAuth 2.0, or mTLS). A tech-savvy user inspecting client memory could alter JavaScript state.

### C. Simulated Financial & Payment Processing
- **Current Behavior**: The Accountant workspace and Parent fee modules simulate invoice creation, credit note adjustments, split-payment recording, and formal numbered voucher generation.
- **Limitation**: No live credit card merchant accounts, Stripe/PayPal webhooks, or banking Automated Clearing House (ACH) integrations exist. All payments and receipts are fictional records.

### D. Simulated Telephony & Communication Dispatch
- **Current Behavior**: When announcements are broadcast or attendance absence alerts are triggered, notifications populate the in-app `NotificationDrawer` and role badges.
- **Limitation**: SCHLAR does not dispatch real external SMS messages (Twilio) or transactional emails (SendGrid / Amazon SES).

### E. Biometric & Barcode Hardware Emulation
- **Current Behavior**: Library loan desks, visitor gate passes, and HR timesheets render realistic 1D/2D barcodes, QR passes, and check-in logs.
- **Limitation**: Scanning is driven by software search inputs and pre-seeded asset tags rather than physical laser scanner hardware drivers.

---

## 2. Production Cloud Engineering Roadmap

To transition SCHLAR from an interactive frontend demonstration to an enterprise cloud school platform:

1. **Backend API Microservices**:
   - Build a Node.js / Go backend with RESTful or GraphQL endpoints matching the schemas in `src/types/`.
   - Implement PostgreSQL / Cloud SQL for ACID transactional integrity on fee balances and grade transcripts.

2. **Authentication & Identity Management**:
   - Integrate OpenID Connect / SAML 2.0 with institutional identity providers (Google Workspace for Education, Microsoft Entra ID).
   - Implement cryptographically signed HttpOnly JWT session cookies with refresh token rotation.

3. **Multi-Tenant Campus Partitioning**:
   - Enforce row-level security (RLS) in PostgreSQL partitioned by `school_id` and `academic_year_id`.

4. **Native Mobile Shell Packaging**:
   - Package `ParentMobileShell.tsx` and `TeacherMobileShell.tsx` using Capacitor / React Native for distribution via Apple App Store and Google Play Store with APNs / FCM push notifications.

5. **Payment Gateway Integration**:
   - Connect Stripe Connect or Adyen for multi-party tuition payment splitting, automated recurring direct debits, and real PCI-DSS compliance.
