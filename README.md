# Yardwise - Landscape SaaS Platform

A modern SaaS platform built with Next.js, featuring Google OAuth authentication and Firestore user management.

## Features

- 🔐 **Google OAuth 2.0 Authentication** - Secure sign-in with Google accounts
- 📅 **Google Calendar Integration** - Sync and manage your Google Calendar events
- 📊 **User Profile Management** - Store and manage user data in Firestore
- 🏢 **Company Settings** - Manage company information and logo for proposals and invoices
- 📄 **Proposal & Invoice System** - Create professional proposals and invoices with company branding
- 🛡️ **Protected Routes** - Secure access to authenticated content
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Next.js 15** - Latest features with App Router and Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase project with Authentication and Firestore enabled
- Google Cloud project with Calendar API enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd landscape-saas
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase and Google Calendar:
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Create a `.env.local` file with your Firebase and Google OAuth configuration

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication & Calendar Integration

This project implements Google OAuth 2.0 authentication using Firebase Auth with Google Calendar integration:

- **Sign In**: Users can sign in with their Google account
- **Calendar Sync**: Automatically syncs with Google Calendar after authentication
- **User Profiles**: Basic user data is stored in Firestore (`users/{uid}`)
- **Session Management**: Automatic session persistence and management
- **Protected Routes**: Use the `ProtectedRoute` component to secure pages
- **Token Management**: Automatic token refresh for calendar API access

### Key Components

- `AuthContext` - Manages authentication state and user data
- `SignInButton` - Google OAuth sign-in button with loading states
- `UserProfile` - Displays user information and sign-out option
- `ProtectedRoute` - Wrapper for pages requiring authentication
- `useUser` - Custom hook for easy access to user data
- `CalendarManager` - Manages Google Calendar integration and settings
- `CalendarWidget` - Displays upcoming events on the dashboard
- `calendarService` - Handles Google Calendar API calls and token management

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Protected dashboard page
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
│   ├── SignInButton.tsx
│   ├── UserProfile.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   └── useUser.ts       # User data hook
└── lib/                 # Utility libraries
    └── firebase.ts      # Firebase configuration
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
