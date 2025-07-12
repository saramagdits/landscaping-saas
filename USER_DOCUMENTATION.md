# User Profile System Documentation

## Overview

This application automatically creates Firestore user documents with comprehensive default fields when new users log in. The system is designed to provide a complete user profile management solution for SaaS applications.

## How It Works

### Automatic Document Creation

When a user signs in for the first time:

1. **Authentication**: User authenticates via Google OAuth
2. **Profile Check**: System checks if a user document exists in Firestore
3. **Document Creation**: If no document exists, a new one is created with default fields
4. **Profile Loading**: The user profile is loaded into the application state

### User Profile Structure

Each user document contains the following structure:

```typescript
interface UserProfile {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User's email address
  displayName: string;            // User's display name
  photoURL: string;               // Profile photo URL
  createdAt: Timestamp;           // Account creation timestamp
  lastLoginAt: Timestamp;         // Last login timestamp
  isActive: boolean;              // Account status
  role: string;                   // User role (user, admin, etc.)
  
  preferences: {
    theme: string;                // UI theme preference
    notifications: boolean;       // Notification settings
    language: string;             // Language preference
    timezone: string;             // Timezone setting
  };
  
  subscription: {
    plan: string;                 // Subscription plan (free, pro, etc.)
    status: string;               // Subscription status
    startDate: Timestamp;         // Subscription start date
    endDate: Timestamp | null;    // Subscription end date
    trialEndsAt: Timestamp | null; // Trial end date
  };
  
  limits: {
    projects: number;             // Maximum projects allowed
    storage: number;              // Storage limit in MB
    teamMembers: number;          // Team member limit
    apiCalls: number;             // API call limit
  };
  
  metadata: {
    signUpMethod: string;         // How user signed up
    lastSeen: Timestamp;          // Last activity timestamp
    loginCount: number;           // Total login count
    emailVerified: boolean;       // Email verification status
    phoneNumber: string;          // Phone number (optional)
    company: string;              // Company name (optional)
    location: string;             // Location (optional)
  };
}
```

## Default Values

### Free Plan Defaults
- **Plan**: `free`
- **Status**: `active`
- **Projects**: 3
- **Storage**: 100 MB
- **Team Members**: 1
- **API Calls**: 1,000

### Preferences Defaults
- **Theme**: `light`
- **Notifications**: `true`
- **Language**: `en`
- **Timezone**: `UTC`

## Usage Examples

### Using the useUser Hook

```typescript
import { useUser } from '@/hooks/useUser';

function MyComponent() {
  const { 
    userProfile, 
    loading, 
    isActive, 
    onTrial, 
    updatePreferences,
    updateSubscription 
  } = useUser();

  if (loading) return <div>Loading...</div>;

  // Update user preferences
  const handleThemeChange = async (theme: string) => {
    await updatePreferences({ theme });
  };

  // Check subscription status
  if (!isActive) {
    return <div>Please upgrade your subscription</div>;
  }

  return (
    <div>
      <h1>Welcome, {userProfile?.displayName}</h1>
      {onTrial && <p>You're on a trial period</p>}
    </div>
  );
}
```

### Direct Firestore Operations

```typescript
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Update specific fields
const updateUserField = async (uid: string, field: string, value: any) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { [field]: value }, { merge: true });
};

// Get user profile
const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};
```

## Utility Functions

### Profile Management
- `updateUserPreferences()` - Update user preferences
- `updateUserSubscription()` - Update subscription details
- `updateUserLimits()` - Update account limits
- `updateUserMetadata()` - Update metadata fields

### Status Checks
- `isSubscriptionActive()` - Check if subscription is active
- `isSubscriptionExpired()` - Check if subscription has expired
- `isOnTrial()` - Check if user is on trial
- `getDaysUntilTrialEnds()` - Get remaining trial days

### User Info
- `getUserDisplayName()` - Get formatted display name
- `getUserInitials()` - Get user initials for avatars
- `isUserProfileComplete()` - Check if profile is complete

## Security Rules

Ensure your Firestore security rules allow authenticated users to read/write their own documents:

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

## Error Handling

The system includes comprehensive error handling:

- **Network errors**: Graceful fallbacks with user feedback
- **Permission errors**: Clear error messages for unauthorized access
- **Data validation**: Ensures all required fields are present
- **Loading states**: Proper loading indicators during operations

## Best Practices

1. **Always check loading state** before accessing user data
2. **Use the useUser hook** for consistent data access
3. **Handle errors gracefully** with user-friendly messages
4. **Update profiles incrementally** using merge operations
5. **Validate data** before saving to Firestore
6. **Use TypeScript** for type safety and better development experience

## Migration Notes

If you're upgrading from an older version:

1. Existing user documents will be automatically updated with new fields
2. Missing fields will be populated with default values
3. No data migration scripts are required
4. The system is backward compatible

## Troubleshooting

### Common Issues

1. **User document not created**: Check Firebase Auth and Firestore permissions
2. **Missing fields**: Ensure all default values are properly set
3. **Permission errors**: Verify Firestore security rules
4. **Loading issues**: Check network connectivity and Firebase configuration

### Debug Mode

Enable debug logging by checking the browser console for detailed information about:
- User authentication state changes
- Profile creation/updates
- Error messages and stack traces 