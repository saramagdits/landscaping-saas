'use client';

import React from 'react';
import { useUser } from '@/hooks/useUser';

export const UserProfileDisplay: React.FC = () => {
  const { 
    userProfile, 
    loading, 
    displayName, 
    initials, 
    isActive, 
    onTrial, 
    daysUntilTrialEnds,
    isComplete 
  } = useUser();

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No user profile available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
          <p className="text-gray-600">{userProfile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">User ID:</span>
              <p className="text-sm text-gray-900 font-mono">{userProfile.uid}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Role:</span>
              <p className="text-sm text-gray-900 capitalize">{userProfile.role}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                userProfile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {userProfile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Profile Complete:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Subscription</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Plan:</span>
              <p className="text-sm text-gray-900 capitalize">{userProfile.subscription.plan}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {userProfile.subscription.status}
              </span>
            </div>
            {onTrial && daysUntilTrialEnds !== null && (
              <div>
                <span className="text-sm font-medium text-gray-500">Trial Ends:</span>
                <p className="text-sm text-gray-900">{daysUntilTrialEnds} days remaining</p>
              </div>
            )}
          </div>
        </div>

        {/* Limits */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Account Limits</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Projects:</span>
              <p className="text-sm text-gray-900">{userProfile.limits.projects}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Storage:</span>
              <p className="text-sm text-gray-900">{userProfile.limits.storage} MB</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Team Members:</span>
              <p className="text-sm text-gray-900">{userProfile.limits.teamMembers}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">API Calls:</span>
              <p className="text-sm text-gray-900">{userProfile.limits.apiCalls}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Preferences</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Theme:</span>
              <p className="text-sm text-gray-900 capitalize">{userProfile.preferences.theme}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Language:</span>
              <p className="text-sm text-gray-900">{userProfile.preferences.language}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Timezone:</span>
              <p className="text-sm text-gray-900">{userProfile.preferences.timezone}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Notifications:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                userProfile.preferences.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {userProfile.preferences.notifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Account Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Sign Up Method:</span>
            <p className="text-sm text-gray-900 capitalize">{userProfile.metadata.signUpMethod}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Login Count:</span>
            <p className="text-sm text-gray-900">{userProfile.metadata.loginCount}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Email Verified:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              userProfile.metadata.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {userProfile.metadata.emailVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          {userProfile.metadata.company && (
            <div>
              <span className="text-sm font-medium text-gray-500">Company:</span>
              <p className="text-sm text-gray-900">{userProfile.metadata.company}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 