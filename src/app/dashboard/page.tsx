'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { UserProfileDisplay } from '@/components/UserProfileDisplay';
import { CalendarWidget } from '@/components/CalendarWidget';
import { FullCalendarManager } from '@/components/FullCalendarManager';
import { JobStats } from '@/components/JobStats';
import { ProposalStats } from '@/components/ProposalStats';
import { PDFDemo } from '@/components/PDFDemo';
import Image from 'next/image';

export default function Dashboard() {
  const { userProfile } = useAuth();

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg text-[#d2d7cb]">
              Welcome to your Klumsi dashboard
            </p>
          </div>

          {/* User Profile Card */}
          {userProfile && (
            <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Profile</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {userProfile.photoURL && (
                  <Image
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    width={80}
                    height={80}
                    className="rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2">
                    {userProfile.displayName}
                  </h3>
                  <p className="text-[#d2d7cb] mb-2 truncate">{userProfile.email}</p>
                  <p className="text-sm text-[#a0a8a0]">
                    Member since: {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>
                  <p className="text-sm text-[#a0a8a0]">
                    Last login: {userProfile.lastLoginAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Job Statistics */}
          <div className="mb-8">
            <JobStats />
          </div>

          {/* Proposal Statistics */}
          <div className="mb-8">
            <ProposalStats />
          </div>

          {/* Calendar Widget */}
          <div className="mb-8">
            <CalendarWidget />
          </div>

          {/* Full Calendar Manager */}
          <div className="mb-8">
            <FullCalendarManager />
          </div>

          {/* Enhanced User Profile Display */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Detailed Profile Information</h2>
            <div className="bg-[#4a5a3a] rounded-xl p-4 sm:p-6">
              <UserProfileDisplay />
            </div>
          </div>

          {/* PDF Demo */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">PDF Generation Demo</h2>
            <PDFDemo />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/proposals/new" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 sm:px-6 py-4 text-left hover:bg-[#d4f53a] transition">
                <h3 className="text-lg font-bold mb-2">Create Proposal</h3>
                <p className="text-sm">Build a new landscape job proposal</p>
              </a>
              <button className="bg-[#4a5a3a] text-white font-semibold rounded-lg px-4 sm:px-6 py-4 text-left hover:bg-[#5a6a4a] transition border border-[#5a6a4a]">
                <h3 className="text-lg font-bold mb-2">Create New Project</h3>
                <p className="text-sm">Start building your next big thing</p>
              </button>
              <button className="bg-[#4a5a3a] text-white font-semibold rounded-lg px-4 sm:px-6 py-4 text-left hover:bg-[#5a6a4a] transition border border-[#5a6a4a]">
                <h3 className="text-lg font-bold mb-2">Invite Team Members</h3>
                <p className="text-sm">Collaborate with your team</p>
              </button>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 