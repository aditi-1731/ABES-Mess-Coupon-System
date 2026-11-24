# ABES Mess Coupon System 🍲

## About the Project

The ABES Mess Coupon System is a web application that replaces paper coupons and long queues at the college mess with a digital, QR-based process. A student books a meal, gets a QR coupon on their phone, and shows it at the counter. Mess staff scan it, the system confirms it instantly, and the student collects food without waiting in a coupon line.

**Who it is for:** students (hostellers and day scholars), mess counter staff, the mess manager and the college administration of ABES Engineering College, Ghaziabad.

## Problems It Solves

1. **Long queues at the mess:** students pre-book a dining time slot (e.g. `12:30 - 13:00`) with live capacity bars, which spreads the lunch and dinner rush.
2. **Lost, duplicated or misused paper coupons:** each digital coupon is tied to one student and one meal, and it can be used only once.
3. **Coupon sharing through screenshots:** the QR code refreshes every 60 seconds with a countdown ring, so an old screenshot stops working. In this prototype, the check is done in the browser; the final version will verify tokens on the server.
4. **Food wastage:** students can skip a meal before the cut-off time, and the manager's dashboard suggests how much to cook (`booked × 1.05`).
5. **No record of meal consumption:** every scan, booking and skip is stored, and the manager and admin get charts and CSV reports.
6. **No structured feedback:** students can rate dishes and raise complaint tickets that the manager can reply to and resolve.

---

## 🔑 Demo Login Credentials

These are **dummy sample accounts** for testing only. Do not enter real credentials anywhere in this prototype. Click a **Try Demo** button on the landing page, or use the autofill chips on the Login screen.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `aditi.24b0101070@abes.ac.in` | `student123` |
| **Staff Counter** | `staff@abes.ac.in` | `staff123` |
| **Mess Manager** | `manager@abes.ac.in` | `manager123` |
| **Administrator** | `admin@abes.ac.in` | `admin123` |

To hide the demo buttons and chips, set `VITE_DEMO_MODE=false` in the `.env` file and restart the dev server. Keep it `false` for any real deployment.

---

## ✨ Key Features

- Role-based login for Student, Staff, Manager and Admin with protected routes
- Meal plans (monthly, weekly, pay-per-meal) with a mock checkout and receipts
- Weekly menu with meal booking, skip option and time-slot selection
- Rotating QR coupon with fullscreen mode and PNG ticket download
- Staff scanner with camera support and a simulation panel (Valid / Already used / Expired / Not booked) with sound feedback
- Live status sync between browser tabs: when staff mark a coupon used, the student's coupon page updates to **Served** without a refresh
- Manager tools: menu editor, kitchen quantity guidance, charts and feedback desk
- Admin tools: user directory, plan pricing, system settings and demo data reset
- Light and dark mode, responsive layout from 360px mobile to desktop

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 18 + Vite (JavaScript)
- **Routing**: React Router v6 (`react-router-dom`) with role-based `ProtectedRoute` guards
- **Styling**: Tailwind CSS v3 with custom design tokens:
  - Deep Navy: `#0F1B33`, `#1F3A5F`, `#0A1222`
  - Saffron Orange: `#FF7A1A`, `#FFE9D6`, `#E6680D`
  - Functional: Success (`#16A34A`), Danger (`#DC2626`), Warning (`#F59E0B`)
- **Animations**: Framer Motion (`framer-motion`)
- **Icons**: Lucide React (`lucide-react`)
- **QR**: `qrcode.react` (rendering) and `html5-qrcode` (camera scanning with permission fallback)
- **Charts**: Recharts (`recharts`)
- **Celebration & Sound**: `canvas-confetti` + Web Audio API chimes
- **Typography**: Google Fonts Poppins (headings) and Inter (body)
- **State & Persistence**: React Context (`AuthContext`, `DataContext`, `ThemeContext`) with `localStorage` persistence and cross-tab events

---

## 📂 Folder Structure

