# ABES Mess Coupon System 🍲

An enterprise-grade, modern, and responsive **Frontend-Only Web Application** designed for the hostel dining community at **ABES Engineering College, Ghaziabad**. Built for the Full Stack Development (FSD) Capstone Demonstration.

---

## 🚀 Live Demo Quick Login Credentials

No manual typing required — click any of the **Try Demo** buttons on the landing page or use the autofill chips on the Login screen:

| Role | Email | Password | Persona & Responsibility |
| :--- | :--- | :--- | :--- |
| **Student** | `aditi.24b0101070@abes.ac.in` | `student123` | Aditi (Roll: 24B0101070, CSE, Hosteller). Books meal slots, views rotating anti-fraud QR, tracks meal balance, skips meals. |
| **Staff Counter** | `staff@abes.ac.in` | `staff123` | Ramesh Kumar (Counter 1 - Main Hall). Scans student QR passes via camera or simulation panel, marks coupons used, serves meals. |
| **Mess Manager**| `manager@abes.ac.in`| `manager123` | Mrs. Sunita Verma (Dining In-Charge). Edits weekly thali menus, views portion cooking forecasts (booked × 1.05), resolves student tickets. |
| **Administrator**| `admin@abes.ac.in` | `admin123` | Prof. R.K. Sharma (Chief Warden). User directory controls, plan pricing, anti-fraud policies, reset demo data. |

---

## 🎯 Key Problems Solved

1. **Elimination of Long Physical Queues**: Students pre-book dining time slots (e.g. `12:30 - 13:00`, `13:00 - 13:30`) with live capacity feedback to spread dining hall rush evenly.
2. **Rotating Anti-Fraud QR Pass**: Dynamic cryptographic QR token (`ABES|<couponId>|<studentId>|<mealId>|<timestamp>|<random>`) auto-refreshes every 60 seconds with an animated countdown ring, making screenshot sharing completely impossible.
3. **Food Wastage Reduction (Kitchen Guidance)**: Students can opt-out / skip meals before cut-off (e.g., 11:00 AM for lunch). Kitchen manager dashboard computes exact target portions (`booked × 1.05 buffer`), saving hundreds of kilograms of food each month.
4. **Instant Counter Verification**: Staff scans QR codes in under 1 second with audio/vibration feedback (`VALID`, `ALREADY USED`, `EXPIRED`, `NOT BOOKED`). Includes an interactive **Simulation Panel** for instant testing without camera permissions.
5. **Real-time Cross-Tab Synchronization**: When counter staff marks a coupon as `Used` in one tab, the student's open pass tab updates in real-time to a stamped `SERVED` state.

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 18 + Vite (JavaScript)
- **Routing**: React Router v6 (`react-router-dom`) with role-based `ProtectedRoute` guards
- **Styling**: Tailwind CSS v3 with custom design tokens:
  - Deep Navy: `#0F1B33`, `#1F3A5F`, `#0A1222`
  - Saffron Orange: `#FF7A1A`, `#FFE9D6`, `#E6680D`
  - Functional: Success (`#16A34A`), Danger (`#DC2626`), Warning (`#F59E0B`)
- **Animations & Micro-interactions**: Framer Motion (`framer-motion`)
- **Icons**: Lucide React (`lucide-react`)
- **QR Engine**: `qrcode.react` (SVG & Canvas high-contrast render)
- **Camera Scanner**: `html5-qrcode` with graceful permission fallback
- **Data Visualizations**: Recharts (`recharts`)
- **Celebration & Sound**: `canvas-confetti` + Web Audio API synthesizer chimes
- **Typography**: Google Fonts **Poppins** (headings) & **Inter** (body)
- **State & Persistence**: React Context (`AuthContext`, `DataContext`, `ThemeContext`) backed by `localStorage` persistence and cross-tab event broadcasting

---

## 📂 Folder Structure

