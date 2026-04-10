<div align="center">
<br/>
<img src="./preview/logo.png" alt="Ticikitify Logo" width="110" />
<br/><br/>
🎟️ Ticikitify
An enterprise-grade, full-stack event discovery and ticketing management platform.
<br/>
https://react.dev/
https://www.typescriptlang.org/
https://vitejs.dev/
https://nodejs.org/
https://expressjs.com/
https://www.mongodb.com/
https://tailwindcss.com/
https://www.framer.com/motion/
<br/>
https://cloudinary.com/
https://sslcommerz.com/
https://sendgrid.com/
./LICENSE
</div>
📖 Table of Contents
Overview
Academic Context
Platform Previews
Tech Stack
Enterprise Security Architecture
Getting Started
Environment Variables
Project Structure
Development Team
🌐 Overview
Ticikitify is a massively scalable, full-stack MERN application that bridges the gap between Event Organizers and Customers. Built as the capstone project for Software Development – III at AUST, it demonstrates real-world application of every layer of modern web engineering:
Table
What it does	How it does it
⚡ Race-condition-free ticket sales	MongoDB atomic $inc operators
💳 Secure payment processing	SSLCommerz cryptographic webhook validation
📊 Live organizer analytics	Interactive revenue dashboards with promo-code math
📱 Mobile-first responsive UI	2-column masonry grid with Tailwind breakpoints
🔐 Enterprise auth & sessions	JWT interception, rate limiting, token countdowns
🖼️ Dynamic image delivery	Cloudinary FormData pipelines with storage rollback
Societal Alignment: Ticikitify addresses event accessibility and economic participation — directly supporting SDG 4 (Technical Education) and SDG 8 (Reducing Unemployment) as stated in the course rationale.
🖼️ Platform Previews
📂 Place your screenshots inside a /preview/ folder at the project root, matching the filenames below exactly — they will render automatically here.
🔑 1. Auth Hub — Login, Register & Email Verification, Forgotten Password Flow
<img width="1919" height="884" alt="image" src="https://github.com/user-attachments/assets/54712104-9d01-4a5b-b87c-dd884789bc60" />

Reactive conditional rendering with password hashing and a live 60-second visual countdown synced to a NodeMailer token expiration window. Users cannot proceed without completing email verification within the time window.
🔓 2. Forgotten Password Flow
<img width="1919" height="884" alt="image" src="https://github.com/user-attachments/assets/417b482f-0690-47ca-ac95-f873802f1d37" />

A secure dual-window UI: a 1-minute email verification link followed by a strictly tracked 5-minute MongoDB timing window to update the encrypted password string. Both windows are enforced server-side.
🏠 3. Ticket Discovery Homepage — Events Grid
<img width="1919" height="890" alt="image" src="https://github.com/user-attachments/assets/c0271914-058d-4b25-b3b4-70b833bae917" /><img width="1912" height="887" alt="image" src="https://github.com/user-attachments/assets/6c426001-6449-443c-9c0f-be98e8e0996e" />
<img width="1919" height="886" alt="image" src="https://github.com/user-attachments/assets/38773c3b-81fa-410a-ad6c-fbd2665c436a" />


