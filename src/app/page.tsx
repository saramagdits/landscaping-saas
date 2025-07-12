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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 bg-[#313c2c] bg-opacity-95 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="bg-[#e6ff4a] rounded w-8 h-8 flex items-center justify-center">
            <span className="text-[#313c2c] font-bold text-xl">Y</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Yardwise</span>
        </div>
        <div className="flex items-center gap-8 text-base font-medium">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="#support" className="hover:underline">Support</a>
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

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 pt-8 md:pt-20 pb-12 bg-[#313c2c]">
        <div className="max-w-xl z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Quote, schedule, and get paid<br className="hidden md:block" />—all from your phone.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-[#d2d7cb]">
            Save 5+ hours/week and increase close rates by 20% with fast, visual, professional proposals.
          </p>
          <div className="flex gap-4">
            {user ? (
              <a href="/dashboard" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-7 py-3 shadow hover:bg-[#d4f53a] transition">
                Go to Dashboard
              </a>
            ) : (
              <a href="#pricing" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-7 py-3 shadow hover:bg-[#d4f53a] transition">
                Start Free
              </a>
            )}
            <a href="#features" className="border border-white text-white font-semibold rounded px-7 py-3 hover:bg-white hover:text-[#313c2c] transition">See Features</a>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center mt-12 md:mt-0">
          <div className="bg-white/10 rounded-2xl p-0 md:p-0 shadow-lg w-full max-w-xl flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
              alt="Gardener planting a small plant in soil with gloves and tools"
              className="rounded-2xl w-full h-80 md:h-96 object-cover object-center shadow-lg border-4 border-[#e6ff4a]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f7faf5] text-[#313c2c] py-16 px-4 md:px-0">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">📝</div>
            <h3 className="font-bold text-lg">Drag-and-drop Proposals</h3>
            <p className="text-sm">Easily generate professional proposals with prebuilt layout templates for lawns, patios, beds, and walkways.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">🤖</div>
            <h3 className="font-bold text-lg">AI-assisted Pricing</h3>
            <p className="text-sm">Get smart pricing suggestions based on your past jobs and local market rates.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">🔗</div>
            <h3 className="font-bold text-lg">Lead Capture</h3>
            <p className="text-sm">Accept leads through your personal profile site or a scannable QR code on business cards and trucks.</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">📅</div>
            <h3 className="font-bold text-lg">Smart Scheduling</h3>
            <p className="text-sm">Convert leads into structured quotes, schedule jobs with drag-and-drop calendar logic, and weather API integration.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">💸</div>
            <h3 className="font-bold text-lg">Automated Invoicing</h3>
            <p className="text-sm">Auto-generate invoices, track payments, and send branded reminders automatically.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="bg-[#e6ff4a] rounded-full w-10 h-10 flex items-center justify-center mb-2">✨</div>
            <h3 className="font-bold text-lg">Add-ons</h3>
            <p className="text-sm">AI-generated designs, e-signatures, and text reminders available as optional upgrades.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-[#313c2c] text-white py-16 px-4 md:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Yardwise?</h2>
          <p className="text-xl mb-8 text-[#e6ff4a] font-semibold">“Quote, schedule, and get paid—all from your phone.”</p>
          <p className="text-lg text-[#d2d7cb] mb-6">Save 5+ hours/week and increase close rates by 20% with fast, visual, professional proposals. Built for independent landscapers who want to win more jobs and spend less time on paperwork.</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#f7faf5] text-[#313c2c] py-16 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pricing & Plans</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl shadow p-8 flex-1 min-w-[260px] flex flex-col items-center">
              <h3 className="font-bold text-lg mb-2">Free</h3>
              <div className="text-3xl font-bold mb-2">$0</div>
              <div className="mb-4 text-sm text-gray-600">Basic quoting & scheduling<br/>Watermark on proposals</div>
              <ul className="mb-6 text-sm space-y-2">
                <li>✔️ Drag-and-drop proposals</li>
                <li>✔️ Basic scheduling</li>
                <li>✔️ Lead capture</li>
              </ul>
              <a href="#" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-6 py-2 mt-auto">Start Free</a>
            </div>
            {/* Solo Pro */}
            <div className="bg-white rounded-2xl shadow p-8 flex-1 min-w-[260px] flex flex-col items-center border-2 border-[#e6ff4a]">
              <h3 className="font-bold text-lg mb-2">Solo Pro</h3>
              <div className="text-3xl font-bold mb-2">$19<span className="text-base font-normal">/month</span></div>
              <div className="mb-4 text-sm text-gray-600">For independent pros</div>
              <ul className="mb-6 text-sm space-y-2">
                <li>✔️ Everything in Free</li>
                <li>✔️ No watermark</li>
                <li>✔️ AI pricing suggestions</li>
                <li>✔️ Automated invoicing</li>
              </ul>
              <a href="#" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-6 py-2 mt-auto">Start Solo Pro</a>
            </div>
            {/* Crew Plan */}
            <div className="bg-white rounded-2xl shadow p-8 flex-1 min-w-[260px] flex flex-col items-center">
              <h3 className="font-bold text-lg mb-2">Crew Plan</h3>
              <div className="text-3xl font-bold mb-2">$49<span className="text-base font-normal">/month</span></div>
              <div className="mb-4 text-sm text-gray-600">For teams & crews</div>
              <ul className="mb-6 text-sm space-y-2">
                <li>✔️ Everything in Solo Pro</li>
                <li>✔️ Staff logins</li>
                <li>✔️ Reminders & batch invoicing</li>
              </ul>
              <a href="#" className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded px-6 py-2 mt-auto">Start Crew Plan</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-700">
            <span className="font-semibold">Add-ons:</span> AI-generated designs, e-signatures, text reminders
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#23291c] text-[#d2d7cb] py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-[#e6ff4a] rounded w-8 h-8 flex items-center justify-center">
              <span className="text-[#313c2c] font-bold text-xl">Y</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Yardwise</span>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} Yardwise. All rights reserved.</div>
          <div className="flex gap-4 text-sm">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <a href="#support" className="hover:underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
