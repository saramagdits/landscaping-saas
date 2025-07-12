'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CogIcon, 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarManager } from '@/components/CalendarManager';
import { CompanySettings } from '@/components/CompanySettings';

export default function Settings() {
  const { userProfile } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  // Set active tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'company', 'notifications', 'calendar', 'security', 'billing', 'preferences'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
  ];

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-lg text-[#d2d7cb]">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                        ${activeTab === tab.id 
                          ? 'bg-[#e6ff4a] text-[#313c2c]' 
                          : 'text-[#d2d7cb] hover:text-white hover:bg-[#5a6a4a]'
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-[#4a5a3a] rounded-xl p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        {userProfile?.photoURL && (
                          <img
                            src={userProfile.photoURL}
                            alt={userProfile.displayName}
                            className="w-20 h-20 rounded-full"
                          />
                        )}
                        <div>
                          <button className="bg-[#5a6a4a] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#4a5a3a] transition">
                            Change Photo
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            defaultValue={userProfile?.displayName || ''}
                            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue={userProfile?.email || ''}
                            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
                        ></textarea>
                      </div>
                      
                      <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'company' && (
                  <CompanySettings />
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                          <p className="text-sm text-[#d2d7cb]">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#5a6a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6ff4a]"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                          <p className="text-sm text-[#d2d7cb]">Receive push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#5a6a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6ff4a]"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">SMS Notifications</h3>
                          <p className="text-sm text-[#d2d7cb]">Receive SMS alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.sms}
                            onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#5a6a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6ff4a]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'calendar' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Calendar Integration</h2>
                    <CalendarManager />
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <input
                            type="password"
                            placeholder="Current password"
                            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
                          />
                          <input
                            type="password"
                            placeholder="New password"
                            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
                          />
                          <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition">
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-[#5a6a4a]">
                        <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                        <p className="text-sm text-[#d2d7cb] mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <button className="bg-[#5a6a4a] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#4a5a3a] transition">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
                    <div className="space-y-6">
                      <div className="bg-[#5a6a4a] rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-2">Current Plan</h3>
                        <p className="text-2xl font-bold text-[#e6ff4a] mb-2">
                          {userProfile?.subscription?.plan || 'Free Plan'}
                        </p>
                        <p className="text-sm text-[#d2d7cb]">
                          Status: {userProfile?.subscription?.status || 'Active'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
                        <div className="bg-[#5a6a4a] rounded-lg p-4 border border-[#6a7a5a]">
                          <div className="flex items-center gap-3">
                            <CreditCardIcon className="h-6 w-6 text-[#e6ff4a]" />
                            <span className="text-white">•••• •••• •••• 4242</span>
                            <span className="text-sm text-[#a0a8a0]">Expires 12/25</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition">
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">Dark Mode</h3>
                          <p className="text-sm text-[#d2d7cb]">Use dark theme</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#5a6a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6ff4a]"></div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
                          Language
                        </label>
                        <select className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#d2d7cb] mb-2">
                          Timezone
                        </label>
                        <select className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]">
                          <option value="utc">UTC</option>
                          <option value="est">Eastern Time</option>
                          <option value="pst">Pacific Time</option>
                          <option value="gmt">GMT</option>
                        </select>
                      </div>
                      
                      <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 