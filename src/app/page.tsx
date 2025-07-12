'use client';

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { SignInButton } from "@/components/SignInButton";
import { UserProfile } from "@/components/UserProfile";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313c2c] text-white font-sans flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e6ff4a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313c2c] text-white font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          {/* Logo (replace with actual logo if available) */}
          <div className="bg-[#e6ff4a] rounded w-8 h-8 flex items-center justify-center">
            <span className="text-[#313c2c] font-bold text-xl">K</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Yardwise</span>
        </div>
        <div className="flex items-center gap-8 text-base font-medium">
          <a href="#" className="hover:underline">About us</a>
          <a href="#" className="hover:underline">Products</a>
          <a href="#" className="hover:underline">Pricing</a>
          {user && (
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <UserProfile />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-white hover:text-[#e6ff4a] transition-colors"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 pt-8 md:pt-0 relative">
        {/* Left: Headline and CTAs */}
        <div className="max-w-xl z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Empower Your Team<br />with Our Platform
          </h1>
          <p className="text-lg md:text-xl mb-8 text-[#d2d7cb]">
            Let our <a href="#" className="text-[#e6ff4a] underline font-semibold">badass product</a> help you create a powerful online presence that lasts with Yardwise
          </p>
          <div className="flex gap-4">
            {user ? (
              <a href="/dashboard" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-7 py-3 shadow hover:bg-[#d4f53a] transition">
                Go to Dashboard
              </a>
            ) : (
              <SignInButton />
            )}
            <a href="#" className="border border-white text-white font-semibold rounded px-7 py-3 hover:bg-white hover:text-[#313c2c] transition">Request demo</a>
          </div>
        </div>

        {/* Right: Floating Company Cards */}
        <div className="relative flex-1 flex items-center justify-center mt-16 md:mt-0">
          {/* Background pattern (optional, can be replaced with SVG) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Placeholder for background pattern */}
            <svg width="340" height="340" fill="none" viewBox="0 0 340 340" className="opacity-10">
              <rect x="20" y="20" width="80" height="80" stroke="#fff" strokeWidth="2" rx="12" />
              <rect x="120" y="120" width="80" height="80" stroke="#fff" strokeWidth="2" rx="12" />
              <rect x="220" y="220" width="80" height="80" stroke="#fff" strokeWidth="2" rx="12" />
            </svg>
          </div>
          {/* Cards */}
          <div className="relative flex flex-col gap-6 items-end">
            {/* Spotify Card */}
            <div className="bg-white text-[#313c2c] rounded-xl shadow-lg p-6 w-72 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#1db954] rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="font-bold text-white">S</span>
                </div>
                <div>
                  <div className="font-semibold">Spotify</div>
                  <div className="text-xs text-gray-500">Currently visiting</div>
                </div>
              </div>
              <div className="text-sm">
                <div><span className="font-semibold">INDUSTRY</span>: Music</div>
                <div><span className="font-semibold">REVENUE</span>: 1B - 10B $</div>
                <div><span className="font-semibold">EMPLOYEES</span>: 1001-5000</div>
                <div><span className="font-semibold">DOMAIN</span>: spotify.com</div>
                <div><span className="font-semibold">LOCATION</span>: Stockholm, Sweden</div>
              </div>
            </div>
            {/* Intercom Card */}
            <div className="bg-white text-[#313c2c] rounded-xl shadow p-4 w-56 absolute right-[-120px] top-[-60px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-[#3864fa] rounded w-6 h-6 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">I</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Intercom</div>
                  <div className="text-[10px] text-gray-500">Currently visiting</div>
                </div>
              </div>
              <div className="text-xs">
                <div><span className="font-semibold">INDUSTRY</span>: IT</div>
                <div><span className="font-semibold">REVENUE</span>: $100M</div>
                <div><span className="font-semibold">EMPLOYEES</span>: 500</div>
                <div><span className="font-semibold">DOMAIN</span>: intercom.com</div>
                <div><span className="font-semibold">LOCATION</span>: Dublin, Ireland</div>
              </div>
            </div>
            {/* Slack Card */}
            <div className="bg-white text-[#313c2c] rounded-xl shadow p-4 w-56 ml-12">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-[#611f69] rounded w-6 h-6 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">S</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Slack</div>
                  <div className="text-[10px] text-gray-500">Currently visiting</div>
                </div>
              </div>
              <div className="text-xs">
                <div><span className="font-semibold">INDUSTRY</span>: IT</div>
                <div><span className="font-semibold">REVENUE</span>: $400M</div>
                <div><span className="font-semibold">EMPLOYEES</span>: 1,500</div>
                <div><span className="font-semibold">DOMAIN</span>: slack.com</div>
                <div><span className="font-semibold">LOCATION</span>: San Francisco, CA</div>
              </div>
            </div>
            {/* Twilio Card */}
            <div className="bg-white text-[#313c2c] rounded-xl shadow p-4 w-56 absolute right-[-60px] top-[160px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-[#f22f46] rounded w-6 h-6 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">T</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Twilio</div>
                  <div className="text-[10px] text-gray-500">Currently visiting</div>
                </div>
              </div>
              <div className="text-xs">
                <div><span className="font-semibold">INDUSTRY</span>: IT</div>
                <div><span className="font-semibold">REVENUE</span>: $650M</div>
                <div><span className="font-semibold">EMPLOYEES</span>: 4,000</div>
                <div><span className="font-semibold">DOMAIN</span>: twilio.com</div>
                <div><span className="font-semibold">LOCATION</span>: San Francisco, CA</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
