import { serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  lastLoginAt: any;
  isActive: boolean;
  role: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
    timezone: string;
  };
  subscription: {
    plan: string;
    status: string;
    startDate: any;
    endDate: any;
    trialEndsAt: any;
  };
  limits: {
    projects: number;
    storage: number; // in MB
    teamMembers: number;
    apiCalls: number;
  };
  metadata: {
    signUpMethod: string;
    lastSeen: any;
    loginCount: number;
    emailVerified: boolean;
    phoneNumber: string;
    company: string;
    location: string;
  };
  calendar?: {
    isConnected: boolean;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
    lastSync?: any;
    calendars?: Array<{
      id: string;
      name: string;
      color: string;
      isPrimary: boolean;
      isEnabled: boolean;
    }>;
  };
}

export const DEFAULT_USER_PREFERENCES = {
  theme: 'light',
  notifications: true,
  language: 'en',
  timezone: 'UTC',
};

export const DEFAULT_USER_METADATA = {
  signUpMethod: 'google',
  lastSeen: serverTimestamp(),
  loginCount: 1,
  emailVerified: false,
  phoneNumber: '',
  company: '',
  location: '',
};

export const DEFAULT_CALENDAR = {
  isConnected: false,
  calendars: [],
};

export const DEFAULT_SUBSCRIPTION = {
  plan: 'free',
  status: 'active',
  startDate: serverTimestamp(),
  endDate: null,
  trialEndsAt: null,
};

export const DEFAULT_LIMITS = {
  projects: 3,
  storage: 100, // 100 MB
  teamMembers: 1,
  apiCalls: 1000,
};

export const createDefaultUserProfile = (user: User, signUpMethod: string = 'google'): UserProfile => {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    isActive: true,
    role: 'user',
    preferences: DEFAULT_USER_PREFERENCES,
    subscription: DEFAULT_SUBSCRIPTION,
    limits: DEFAULT_LIMITS,
    metadata: {
      ...DEFAULT_USER_METADATA,
      signUpMethod,
      lastSeen: serverTimestamp(),
      loginCount: 1,
      emailVerified: user.emailVerified || false,
    },
    calendar: DEFAULT_CALENDAR,
  };
};

export const updateUserLoginStats = (existingProfile: Partial<UserProfile>): Partial<UserProfile> => {
  return {
    lastLoginAt: serverTimestamp(),
    metadata: {
      signUpMethod: existingProfile.metadata?.signUpMethod || 'google',
      lastSeen: serverTimestamp(),
      loginCount: (existingProfile.metadata?.loginCount || 0) + 1,
      emailVerified: existingProfile.metadata?.emailVerified || false,
      phoneNumber: existingProfile.metadata?.phoneNumber || '',
      company: existingProfile.metadata?.company || '',
      location: existingProfile.metadata?.location || '',
    },
  };
};

// Utility functions for user profile management
export const updateUserPreferences = (profile: UserProfile, updates: Partial<UserProfile['preferences']>): UserProfile => {
  return {
    ...profile,
    preferences: {
      ...profile.preferences,
      ...updates,
    },
  };
};

export const updateUserSubscription = (profile: UserProfile, updates: Partial<UserProfile['subscription']>): UserProfile => {
  return {
    ...profile,
    subscription: {
      ...profile.subscription,
      ...updates,
    },
  };
};

export const updateUserLimits = (profile: UserProfile, updates: Partial<UserProfile['limits']>): UserProfile => {
  return {
    ...profile,
    limits: {
      ...profile.limits,
      ...updates,
    },
  };
};

export const updateUserMetadata = (profile: UserProfile, updates: Partial<UserProfile['metadata']>): UserProfile => {
  return {
    ...profile,
    metadata: {
      ...profile.metadata,
      ...updates,
    },
  };
};

// Subscription status helpers
export const isSubscriptionActive = (profile: UserProfile): boolean => {
  return profile.subscription.status === 'active';
};

export const isSubscriptionExpired = (profile: UserProfile): boolean => {
  if (!profile.subscription.endDate) return false;
  return new Date(profile.subscription.endDate.toDate()) < new Date();
};

export const isOnTrial = (profile: UserProfile): boolean => {
  if (!profile.subscription.trialEndsAt) return false;
  return new Date(profile.subscription.trialEndsAt.toDate()) > new Date();
};

export const getDaysUntilTrialEnds = (profile: UserProfile): number | null => {
  if (!profile.subscription.trialEndsAt) return null;
  const trialEnd = new Date(profile.subscription.trialEndsAt.toDate());
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// User validation helpers
export const isUserProfileComplete = (profile: UserProfile): boolean => {
  return !!(
    profile.email &&
    profile.displayName &&
    profile.uid
  );
};

export const getUserDisplayName = (profile: UserProfile): string => {
  return profile.displayName || profile.email || 'Unknown User';
};

export const getUserInitials = (profile: UserProfile): string => {
  const name = getUserDisplayName(profile);
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}; 