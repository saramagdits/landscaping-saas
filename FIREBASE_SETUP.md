# Firebase Setup Guide

This guide will help you set up Firebase for Google OAuth authentication and Firestore user storage.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "landscape-saas")
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## 2. Enable Authentication

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable it and configure:
   - Project support email: your email
   - Authorized domains: add your domain (for local development, you can skip this)
6. Save the configuration

## 3. Set up Firestore Database

1. In your Firebase project console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later with rules)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. In your Firebase project console, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "landscape-saas-web")
6. Copy the configuration object

## 5. Set up Google OAuth for Calendar Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production domain
5. Copy the Client ID and Client Secret

## 6. Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

Replace the values with the actual configuration from your Firebase project and Google Cloud Console.

## 7. Firestore Security Rules (Optional)

For production, you should set up proper Firestore security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Open your app in the browser
3. Click "Sign in with Google"
4. Complete the OAuth flow with calendar permissions
5. Check that user data is stored in Firestore under `users/{uid}`
6. Go to Settings > Calendar to test calendar integration

## Troubleshooting

- **Authentication errors**: Make sure Google OAuth is enabled in Firebase Console
- **Firestore errors**: Check that Firestore is created and rules allow read/write
- **Environment variables**: Ensure all variables are prefixed with `NEXT_PUBLIC_` for client-side access
- **Domain issues**: Add your domain to authorized domains in Firebase Console for production
- **Calendar integration errors**: 
  - Ensure Google Calendar API is enabled in Google Cloud Console
  - Check that OAuth credentials are properly configured
  - Verify that calendar scopes are included in the OAuth flow 