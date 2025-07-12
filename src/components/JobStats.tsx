'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { jobService } from '@/lib/jobService';

interface JobStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export const JobStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const jobStats = await jobService.getJobStats(user.uid);
        setStats(jobStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job statistics');
        console.error('Error loading job stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Jobs</div>
        </div>

        {/* Scheduled Jobs */}
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>

        {/* In Progress Jobs */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>

        {/* Completed Jobs */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Priority Breakdown</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{stats.highPriority}</div>
            <div className="text-xs text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-amber-600">{stats.mediumPriority}</div>
            <div className="text-xs text-gray-600">Medium Priority</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{stats.lowPriority}</div>
            <div className="text-xs text-gray-600">Low Priority</div>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Status Progress</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Scheduled</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.scheduled / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{stats.scheduled}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">In Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{stats.inProgress}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{stats.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 