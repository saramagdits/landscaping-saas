'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  reauthenticateWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile, createDefaultUserProfile, updateUserLoginStats, DEFAULT_USER_PREFERENCES, DEFAULT_SUBSCRIPTION, DEFAULT_LIMITS, DEFAULT_USER_METADATA } from '@/lib/userUtils';
import { calendarService } from '@/lib/calendarService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  requestCalendarAccess: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSignIn, setIsNewSignIn] = useState(false);
  const router = useRouter();

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Fetched user data:', { 
          uid: data.uid, 
          email: data.email,
          calendarConnected: data.calendar?.isConnected,
          hasAccessToken: !!data.calendar?.accessToken
        });
        
        // Ensure all required fields exist with defaults
        const userProfile: UserProfile = {
          uid: data.uid || uid,
          email: data.email || '',
          displayName: data.displayName || '',
          photoURL: data.photoURL || '',
          createdAt: data.createdAt || serverTimestamp(),
          lastLoginAt: data.lastLoginAt || serverTimestamp(),
          isActive: data.isActive !== undefined ? data.isActive : true,
          role: data.role || 'user',
          preferences: {
            theme: data.preferences?.theme || DEFAULT_USER_PREFERENCES.theme,
            notifications: data.preferences?.notifications !== undefined ? data.preferences.notifications : DEFAULT_USER_PREFERENCES.notifications,
            language: data.preferences?.language || DEFAULT_USER_PREFERENCES.language,
            timezone: data.preferences?.timezone || DEFAULT_USER_PREFERENCES.timezone,
          },
          subscription: {
            plan: data.subscription?.plan || DEFAULT_SUBSCRIPTION.plan,
            status: data.subscription?.status || DEFAULT_SUBSCRIPTION.status,
            startDate: data.subscription?.startDate || DEFAULT_SUBSCRIPTION.startDate,
            endDate: data.subscription?.endDate || DEFAULT_SUBSCRIPTION.endDate,
            trialEndsAt: data.subscription?.trialEndsAt || DEFAULT_SUBSCRIPTION.trialEndsAt,
          },
          limits: {
            projects: data.limits?.projects || DEFAULT_LIMITS.projects,
            storage: data.limits?.storage || DEFAULT_LIMITS.storage,
            teamMembers: data.limits?.teamMembers || DEFAULT_LIMITS.teamMembers,
            apiCalls: data.limits?.apiCalls || DEFAULT_LIMITS.apiCalls,
          },
          metadata: {
            signUpMethod: data.metadata?.signUpMethod || DEFAULT_USER_METADATA.signUpMethod,
            lastSeen: data.metadata?.lastSeen || serverTimestamp(),
            loginCount: data.metadata?.loginCount || DEFAULT_USER_METADATA.loginCount,
            emailVerified: data.metadata?.emailVerified !== undefined ? data.metadata.emailVerified : DEFAULT_USER_METADATA.emailVerified,
            phoneNumber: data.metadata?.phoneNumber || DEFAULT_USER_METADATA.phoneNumber,
            company: data.metadata?.company || DEFAULT_USER_METADATA.company,
            location: data.metadata?.location || DEFAULT_USER_METADATA.location,
          },
          calendar: data.calendar || {
            isConnected: false,
            calendars: [],
          },
        };
        setUserProfile(userProfile);
        console.log('User profile loaded successfully:', userProfile.displayName, 'Calendar connected:', userProfile.calendar?.isConnected);
      } else {
        // If user document doesn't exist, create it with default fields
        console.log('User document not found, creating new profile...');
        await createUserProfile({ uid } as User);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Create or update user profile in Firestore
  const createUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      // If we only have a UID (from auth state change), get the full user data
      const currentUser = auth.currentUser;
      
      if (userDoc.exists()) {
        // Update existing user with login stats
        const updateData = updateUserLoginStats(userDoc.data() as UserProfile);
        const updatedUserData = {
          ...userDoc.data(),
          ...updateData,
          email: currentUser?.email || user.email || userDoc.data().email,
          displayName: currentUser?.displayName || user.displayName || userDoc.data().displayName,
          photoURL: currentUser?.photoURL || user.photoURL || userDoc.data().photoURL,
          metadata: {
            ...userDoc.data().metadata,
            ...updateData.metadata,
            emailVerified: currentUser?.emailVerified || userDoc.data().metadata?.emailVerified || false,
          },
        };
        
        await setDoc(userRef, updatedUserData, { merge: true });
        setUserProfile(updatedUserData as UserProfile);
        console.log('User profile updated successfully:', updatedUserData.displayName);
      } else {
        // Create new user profile with default fields
        const userData = createDefaultUserProfile(currentUser || user);
        await setDoc(userRef, userData);
        setUserProfile(userData);
        console.log('New user profile created successfully:', userData.displayName);
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  };

  // Google OAuth sign-in
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setIsNewSignIn(true); // Mark this as a new sign-in
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      provider.setCustomParameters({
        access_type: 'offline',
        prompt: 'consent'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      // Store calendar tokens if available
      if (result.user) {
        try {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            // Store the access token for calendar access
            // Note: Refresh token might not be available in all cases
            await calendarService.connectCalendar(
              result.user.uid,
              credential.accessToken
            );
          }
        } catch (calendarError) {
          console.warn('Failed to store calendar tokens:', calendarError);
          // Don't fail the sign-in if calendar setup fails
        }
      }
      
      await createUserProfile(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsNewSignIn(false); // Reset flag on error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Request additional calendar scopes for already authenticated users
  const requestCalendarAccess = async () => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      console.log('Starting calendar access request for user:', auth.currentUser.email);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      provider.setCustomParameters({
        access_type: 'offline',
        prompt: 'consent'
      });
      
      const result = await reauthenticateWithPopup(auth.currentUser, provider);
      console.log('Re-authentication successful:', result);
      
      // Store calendar tokens if available
      if (result.user) {
        try {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log('Credential received:', credential ? 'Yes' : 'No');
          if (credential?.accessToken) {
            console.log('Access token received, connecting calendar...');
            // Store the access token for calendar access
            await calendarService.connectCalendar(
              result.user.uid,
              credential.accessToken
            );
            console.log('Calendar connected successfully');
          } else {
            console.warn('No access token received from credential');
          }
        } catch (calendarError) {
          console.warn('Failed to store calendar tokens:', calendarError);
          // Don't fail the re-authentication if calendar setup fails
        }
      }
      
      // Refresh user profile to get updated calendar status
      await fetchUserProfile(result.user.uid);
      console.log('User profile refreshed');
    } catch (error) {
      console.error('Error requesting calendar access:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      console.log('User signed out successfully');
      // Redirect to landing page after successful sign out
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        console.log('Auth state changed - user logged in:', user.email);
        await fetchUserProfile(user.uid);
        // Check if this is a new sign-in (not a page refresh)
        if (isNewSignIn) {
          router.push('/dashboard');
          setIsNewSignIn(false);
        }
      } else {
        console.log('Auth state changed - user logged out');
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isNewSignIn, router]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    requestCalendarAccess,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 