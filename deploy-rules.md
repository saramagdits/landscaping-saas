# Deploy Firestore Security Rules

## Option 1: Using Firebase CLI (Recommended)

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init firestore
```

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Option 2: Manual Deployment via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`landscaping-saas`)
3. Go to "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Copy and paste the following rules:

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

## Option 3: Using the firestore.rules file

If you have the `firestore.rules` file in your project:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
4. Deploy: `firebase deploy --only firestore:rules`

## Verify the Rules

After deploying, test the rules by:

1. Creating a new job in your application
2. Checking the browser console for any permission errors
3. Verifying that jobs are saved to Firestore

## Troubleshooting

If you still get permission errors:

1. **Check the rules syntax**: Ensure there are no syntax errors in the rules
2. **Verify authentication**: Make sure users are properly authenticated
3. **Check user ID**: Ensure the `userId` field is correctly set in job documents
4. **Clear cache**: Clear browser cache and try again
5. **Wait for propagation**: Rules can take a few minutes to propagate

## Security Rules Explanation

The rules above ensure:

- **User isolation**: Users can only access their own data
- **Authentication required**: All operations require user authentication
- **Job ownership**: Users can only read/write jobs they created
- **Safe creation**: New jobs must have the correct user ID 