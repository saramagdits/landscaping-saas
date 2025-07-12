'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

export default function Analytics() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Analytics</h1>
            <p className="text-lg text-[#d2d7cb]">
              Track your performance and insights
            </p>
          </div>

          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Total Views</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">12,847</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-400">+12.5%</span>
                <span className="text-sm text-[#a0a8a0] ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Active Users</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">1,234</p>
                </div>
                <UsersIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-400">+8.2%</span>
                <span className="text-sm text-[#a0a8a0] ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Projects</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">47</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-400">+3.1%</span>
                <span className="text-sm text-[#a0a8a0] ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Growth Rate</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">24.3%</p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-400">+2.1%</span>
                <span className="text-sm text-[#a0a8a0] ml-2">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">User Activity</h3>
              <div className="h-64 bg-[#5a6a4a] rounded-lg flex items-center justify-center">
                <p className="text-[#a0a8a0]">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Project Performance</h3>
              <div className="h-64 bg-[#5a6a4a] rounded-lg flex items-center justify-center">
                <p className="text-[#a0a8a0]">Chart placeholder</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#4a5a3a] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New project created', user: 'John Doe', time: '2 hours ago' },
                { action: 'Team member invited', user: 'Jane Smith', time: '4 hours ago' },
                { action: 'Analytics report generated', user: 'Mike Johnson', time: '6 hours ago' },
                { action: 'Settings updated', user: 'Sarah Wilson', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-[#5a6a4a] last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-[#a0a8a0]">by {activity.user}</p>
                  </div>
                  <span className="text-sm text-[#a0a8a0]">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 