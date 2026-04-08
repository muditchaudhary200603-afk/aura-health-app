# Aura Health App

A production-focused healthcare booking and communication application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Supabase (auth/data)
- Resend (email workflows)

## Project Structure

- `app/` - App Router pages and layouts
- `components/` - Reusable UI and feature components
- `lib/` - Utilities and shared logic
- `supabase/` - Database/migration assets
- `public/` - Static assets

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env.local` and set required values.

```bash
cp .env.example .env.local
```

### Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - build for production
- `npm run start` - run production server

## Security

- Do not commit `.env.local` or any production secrets.
- Rotate API keys immediately if exposed.

## License

MIT License. See [LICENSE](./LICENSE).
