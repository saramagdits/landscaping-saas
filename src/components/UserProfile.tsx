'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export const UserProfile = () => {
  const { user, userProfile, signOut } = useAuth();

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        {userProfile.photoURL && (
          <Image
            src={userProfile.photoURL}
            alt={userProfile.displayName}
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
        )}
        <div className="hidden sm:block">
          <div className="text-sm font-medium truncate max-w-32">{userProfile.displayName}</div>
          <div className="text-xs text-[#d2d7cb] truncate max-w-32">{userProfile.email}</div>
        </div>
      </div>
      <button
        onClick={signOut}
        className="text-sm text-[#d2d7cb] hover:text-white transition px-2 py-1 rounded hover:bg-[#5a6a4a]"
      >
        <span className="hidden sm:inline">Sign out</span>
        <span className="sm:hidden">Out</span>
      </button>
    </div>
  );
}; 