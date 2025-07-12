'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from './UserProfile';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  DocumentTextIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Jobs', href: '/jobs', icon: CalendarIcon },
  { name: 'Proposals', href: '/proposals', icon: DocumentDuplicateIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Team', href: '/team', icon: UsersIcon },
  { name: 'Projects', href: '/projects', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { signOut, userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#313c2c] text-white font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#4a5a3a] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-[#5a6a4a]">
            <div className="flex items-center gap-2">
              <div className="bg-[#e6ff4a] rounded w-8 h-8 flex items-center justify-center">
                <span className="text-[#313c2c] font-bold text-xl">K</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Yardwise</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-[#d2d7cb] hover:text-white hover:bg-[#5a6a4a] transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-6 px-3 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-[#e6ff4a] text-[#313c2c]' 
                        : 'text-[#d2d7cb] hover:text-white hover:bg-[#5a6a4a]'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-[#313c2c]' : 'text-[#d2d7cb] group-hover:text-white'}
                    `} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User section at bottom */}
          <div className="p-4 border-t border-[#5a6a4a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {userProfile?.photoURL && (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {userProfile?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-[#a0a8a0] truncate">
                    {userProfile?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-md text-[#d2d7cb] hover:text-white hover:bg-[#5a6a4a] transition-colors flex-shrink-0"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-[#4a5a3a] border-b border-[#5a6a4a]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-[#d2d7cb] hover:text-white hover:bg-[#5a6a4a] transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex justify-center lg:justify-start">
              <h1 className="text-lg font-semibold text-white truncate">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}; 