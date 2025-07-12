# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage for company logo uploads.

## 1. Enable Firebase Storage

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`landscape-saas`)
3. In the left sidebar, click on "Storage"
4. Click "Get started"
5. Choose "Start in test mode" (you can secure it later with rules)
6. Select a location close to your users
7. Click "Done"

## 2. Deploy Storage Rules

You have two options to deploy the storage rules:

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI globally if you haven't already:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init storage
```

4. Deploy the storage rules:
```bash
firebase deploy --only storage
```

### Option B: Manual Deployment via Firebase Console

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Storage" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload and manage their own company logos
    match /company-logos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow access to user profile photos (if any)
    match /user-photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Click "Publish" to save the rules

## 3. Verify Environment Variables

Make sure your `.env.local` file includes the Firebase Storage bucket:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

Replace `your_project_id` with your actual Firebase project ID.

## 4. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to `/company-demo` in your browser
3. Use the "Firebase Storage Test" section to test uploads
4. If the test passes, try uploading a logo in Settings → Company

## 5. Troubleshooting

### Common Issues:

#### "Missing or insufficient permissions" Error
- Make sure you've deployed the storage rules
- Check that the user is authenticated
- Verify the storage bucket is correctly configured

#### "Storage bucket not found" Error
- Ensure Firebase Storage is enabled in your project
- Check that the `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` environment variable is set correctly
- Verify the bucket name matches your Firebase project

#### Upload hangs or times out
- Check the browser console for error messages
- Verify your internet connection
- Try with a smaller file (under 1MB) first
- Check if Firebase Storage is enabled in your project

#### "Firebase Storage is not initialized" Error
- Make sure you've imported and initialized Firebase Storage in your app
- Check that the Firebase configuration is correct

### Debug Steps:

1. **Check Browser Console**: Look for any error messages when uploading
2. **Test with Storage Test Component**: Use the test component at `/company-demo`
3. **Verify Authentication**: Make sure the user is logged in
4. **Check Network Tab**: Look for failed requests in the browser's network tab
5. **Test with Firebase CLI**: Use `firebase storage:rules:test` to test rules

### Manual Testing:

You can also test Firebase Storage manually using the Firebase Console:

1. Go to Firebase Console → Storage
2. Click "Upload file"
3. Try uploading a small test file
4. If this works, the issue is likely in your app configuration

## 6. Security Considerations

For production, consider updating the storage rules to be more restrictive:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload and manage their own company logos
    match /company-logos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow access to user profile photos (if any)
    match /user-photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 7. File Size Limits

- **Default limit**: 5MB per file
- **Supported formats**: All image formats (JPEG, PNG, GIF, WebP, etc.)
- **Recommended size**: 200x200px for logos

## 8. Performance Tips

- Compress images before upload
- Use WebP format for better compression
- Consider implementing image resizing on the client side
- Cache download URLs to avoid repeated requests

## Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Use the Storage Test component at `/company-demo`
3. Verify all environment variables are set correctly
4. Ensure Firebase Storage is enabled in your project
5. Check that the storage rules are deployed correctly 