```
abes-mess-coupon-system/
├── index.html                     # HTML shell with Google Fonts & Meta tags
├── package.json                   # Dependencies and build scripts
├── vite.config.js                 # Vite configuration with optimized vendor chunks
├── tailwind.config.js             # Theme tokens, colors, custom shadows
├── postcss.config.js              # PostCSS plugins (Tailwind & Autoprefixer)
├── public/                        # Public assets
└── src/
    ├── main.jsx                   # Entry point with Theme, Auth, Data providers
    ├── App.jsx                    # Route table and global Toaster
    ├── index.css                  # Tailwind directives and custom scrollbars
    ├── context/
    │   ├── AuthContext.jsx        # Session management & role checks
    │   ├── DataContext.jsx        # Cross-tab sync, bookings, and notifications
    │   └── ThemeContext.jsx       # Light / Dark mode toggle state
    ├── services/
    │   └── mockApi.js             # Backend-ready REST service layer (300-600ms latency)
    ├── data/
    │   ├── users.js               # 12+ realistic Indian student, staff & admin profiles
    │   ├── plans.js               # Monthly, Weekly & Pay-per-meal plans
    │   ├── menu.js                # 7 days x 4 meals with realistic Indian recipes
    │   ├── bookings.js            # Seed bookings for today & tomorrow
    │   ├── history.js             # 25+ past meal records & logs
    │   ├── notifications.js       # 10 contextual notifications
    │   ├── feedback.js            # 15 reviews and complaint tickets
    │   └── stats.js               # 30-day analytics metrics for charts
    ├── utils/
    │   ├── constants.js           # App constants & meal timings
    │   ├── formatDate.js          # Date, time, and currency formatters
    │   └── generateToken.js       # Anti-fraud 60s QR token generator
    ├── components/
    │   ├── layout/                # Navbar, Sidebar, DashboardLayout, Footer, ProtectedRoute
    │   ├── ui/                    # Button, Card, Badge, Modal, Tabs, StatCard, Skeleton, Stepper, Toggle
    │   └── features/              # QRCoupon, MealCard, PlanCard, CrowdMeter, ScanResult, RatingStars, Confetti
    └── pages/
        ├── public/                # Landing, Login, Register, ForgotPassword, NotFound
        ├── student/               # Dashboard, Menu, Coupon, History, Plans, Feedback, Profile, Notifications
        ├── staff/                 # Scanner (Camera + Simulator), ServedToday
        ├── manager/               # MenuEditor, Bookings, Reports, FeedbackReview
        └── admin/                 # Dashboard, Users, Plans, Settings
```

---

## 🔌 Mock API Mapping to Future Backend Endpoints

Every data access in the application is routed through `src/services/mockApi.js`. When transitioning to a production Node.js + Express backend, replace these functions with real `fetch` or `axios` calls:

| `mockApi.js` Function | Future REST API Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- |
| `login(email, pass)` | `/api/auth/login` | `POST` | Authenticates user and returns JWT |
| `register(data)` | `/api/auth/register` | `POST` | Creates new student account |
| `getCurrentUser()` | `/api/auth/me` | `GET` | Fetches session profile |
| `getPlans()` | `/api/plans` | `GET` | Fetches available subscription packages |
| `buySubscription(id, p)`| `/api/subscriptions/buy` | `POST` | Credits meals to student account |
| `getMenu(day)` | `/api/menu` | `GET` | Returns 7-day menu with calories |
| `updateDish(id, data)` | `/api/menu/dishes/:id` | `PUT` | Updates recipe or cutoff times |
| `bookMeal(userId, b)` | `/api/bookings` | `POST` | Reserves meal dining slot |
| `skipMeal(userId, id)` | `/api/bookings/:id/skip` | `PATCH` | Student meal opt-out |
| `verifyCoupon(token)` | `/api/coupons/verify` | `POST` | Counter barcode verification & balance debit |
| `getHistory(userId)` | `/api/students/:id/history` | `GET` | Returns past meal logs |
| `submitFeedback(data)` | `/api/feedback` | `POST` | Submits dish rating or complaint ticket |
| `replyComplaint(id, r)`| `/api/feedback/tickets/:id`| `PATCH` | Manager response on complaint |
| `getReportsSummary()` | `/api/analytics/reports` | `GET` | Computes wastage & rush metrics |
| `resetDemoData()` | `/api/admin/reset` | `POST` | Restores default seed database |

---

## 🏃 Setup & Execution Commands

### Prerequisites
- Node.js version 18 or higher (tested on Node v24.18.1)
- npm version 9 or higher

### Development Server
```bash
# 1. Install dependencies (already installed in workspace)
npm install

# 2. Run local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Preview
```bash
# Build production bundle with optimized chunking
npm run build

# Preview production build locally
npm run preview
```

---

## 🔮 Future Scope (Phase 2 Roadmap)
1. **Node.js + PostgreSQL Backend**: Replace `mockApi.js` with microservices running on Express and Prisma ORM.
2. **Turnstile Hardware Integration**: Connect USB barcode scanner and Raspberry Pi automated gate barrier.
3. **Push Notifications**: Integrate Firebase Cloud Messaging (FCM) for 30-minute booking deadline alerts.
4. **Biometric Backup**: Facial recognition counter backup for students who forget their phones.
