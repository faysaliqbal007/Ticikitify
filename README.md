<div align="center">



# 🎟️ Ticikitify

### *An enterprise-grade, full-stack event discovery and ticketing management platform.*

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br/>

[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![SSLCommerz](https://img.shields.io/badge/SSLCommerz-Payment_Gateway-FF6B35?style=for-the-badge)](https://sslcommerz.com/)
[![SendGrid](https://img.shields.io/badge/SendGrid-SMTP_Email-1A82E2?style=for-the-badge&logo=twilio&logoColor=white)](https://sendgrid.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Platform Previews](#-platform-previews)
- [Tech Stack](#-tech-stack)
- [Enterprise Security Architecture](#-enterprise-security-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Highlights](#-api-highlights)
- [Deployment Notes](#-deployment-notes)
- [Project Structure](#-project-structure)
- [Marks & Assessment](#-marks--assessment)
- [Development Team](#-development-team)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌐 Overview

**Ticikitify** is a full-stack event discovery and ticketing platform built with the MERN ecosystem. It connects **Organizers** and **Customers** through a secure, performance-oriented workflow across event publishing, ticket purchases, and operational analytics:

| What it does | How it does it |
|---|---|
| ⚡ Race-condition-free ticket sales | MongoDB atomic `$inc` operators |
| 💳 Secure payment processing | SSLCommerz cryptographic webhook validation |
| 📊 Live organizer analytics | Interactive revenue dashboards with promo-code math |
| 📱 Mobile-first responsive UI | 2-column masonry grid with Tailwind breakpoints |
| 🔐 Enterprise auth & sessions | JWT interception, rate limiting, token countdowns |
| 🖼️ Dynamic image delivery | Cloudinary FormData pipelines with storage rollback |

---

## ✨ Core Features

- Multi-role authentication and authorization (`admin`, `organizer`, `customer`)
- Event creation with poster upload and metadata management
- Tier-based ticketing (`General`, `VIP`) and promo-code discounting
- Real-time inventory updates with atomic protection against overselling
- SSLCommerz payment integration with secure callback validation
- Organizer analytics dashboard for sales and promo performance
- Admin governance tools (user control, trend toggles, inventory policy)
- Responsive UI optimized for desktop and mobile

---

## 🖼️ Platform Previews

> 📂 Place your screenshots inside a `/preview/` folder at the project root, matching the filenames below exactly.

### 🔑 1. Auth Hub - Login, Register & Email Verification, Forgotten Password Flow

<p align="center">
  <img src="https://github.com/user-attachments/assets/e0c50294-a009-4ff9-8d15-372d5a1b4bd6" alt="Auth Hub" width="92%" />
</p>

> Reactive conditional rendering with password hashing and a **live 60-second visual countdown** synced to a token expiration window.

### 🔓 2. Forgotten Password Flow

<p align="center">
  <img src="https://github.com/user-attachments/assets/e2d30d3a-3b07-42a5-af54-39c8bd523ced" alt="Forgot Password" width="92%" />
</p>

> A secure dual-window UI: a short verification link validity period plus a strict password-reset window enforced server-side.

### 🏠 3. Ticket Discovery Homepage - Events Grid

<p align="center">
  <img src="https://github.com/user-attachments/assets/42d77fb2-b7b3-48ca-ad3e-1e5787eb5f4a" alt="Homepage Events Grid" width="92%" />
</p>

> A responsive masonry grid with role-aware "Trending" controls for admins.

### 🎫 4. Event Details & SSLCommerz Checkout Modal

<p align="center">
  <img src="https://github.com/user-attachments/assets/7e7b6a8d-4c2b-4fc1-9da1-63747aacdbf4" alt="Event Details Checkout" width="92%" />
</p>

> Rich event metadata display, ticket-tier selection, promo-code validation, and checkout initiation in one flow.

### 🛡️ 5. Admin Master Portal

<p align="center">
  <img src="https://github.com/user-attachments/assets/0929a108-783d-414b-9a8e-51be310f201a" alt="Admin Dashboard" width="92%" />
</p>

> Centralized oversight for users, bans, trend controls, and inventory rules.

### 📈 6. Organizer Revenue Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/b5a99d9d-8a3a-4cd2-af00-75e7094374ec" alt="Organizer Dashboard" width="92%" />
</p>

> Revenue table insights with promo usage analytics and event publishing workflow.

### 🏢 7. Corporate Static Pages - About, Contact, Careers & Help Center

<p align="center">
  <img src="https://github.com/user-attachments/assets/5d90c7b9-12bc-43f3-89fd-3d77d568319f" alt="Static Pages" width="92%" />
</p>

> Enterprise layout pages with client-side routing and no full page reload.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | Core UI framework |
| **TypeScript** | 5 | Type safety across UI and API contracts |
| **Vite** | Latest | Fast build and HMR |
| **Tailwind CSS** | Latest | Utility-first responsive styling |
| **Framer Motion** | Latest | Motion and interaction effects |
| **React Router DOM** | v6 | Client-side routing |
| **Axios** | Latest | HTTP client and interceptor layer |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | >= 18 | JavaScript runtime |
| **Express.js** | Latest | API and middleware layer |
| **Mongoose** | Latest | ODM and schema validation |
| **MongoDB** | Latest | Primary document database |

### Third-Party Services

| Service | Purpose |
|---|---|
| **Cloudinary** | Image upload and delivery |
| **SSLCommerz-LTS** | Payment processing and validation |
| **SendGrid / Nodemailer** | Transactional email (verification/reset) |
| **express-rate-limit** | Throttling and brute-force mitigation |

---

## 🔐 Enterprise Security Architecture

Ticikitify follows a **defense-in-depth** model where each layer independently enforces safety and consistency.

### 1) Atomic Transactions - Zero Race Conditions

```js
await Event.findOneAndUpdate(
  { _id: eventId, availableTickets: { $gt: 0 } },
  { $inc: { availableTickets: -quantity } },
  { new: true }
);
```

### 2) Cryptographic Payment Validation

Payment success is accepted only after server-side validation with gateway verification data (`val_id` flow).

### 3) Rate Limiting & Brute-Force Protection

- Window-based request limits on authentication routes
- Automatic HTTP `429` on threshold breach

### 4) Global JWT Interception (Frontend)

```ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthState();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 5) Data Capping & Storage Rollbacks

- Server-side list caps to avoid memory spikes
- Cloud asset rollback if DB write fails after upload

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- **MongoDB** local or Atlas
- Service accounts for Cloudinary, SSLCommerz, and email provider

### Step 1 - Clone

```bash
git clone https://github.com/faysaliqbal007/Ticikitify
cd Ticikitify
```

### Step 2 - Install Dependencies

```bash
# frontend
cd app
npm install

# backend
cd ../server
npm install
```

### Step 3 - Configure Environment Variables

Create `.env` files in both `app/` and `server/` based on the templates below.

### Step 4 - Run in Development

Open two terminals:

```bash
# Terminal 1 (frontend)
cd app
npm run dev
```

```bash
# Terminal 2 (backend)
cd server
npm run server
```

---

## 🔐 Environment Variables

> Never commit real secrets to git. Use placeholders only.

### `server/.env` (template)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

SSLCOMMERZ_STORE_ID=<your_store_id>
SSLCOMMERZ_STORE_PASSWORD=<your_store_password>
SSLCOMMERZ_IS_LIVE=false

SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
SMTP_PASS=<smtp_password>
SMTP_FROM=<noreply_email_address>
```

### `app/.env` (template)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Ticikitify
VITE_SSLCOMMERZ_SANDBOX=true
```

---

## 📜 Available Scripts

> Adjust script names if your `package.json` differs.

### Frontend (`app/`)

- `npm run dev` - Start Vite development server
- `npm run build` - Production build
- `npm run preview` - Preview production build locally

### Backend (`server/`)

- `npm run server` - Start backend (development mode)
- `npm run start` - Start backend (production mode)

---

## 🔌 API Highlights

Representative endpoint groups:

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/events` - List discoverable events
- `POST /api/events` - Create event (organizer)
- `POST /api/payments/init` - Initialize payment
- `POST /api/payments/success` - Payment success callback/webhook
- `GET /api/admin/*` - Admin protected resources


## 📁 Project Structure

```text
ticikitify/
├── app/                    # React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.ts
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── preview/                # README image assets
└── README.md
```


## 👥 Development Team

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
      <td>Express/Mongoose core API, SSLCommerz validation flow, Cloudinary pipelines, and security hardening.</td>
    </tr>
    <tr>
      <td><b>Nahid Hasan Nafi</b></td>
      <td>🎨 Frontend Gatekeeper & Layout Modeler</td>
      <td>Static page architecture, auth UX flows, interceptor patterns, and admin dashboard expansion.</td>
    </tr>
    <tr>
      <td><b>Ishraq Alam Khan</b></td>
      <td>🎫 Frontend Product & Ticketing Interface</td>
      <td>Organizer dashboard analytics, ticketing UX, responsive masonry behavior, and visual delivery improvements.</td>
    </tr>
  </tbody>
</table>

</div>

---

## 🤝 Contributing

Contributions are welcome. Please keep pull requests focused, tested, and aligned with the current architecture.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit changes (`git commit -m "feat: add your feature"`)
4. Push branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## 🧰 Troubleshooting

- **Port already in use:** change backend `PORT` or stop conflicting process.
- **CORS errors:** verify frontend URL is allowed by backend CORS config.
- **401 after login:** ensure JWT secret and token expiry settings are valid.
- **Image upload fails:** verify Cloudinary credentials and upload preset/policy.
- **Payment callback issues:** confirm gateway sandbox/live mode matches server settings.



<div align="center">
  <b>Made with ❤️ by the Ticikitify Team</b>
</div>
