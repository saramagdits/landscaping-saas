'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SignInButton } from './SignInButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313c2c] text-white font-sans flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-[#313c2c] text-white font-sans flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-lg mb-8 text-[#d2d7cb]">
            Please sign in to access this page
          </p>
          <SignInButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 