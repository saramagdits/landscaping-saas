import { useAuth } from '@/contexts/AuthContext';
import { 
  UserProfile, 
  isSubscriptionActive, 
  isSubscriptionExpired, 
  isOnTrial, 
  getDaysUntilTrialEnds,
  isUserProfileComplete,
  getUserDisplayName,
  getUserInitials,
  updateUserPreferences,
  updateUserSubscription,
  updateUserLimits,
  updateUserMetadata
} from '@/lib/userUtils';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useUser = () => {
  const { user, userProfile, loading, signInWithGoogle, requestCalendarAccess, signOut } = useAuth();

  // Subscription status helpers
  const isActive = userProfile ? isSubscriptionActive(userProfile) : false;
  const isExpired = userProfile ? isSubscriptionExpired(userProfile) : false;
  const onTrial = userProfile ? isOnTrial(userProfile) : false;
  const daysUntilTrialEnds = userProfile ? getDaysUntilTrialEnds(userProfile) : null;

  // User info helpers
  const isComplete = userProfile ? isUserProfileComplete(userProfile) : false;
  const displayName = userProfile ? getUserDisplayName(userProfile) : '';
  const initials = userProfile ? getUserInitials(userProfile) : '';

  // Profile update functions
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile || !user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const updatePreferences = async (updates: Partial<UserProfile['preferences']>) => {
    if (!userProfile) return;
    
    const updatedProfile = updateUserPreferences(userProfile, updates);
    await updateProfile({ preferences: updatedProfile.preferences });
  };

  const updateSubscription = async (updates: Partial<UserProfile['subscription']>) => {
    if (!userProfile) return;
    
    const updatedProfile = updateUserSubscription(userProfile, updates);
    await updateProfile({ subscription: updatedProfile.subscription });
  };

  const updateLimits = async (updates: Partial<UserProfile['limits']>) => {
    if (!userProfile) return;
    
    const updatedProfile = updateUserLimits(userProfile, updates);
    await updateProfile({ limits: updatedProfile.limits });
  };

  const updateMetadata = async (updates: Partial<UserProfile['metadata']>) => {
    if (!userProfile) return;
    
    const updatedProfile = updateUserMetadata(userProfile, updates);
    await updateProfile({ metadata: updatedProfile.metadata });
  };

  return {
    // Auth state
    user,
    userProfile,
    loading,
    signInWithGoogle,
    requestCalendarAccess,
    signOut,
    
    // Subscription status
    isActive,
    isExpired,
    onTrial,
    daysUntilTrialEnds,
    
    // User info
    isComplete,
    displayName,
    initials,
    
    // Profile update functions
    updateProfile,
    updatePreferences,
    updateSubscription,
    updateLimits,
    updateMetadata,
  };
}; 