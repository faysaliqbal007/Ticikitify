# 🎟️ Ticikitify

> A modern, full-stack event management and ticketing platform designed to streamline event discovery, creation, and dynamic ticketing.

## Overview

**Ticikitify** is an end-to-end event ticketing application built for robustness and scalability. It features a complete ecosystem handling everything from user authentication and role-based permissions (Customer, Organizer, Admin) to event creation, cloud-based image storage, and strict email verifications. 

The application utilizes a **MERN-like stack** (MongoDB, Express, React, Node.js) with a beautifully styled frontend powered by Tailwind CSS, Radix UI, and Framer Motion.

##  Key Features

###  Advanced Security & Auth
*   **Role-Based Access Control:** Distinct dashboard experiences for Admins, Organizers, and Customers.
*   **JWT Authentication:** Secure stateless session management.
*   **Email Verification Flow:** 1-minute expiration windows for verification tokens alongside strict registration logic to prevent duplicate unverified accounts.

### Event Management 
*   **Dynamic Event Creation:** Granular controls for Organizers including specific venue, city, and ticket-type configurations.
*   **Cloudinary Integration:** Fully integrated cloud storage for event banners and user profile images, ensuring fast and reliable content delivery.
*   **Curated Trending Section:** Strictly enforced, Admin-managed "Trending Events" system limited to 4 concurrent top-tier events.

### Modern UI/UX
*   **Component-Driven Design:** Built with accessible Radix UI primitives and custom Tailwind CSS styling.
*   **Responsive & Dynamic:** Smooth micro-animations with Framer Motion and fully responsive layouts across all device sizes.
*   **QR Code Generation:** Integrated QR functionalities for seamless ticket validation and check-ins.

---

## Tech Stack

### Frontend
*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS, Radix UI
*   **Animations:** Framer Motion
*   **Routing & State:** React Router DOM, React Hook Form, Zod (Schema Validation)
*   **Icons & Utilities:** Lucide React, date-fns

### Backend
*   **Server Core:** Node.js, Express.js
*   **Database:** MongoDB via Mongoose
*   **Storage:** Cloudinary API
*   **Utilities:** JSON Web Tokens (JWT), Nodemailer (Email services), Bcrypt (Password hashing)

---

Ticikitify/
├── app/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── context/
│   │   └── index.css
│   └── package.json

└── server/               # Backend (Express)
    ├── config/
    ├── models/
    ├── routes/
    ├── middlewares/
    └── index.js
