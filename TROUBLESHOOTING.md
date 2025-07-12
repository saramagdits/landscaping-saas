# Troubleshooting Guide

## "Missing or insufficient permissions" Error

This error occurs when Firestore security rules are not properly configured or when the Firebase project is not set up correctly.

### Solution 1: Update Firestore Security Rules

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`landscaping-saas`)
3. Go to "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own jobs
    match /jobs/{jobId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. Click "Publish" to save the rules

### Solution 2: Check Firebase Project Setup

1. Ensure your Firebase project is properly configured:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to "Project settings" (gear icon)
   - Verify all configuration values match your `.env.local` file

2. Enable Authentication:
   - Go to "Authentication" in the left sidebar
   - Click "Get started" if not already set up
   - Enable Google sign-in method
   - Add your domain to authorized domains

3. Create Firestore Database:
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database" if not already created
   - Choose "Start in test mode" (you can secure it later with the rules above)

### Solution 3: Update Environment Variables

Add the missing Google OAuth configuration to your `.env.local` file:

```env
# Add these lines to your .env.local file
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

To get these values:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
5. Copy the Client ID and Client Secret

## Blank Calendar Issue

The calendar appears blank when:
1. No jobs are loaded due to permission errors
2. The user is not authenticated
3. There's an error in the job loading process

### Debugging Steps:

1. **Check Browser Console**: Open Developer Tools (F12) and look for error messages
2. **Verify Authentication**: Ensure you're signed in with Google
3. **Check Network Tab**: Look for failed API requests to Firebase
4. **Test Job Creation**: Try creating a job manually to see if the error persists

### Common Error Messages:

- **"Missing or insufficient permissions"**: Firestore security rules issue
- **"Failed to fetch jobs"**: Network or authentication issue
- **"User not found"**: User profile not created in Firestore

## Testing the Fix

1. Restart your development server: `npm run dev`
2. Clear your browser cache and cookies
3. Sign out and sign back in
4. Try creating a new job
5. Check if the calendar displays properly

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)

## Still Having Issues?

If the problem persists:
1. Check the browser console for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your Firebase project is in the same region as your users
4. Check if your Firebase project has billing enabled (required for some features) 