'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'A modern e-commerce platform with advanced features',
      status: 'active',
      progress: 75,
      team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      dueDate: '2024-02-15',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'Complete redesign of the mobile application',
      status: 'completed',
      progress: 100,
      team: ['Sarah Wilson', 'Alex Brown'],
      dueDate: '2024-01-30',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integration with third-party payment APIs',
      status: 'pending',
      progress: 25,
      team: ['John Doe', 'Mike Johnson'],
      dueDate: '2024-03-01',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Dashboard Analytics',
      description: 'Advanced analytics dashboard for user insights',
      status: 'active',
      progress: 60,
      team: ['Jane Smith', 'Sarah Wilson'],
      dueDate: '2024-02-28',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'active':
        return <ClockIcon className="h-5 w-5 text-blue-400" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">Projects</h1>
                <p className="text-lg text-[#d2d7cb]">
                  Manage and track your project progress
                </p>
              </div>
              <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-4 py-2 hover:bg-[#d4f53a] transition flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                New Project
              </button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Total Projects</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">{projects.length}</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 text-[#e6ff4a]" />
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Active</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Completed</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-[#4a5a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a8a0]">Pending</p>
                  <p className="text-2xl font-bold text-[#e6ff4a]">
                    {projects.filter(p => p.status === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-[#4a5a3a] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                    <p className="text-sm text-[#d2d7cb] mb-3">{project.description}</p>
                  </div>
                  <div className={`w-3 h-3 ${getStatusColor(project.status)} rounded-full`}></div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#a0a8a0]">Progress</span>
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-[#5a6a4a] rounded-full h-2">
                    <div 
                      className="bg-[#e6ff4a] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <UserGroupIcon className="h-4 w-4 text-[#a0a8a0]" />
                    <span className="text-[#d2d7cb]">
                      {project.team.length} team member{project.team.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-[#a0a8a0]" />
                    <span className="text-[#d2d7cb]">Due: {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                      Priority: {project.priority}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#5a6a4a] text-white text-sm font-medium rounded-md px-3 py-2 hover:bg-[#4a5a3a] transition">
                    View Details
                  </button>
                  <button className="flex-1 bg-[#5a6a4a] text-white text-sm font-medium rounded-md px-3 py-2 hover:bg-[#4a5a3a] transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create New Project Section */}
          <div className="mt-8 bg-[#4a5a3a] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <p className="text-[#d2d7cb] mb-6">
              Start a new project and assign team members
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Project name"
                className="bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a]"
              />
              <input
                type="date"
                className="bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#e6ff4a]"
              />
            </div>
            <textarea
              placeholder="Project description"
              rows={3}
              className="w-full bg-[#5a6a4a] border border-[#6a7a5a] rounded-lg px-4 py-2 text-white placeholder-[#a0a8a0] focus:outline-none focus:border-[#e6ff4a] mb-4"
            ></textarea>
            <button className="bg-[#e6ff4a] text-[#313c2c] font-semibold rounded-lg px-6 py-2 hover:bg-[#d4f53a] transition flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Create Project
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 