'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { FullCalendarManager } from '@/components/FullCalendarManager';

export default function JobsPage() {

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Job Management</h1>
            <p className="text-lg text-[#d2d7cb]">
              Schedule and manage your jobs with our integrated calendar system
            </p>
          </div>

          {/* Full Calendar Manager */}
          <FullCalendarManager />
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
} 