```
abes-mess-coupon-system/
├── index.html                     # HTML shell with Google Fonts & Meta tags
├── package.json                   # Dependencies and build scripts
├── vite.config.js                 # Vite configuration with optimized vendor chunks
├── tailwind.config.js             # Theme tokens, colors, custom shadows
├── postcss.config.js              # PostCSS plugins (Tailwind & Autoprefixer)
├── .env                           # VITE_DEMO_MODE switch
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
    │   ├── users.js               # Dummy student, staff & admin profiles
    │   ├── plans.js               # Monthly, Weekly & Pay-per-meal plans
    │   ├── menu.js                # 7 days x 4 meals
    │   ├── bookings.js            # Seed bookings for today & tomorrow
    │   ├── history.js             # Past meal records & logs
    │   ├── notifications.js       # Contextual notifications
    │   ├── feedback.js            # Reviews and complaint tickets
    │   └── stats.js               # 30-day analytics metrics for charts
    ├── utils/
    │   ├── constants.js           # App constants & meal timings
    │   ├── formatDate.js          # Date, time, and currency formatters
    │   └── generateToken.js       # 60s QR token generator
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

Every data access in the application goes through `src/services/mockApi.js`. When the Node.js backend is ready, replace these functions with real `fetch` or `axios` calls:

| `mockApi.js` Function | Future REST API Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- |
| `login(email, pass)` | `/api/auth/login` | `POST` | Authenticates user and returns JWT |
| `register(data)` | `/api/auth/register` | `POST` | Creates new student account |
| `getCurrentUser()` | `/api/auth/me` | `GET` | Fetches session profile |
| `getPlans()` | `/api/plans` | `GET` | Fetches available subscription packages |
| `buySubscription(id, p)` | `/api/subscriptions/buy` | `POST` | Credits meals to student account |
| `getMenu(day)` | `/api/menu` | `GET` | Returns 7-day menu with calories |
| `updateDish(id, data)` | `/api/menu/dishes/:id` | `PUT` | Updates recipe or cut-off times |
| `bookMeal(userId, b)` | `/api/bookings` | `POST` | Reserves meal dining slot |
| `skipMeal(userId, id)` | `/api/bookings/:id/skip` | `PATCH` | Student meal opt-out |
| `verifyCoupon(token)` | `/api/coupons/verify` | `POST` | Counter QR verification & balance debit |
| `getHistory(userId)` | `/api/students/:id/history` | `GET` | Returns past meal logs |
| `submitFeedback(data)` | `/api/feedback` | `POST` | Submits dish rating or complaint ticket |
| `replyComplaint(id, r)` | `/api/feedback/tickets/:id` | `PATCH` | Manager response on complaint |
| `getReportsSummary()` | `/api/analytics/reports` | `GET` | Computes wastage & rush metrics |
| `resetDemoData()` | `/api/admin/reset` | `POST` | Restores default seed data |

---

## 🏃 Setup & Execution Commands

### Prerequisites
- Node.js version 18 or higher
- npm version 9 or higher

### Development Server
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔮 Future Scope (Phase 2 Roadmap)
1. **Node.js + PostgreSQL Backend**: Replace `mockApi.js` with a real REST API, JWT authentication and a database.
2. **Server-side QR verification**: Sign and verify QR tokens on the server so coupons cannot be forged or reused.
3. **Real payments**: Connect a payment gateway for plan purchases and wallet top-ups.
4. **Push Notifications**: Firebase Cloud Messaging (FCM) alerts for booking deadlines and menu changes.
5. **Hardware Integration**: USB barcode scanner or automated gate barrier at the counter.

---

## ⚠️ Limitations

- **Frontend only:** there is no backend or database. All data is dummy data stored in the browser's `localStorage`, so it is not shared between devices or browsers and is lost if the browser data is cleared.
- **Not secure yet:** login, passwords, roles and QR tokens are checked in the browser only, and the demo passwords are visible in the code. Do not use real student data or real passwords.
- **Simulated payments:** plan purchases, wallet balance and receipts are mock and no money is processed.
- **Sample statistics:** meal counts, wastage figures, ratings and testimonials in charts and on the landing page are made-up sample values, not real ABES data.
- **Tab sync is local:** live status updates work only between tabs of the same browser on the same device.
- **Camera scanning:** it needs camera permission and works only on `localhost` or HTTPS; use the simulation panel if the camera is unavailable.
- **No real notifications:** alerts are shown inside the app only (no email, SMS or push).
- **Limited testing:** the app was manually tested in a desktop browser; there are no automated tests.

---

## 👤 Author

**Aditi Tripathi**
