'use client';

import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useAuth } from '@/contexts/AuthContext';
import { jobService, JobEvent, CreateJobData } from '@/lib/jobService';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: JobEvent | null;
  onSave: (event: CreateJobData) => void;
  onDelete?: () => void;
}

const EventModal = ({ isOpen, onClose, event, onSave, onDelete }: EventModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    client: '',
    status: 'scheduled' as 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: '',
    notes: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start: event.start.toISOString().slice(0, 16),
        end: event.end.toISOString().slice(0, 16),
        location: event.location || '',
        client: event.client || '',
        status: event.status,
        priority: event.priority,
        assignedTo: event.assignedTo || '',
        notes: event.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        start: '',
        end: '',
        location: '',
        client: '',
        status: 'scheduled',
        priority: 'medium',
        assignedTo: '',
        notes: ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      start: new Date(formData.start),
      end: new Date(formData.end),
      location: formData.location,
      client: formData.client,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      notes: formData.notes
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assigned To
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            {event && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {event ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const FullCalendarManager = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<JobEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load events from Firebase
  const loadEvents = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      
      const loadedEvents = await jobService.getJobs(user.uid);
      setEvents(loadedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error loading events:', err);
    }
  }, [user]);

  // Create new event
  const createEvent = async (eventData: CreateJobData) => {
    if (!user) return;

    try {
      setError(null);
      await jobService.createJob(user.uid, eventData);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  // Update existing event
  const updateEvent = async (eventData: CreateJobData) => {
    if (!user || !selectedEvent) return;

    try {
      setError(null);
      await jobService.updateJob(selectedEvent.id, user.uid, eventData);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  // Delete event
  const deleteEvent = async () => {
    if (!user || !selectedEvent) return;

    try {
      setError(null);
      await jobService.deleteJob(selectedEvent.id, user.uid);
      await loadEvents();
      setModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  // Handle date click
  const handleDateClick = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  // Handle event click
  const handleEventClick = (arg: { event: { id: string } }) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      setModalOpen(true);
    }
  };

  // Handle event drop/resize
  const handleEventDrop = async (arg: any) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event && user && arg.event.start) {
      try {
        await jobService.updateJob(event.id, user.uid, {
          start: arg.event.start,
          end: arg.event.end || arg.event.start
        });
        await loadEvents();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update event');
        console.error('Error updating event:', err);
      }
    }
  };

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">Please sign in to manage your jobs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Calendar</h2>
            <p className="text-gray-600">Manage and schedule your jobs</p>
          </div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            events={events.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              backgroundColor: getEventColor(event.status, event.priority),
              borderColor: getEventColor(event.status, event.priority),
              extendedProps: {
                description: event.description,
                location: event.location,
                client: event.client,
                status: event.status,
                priority: event.priority,
                assignedTo: event.assignedTo,
                notes: event.notes
              }
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
            // Mobile-specific settings
            dayCellContent={(arg) => (
              <div className="text-xs sm:text-sm">{arg.dayNumberText}</div>
            )}
            eventContent={(arg) => (
              <div className="text-xs sm:text-sm font-medium truncate">
                {arg.event.title}
              </div>
            )}
            // Responsive breakpoints
            views={{
              dayGridMonth: {
                dayMaxEvents: 3,
                moreLinkClick: 'popover'
              },
              timeGridWeek: {
                dayMaxEvents: 2
              },
              listWeek: {
                noEventsMessage: 'No jobs scheduled this week'
              }
            }}
          />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={selectedEvent ? updateEvent : createEvent}
        onDelete={selectedEvent ? deleteEvent : undefined}
      />
    </div>
  );
};

// Helper function to get event color based on status and priority
function getEventColor(status: string, priority: string): string {
  const colors = {
    scheduled: {
      low: '#10B981', // green-500
      medium: '#F59E0B', // amber-500
      high: '#EF4444' // red-500
    },
    'in-progress': {
      low: '#3B82F6', // blue-500
      medium: '#8B5CF6', // violet-500
      high: '#DC2626' // red-600
    },
    completed: {
      low: '#6B7280', // gray-500
      medium: '#6B7280', // gray-500
      high: '#6B7280' // gray-500
    },
    cancelled: {
      low: '#9CA3AF', // gray-400
      medium: '#9CA3AF', // gray-400
      high: '#9CA3AF' // gray-400
    }
  };

  return colors[status as keyof typeof colors]?.[priority as keyof typeof colors.scheduled] || '#6B7280';
} 