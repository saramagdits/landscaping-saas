'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { 
  UsersIcon, 
  PlusIcon, 
  EnvelopeIcon,
  PhoneIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

export default function Team() {
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Team Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastActive: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastActive: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      lastActive: '1 hour ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'offline',
      lastActive: '3 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">Team</h1>
                <p className="text-lg text-[#d2d7cb]">
                  Manage your team members and collaborations
                </p>
              </div>
              <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 hover:bg-[#d4f53a] transition flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Total Members</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">{teamMembers.length}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Online</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">2</p>
                </div>
                <div className="w-8 h-8 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Away</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">1</p>
                </div>
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Offline</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">1</p>
                </div>
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-[#4a5a3a] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-[#5a6a4a] rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-[#5a6a4a]`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-[#a0a8a0]">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#d2d7cb]">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#a0a8a0]">
                      <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`}></div>
                      <span className="capitalize">{member.status}</span>
                      <span>•</span>
                      <span>{member.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#4a5a3a] text-white text-sm font-medium rounded-md px-3 py-2 hover:bg-[#3a4a2a] transition">
                      Message
                    </button>
                    <button className="flex-1 bg-[#4a5a3a] text-white text-sm font-medium rounded-md px-3 py-2 hover:bg-[#3a4a2a] transition">
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Section */}
          <div className="mt-8 bg-[#4a5a3a] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Invite New Members</h2>
            <p className="text-[#d2d7cb] mb-6">
              Send invitations to new team members via email
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
              />
              <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Invite
              </button>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 