A flawlessly responsive masonry grid that scales desktop multi-columns into tight, perfectly padded dual-cards for vertical mobile scrolling. Includes dynamic Admin "Trending" toggles visible only to privileged accounts.
🎫 4. Event Details & SSLCommerz Checkout Modal
./preview/event-details.png
Displays rich Cloudinary-hosted event metadata. Enables Ticket Tier selection (General, VIP), cross-referenced Organizer Promo Code validation, and cryptographic SSLCommerz checkout session initiation — all within a single modal flow.
🛡️ 5. Admin Master Portal
./preview/admin-portal.png
A restricted, platform-wide analytics dashboard. Admins have direct oversight of all user accounts, account banning controls, trending toggle parameters, and maximum inventory limit configurations.
📈 6. Organizer Revenue Dashboard
./preview/organizer-dashboard.png
A fully mapped, interactive table UI. Organizers can track sales volume, analyze Promo Code usage math, view per-tier breakdowns, and deploy new events via multipart FormData browser uploads — all in one place.
🏢 7. Corporate Static Pages — About, Contact, Careers & Help Center
./preview/static-pages.png
Deep enterprise layouts built with a geometrically structured, fully responsive master Footer. All pages are connected via React Router DOM's client-side routing with zero full-page reloads.
🛠️ Tech Stack
Frontend
Table
Technology	Version	Purpose
React	18	Core UI framework with concurrent rendering
TypeScript	5	Strict type safety across all components and API contracts
Vite	Latest	Lightning-fast build tooling and Hot Module Replacement
Tailwind CSS	Latest	Utility-first responsive styling and masonry grid layouts
Framer Motion	Latest	Fluid animations, page transitions, and micro-interactions
React Router DOM	v6	Client-side routing and nested layout navigation
React Context API	Built-in	Global state management for Auth, Cart, and UI state
Backend
Table
Technology	Version	Purpose
Node.js	≥ 18	Non-blocking I/O runtime
Express.js	Latest	RESTful API framework with middleware architecture
Mongoose	Latest	MongoDB ODM with schema validation and data modelling
MongoDB	Latest	Document database for events, users, tickets, and transactions
Third-Party Services & Integrations
Table
Service	Purpose
Cloudinary	Secure image hosting via FormData pipelines with orphan-cleanup rollback
SSLCommerz-LTS	Cryptographically validated payment gateway with val_id webhook signatures
SendGrid / Nodemailer	SMTP transactional email for verification tokens and password resets
express-rate-limit	Brute-force protection on all authentication endpoints
🔐 Enterprise Security Architecture
Ticikitify is engineered with a defence-in-depth philosophy. Each layer of the stack is independently hardened against real-world attack vectors.
⚛️ 1. Atomic Transactions — Zero Race Conditions
The problem: Two users attempting to buy the last available ticket at the exact same microsecond.
Ticikitify uses MongoDB's $inc operator with a conditional filter, making ticket inventory decrements atomic at the database level — no application-layer locking or queues required. The database mathematically grants the ticket to the first request and rejects the second with a Sold Out error. Overselling is mathematically impossible.
JavaScript
Copy
// Atomic inventory decrement — guaranteed no double-sell
await Event.findOneAndUpdate(
  { _id: eventId, availableTickets: { $gt: 0 } },  // Conditional gate
  { $inc: { availableTickets: -quantity } },         // Atomic decrement
  { new: true }
);
// If null is returned → ticket was already sold to someone else
💳 2. Cryptographic Payment Validation
The problem: A malicious actor forging a "Payment Success" webhook payload to claim free tickets.
Every SSLCommerz webhook is validated using val_id signature verification before any ticket fulfilment logic is triggered. Forged payloads are cryptographically rejected at the gateway layer — they never touch order creation or inventory.
🚦 3. Rate Limiting & Brute-Force Protection
All authentication routes are protected by express-rate-limit:
plain
Copy
Strategy : 15 requests maximum per 5-minute window, per IP address
Scope     : /api/auth/login, /api/auth/register, /api/auth/forgot-password
Response  : HTTP 429 Too Many Requests on breach
This eliminates credential-stuffing bots and brute-force dictionary attacks from reaching the database entirely.
🔑 4. Global JWT Interception (Frontend)
A global Axios 401 interceptor monitors every outgoing API response. On detecting an expired or tampered JWT:
The auth token is immediately wiped from memory and context state.
The React component tree is cleanly unmounted.
The user is redirected to the login screen — no stale user data, no ghost sessions.
TypeScript
Copy
// Global 401 interceptor — catches expired tokens platform-wide
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthState();        // Wipes context + memory
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
🗄️ 5. Mongoose Data Capping & Storage Rollbacks
All database list fetches are hard-capped with .limit(500) to prevent Node.js out-of-memory crashes under heavy traffic bursts.
If an organizer event upload fails Mongoose validation, the backend catch block immediately fires deleteFromCloudinary() to permanently destroy the already-uploaded image — preventing silent Cloudinary storage leaks from incomplete writes.
JavaScript
Copy
try {
  const event = await Event.create(eventData); // May throw ValidationError
} catch (err) {
  if (cloudinaryPublicId) {
    await deleteFromCloudinary(cloudinaryPublicId); // Storage rollback
  }
  throw err;
}
🚀 Getting Started
Prerequisites
Make sure you have the following installed before proceeding:
Node.js >= 18.x — Download
npm >= 9.x (bundled with Node.js)
MongoDB — local instance or MongoDB Atlas free tier
Active accounts for: Cloudinary, SSLCommerz, SendGrid or Gmail SMTP
Step 1 — Clone the Repository
bash
Copy
git clone https://github.com/faysaliqbal007/Ticikitify
cd ticikitify
Step 2 — Install Dependencies
Frontend (/app):
bash
Copy
cd app
npm install
Backend (/server):
bash
Copy
cd ../server
npm install
Step 3 — Configure Environment Variables
Create .env files in both /app and /server using the templates in the Environment Variables section below.
⚠️ Both .env files are listed in .gitignore — never commit secrets to version control.
Step 4 — Start the Development Servers
Open two separate terminals and run:
Terminal 1 — Frontend (runs on http://localhost:5173):
bash
Copy
cd app
npm run dev
Terminal 2 — Backend (runs on http://localhost:5000):
bash
Copy
cd server
npm run server
The React dev server proxies API requests to Express automatically via the Vite config.
🔑 Environment Variables
/server/.env
env
Copy
# ── Database ────────────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ticikitify

# ── Authentication ───────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_signing_key

# ── Cloudinary ───────────────────────────────────────────
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# ── SSLCommerz Payment Gateway ───────────────────────────
SSL_STORE_ID=your_sslcommerz_store_id
SSL_STORE_PASS=your_sslcommerz_store_password

# ── Email / SMTP ─────────────────────────────────────────
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=no-reply@ticikitify.com
/app/.env
env
Copy
VITE_API_BASE_URL=http://localhost:5000/api
📁 Project Structure
plain
Copy
ticikitify/
│
├── app/                            # ⚛️  React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components (cards, modals, grid)
│   │   ├── context/                # React Context — Auth state, Cart state
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Auth/               # Login, Register, Verify, ForgotPassword
│   │   │   ├── Home/               # Event discovery masonry grid
│   │   │   ├── EventDetails/       # Ticket tier selection + checkout modal
│   │   │   ├── Admin/              # Admin master portal
│   │   │   ├── Organizer/          # Revenue dashboard + event upload
│   │   │   └── Static/             # About, Contact, Careers, Help Center
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # Axios instance + global 401 interceptor
│   │   └── utils/                  # Helpers, formatters, validators
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── server/                         # 🟢  Node.js + Express backend
│   ├── controllers/                # Route business logic
│   ├── middleware/                  # Auth guards, rate limiters, error handlers
│   ├── models/                     # Mongoose schemas (User, Event, Ticket, Order)
│   ├── routes/                     # Express router definitions
│   ├── services/                   # Cloudinary, SSLCommerz, Nodemailer wrappers
│   └── server.js                   # Entry point
│
├── preview/                        # 📸  README screenshot assets
│   ├── auth-hub.png
│   ├── forgot-password.png
│   ├── homepage.png
│   ├── event-details.png
│   ├── admin-portal.png
│   ├── organizer-dashboard.png
│   └── static-pages.png
│
└── README.md
👥 Development Team
<div align="center">
<table>
  <thead>
    <tr>
      <th>👤 Member</th>
      <th>🎯 Role</th>
      <th>🔧 Key Contributions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>M.M. Faysal Iqbal</b></td>
      <td>🧠 Backend & Systems Architect</td>
      <td>
        Built the Express/Mongoose core API, engineered SSLCommerz cryptographic payment webhooks (<code>val_id</code> validation), implemented all Cloudinary FormData pipelines, and hardened the entire security layer — JWT handlers, rate limiters, and memory-protection middleware.
      </td>
    </tr>
    <tr>
      <td><b>Nahid Hasan Nafi</b></td>
      <td>🎨 Frontend Gatekeeper & Layout Modeler</td>
      <td>
        Designed the deep structural static layouts (master Footer, About, Contact, Careers, Help Center), engineered the global Axios 401 interceptors, formulated the reactive UI auth countdowns, and expanded the full Admin dashboard functionality.
      </td>
    </tr>
    <tr>
      <td><b>Ishraq Alam Khan</b></td>
      <td>🎫 Frontend Product & Ticketing Interface</td>
      <td>
        Engineered the Organizer Revenue dashboards with promo-code analytics, handled complex ticket-tier mapped arrays, restructured Cloudinary dynamic visual rendering, and perfected the 2-column masonry grid responsive scaling for mobile devices.
      </td>
    </tr>
  </tbody>
</table>
</div>
<div align="center">
📚 Learning Resources Used
https://www.w3schools.com/mongodb/index.php
https://www.w3schools.com/nodejs/
https://www.w3schools.com/REACT/default.asp
<br/>
<br/>
Made with ❤️ by the Ticikitify Team
</div>
