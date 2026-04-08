# Aura Health App

A modern, responsive healthcare booking interface built using Next.js and Tailwind CSS. Designed to deliver a clean user experience for patients while maintaining a scalable and professional frontend architecture.

---

## Overview

Aura Health App is a frontend-focused healthcare platform that provides an intuitive interface for users to explore services, view specialists, and simulate appointment booking workflows. The project emphasizes UI/UX quality, responsiveness, and production-ready design practices.

---

## Core Features

- **Appointment Interface**
  - User-friendly booking form
  - Department and specialist selection
  - Date and time preference input
  - Queue number generation (UI-level)

- **Responsive Design**
  - Fully optimized for mobile, tablet, and desktop
  - Clean layout with Tailwind CSS
  - Smooth visual hierarchy and spacing

- **Navigation System**
  - Functional header with mobile hamburger menu
  - Seamless page transitions

- **Service Display**
  - Structured healthcare service listings
  - Two-column responsive layout (optimized for mobile fix)

- **User Experience**
  - Minimal and modern design
  - Fast-loading pages
  - Accessible UI components

---

## Tech Stack

- **Frontend Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (primitives)
- **Icons:** Lucide React
- **Animation:** Framer Motion

---

## Project Structure

- `/app` -> Pages and routing
- `/components` -> Reusable UI components
- `/lib` -> Utility functions (client-safe)
- `/public` -> Static assets
- `/styles` -> Global styles

---

## Setup & Installation

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Environment Variables

Create a `.env.local` file (not included in repo):

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Security Notice

- This repository contains frontend-only code
- No backend APIs or sensitive credentials are included
- All environment variables are excluded via `.gitignore`
- No authentication or database logic is exposed

## Future Improvements

- Backend integration with secure APIs
- Authentication system (JWT-based)
- Real-time appointment management
- Admin dashboard enhancements

## License

This project is for educational and development purposes.
