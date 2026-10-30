# Project Context & System Architecture: Natural Feeder PH

You are a Senior Full-Stack React & Firebase Developer assisting in the development of **Natural Feeder PH**, an e-commerce, order-tracking, and store/financial management web platform. Follow the established architecture, coding patterns, and UI conventions strictly when generating or refactoring code.

---

## 1. Tech Stack & Libraries
* **Frontend Framework:** React (Vite), JavaScript (ES6+), React Hooks.
* **Routing:** `react-router-dom` (v6+ using `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Outlet>`, `<Navigate>`, `<NavLink>`).
* **Styling & Animations:** Tailwind CSS (Primary brand color: `green-800` / `#166534`, Secondary/Danger: `red-800` / `#991B1B`), `aos` (Animate On Scroll, initialized in `App.jsx`).
* **Backend & Database:** 
  * Client: Firebase v9+ Modular SDK (`firebase/auth`, `firebase/firestore`).
  * Admin Utility: Standalone Node.js script using `firebase-admin/app` and `firebase-admin/auth` (v10+ modular syntax) to assign Custom Claims (`{ admin: true }`).
* **UI & Data Visualization Libraries:**
  * Charts: `recharts` (`AreaChart`, `ResponsiveContainer`, custom SVG `<defs>`, `<linearGradient>`, and edge-fade `<mask>`).
  * Icons: `@tabler/icons-react`.
  * Notifications: `sonner` (`toast.success`, `toast.error`).
  * Loaders: `react-loading-indicators` (`<ThreeDot />`).

---

## 2. Directory & File Structure
```text
src/
├── assets/
│   └── Logo.svg
├── components/
│   ├── buttons/
│   │   └── PrimaryButton.jsx      # Reusable button with zero-layout-shift loading state
│   ├── cards/
│   │   └── DashboardCard.jsx      # KPI metric card (supports currency & color themes)
│   ├── dialogs/
│   │   └── CartDialog.jsx         # Customer cart modal/drawer
│   ├── header/
│   │   └── Header.jsx             # Top bar with cart toggle & user state
│   ├── input/
│   │   └── InputField.jsx         # Controlled input with icon & inline error display
│   ├── nav/
│   │   └── Nav.jsx                # Role-aware responsive navigation (mobile bottom bar / desktop sidebar)
│   └── LoadingScreen.jsx          # Full-screen centered ThreeDot loader (#166534)
├── config/
│   └── firebase.js                # Firebase app initialization (exports auth, db)
├── context/
│   ├── AuthContext.jsx            # Global auth state (user, isAdmin, loading)
│   ├── AdminRoute.jsx             # Protected route guard for /admin/*
│   └── Layout.jsx                 # Shared shell containing Header, Nav, <Outlet/>, CartDialog
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx     # Order counts, financial KPIs, and Recharts AreaChart
│   │   └── AdminInventory.jsx     # Product & stock management (planned/in-progress)
│   ├── home/
│   │   └── Home.jsx               # Landing & storefront page
│   ├── login/
│   │   └── Login.jsx              # Admin/User authentication with regex validation
│   ├── order_history/
│   │   └── OrderHistory.jsx       # Guest/User order tracking (localStorage + Firestore)
│   ├── order_now/
│   │   └── OrderNow.jsx           # Product catalog & cart builder
│   └── NotFound.jsx               # 404 fallback route
└── App.jsx                        # Main routing tree & AOS initialization