'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService, CalendarEvent } from '@/lib/calendarService';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const CalendarWidget = () => {
  const { user, userProfile } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCalendarConnected = userProfile?.calendar?.isConnected || false;

  // Load upcoming events
  const loadUpcomingEvents = async () => {
    if (!user || !isCalendarConnected) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get events for the next 3 days
      const now = new Date();
      const next3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      // Get primary calendar events
      const primaryCalendar = userProfile?.calendar?.calendars?.find(cal => cal.isPrimary);
      if (!primaryCalendar) return;

      const calendarEvents = await calendarService.getEvents(
        user.uid,
        primaryCalendar.id,
        now.toISOString(),
        next3Days.toISOString()
      );
      
      // Sort by start time and limit to 5 events
      const sortedEvents = calendarEvents
        .sort((a, b) => new Date(a.start.dateTime || a.start.date || '').getTime() - 
                       new Date(b.start.dateTime || b.start.date || '').getTime())
        .slice(0, 5);
      
      setEvents(sortedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load events on mount if calendar is connected
  useEffect(() => {
    if (isCalendarConnected) {
      loadUpcomingEvents();
    }
  }, [isCalendarConnected, user]);

  if (!user) {
    return null;
  }

  if (!isCalendarConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        </div>
        <div className="text-center py-6">
          <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-3">Connect your Google Calendar to see upcoming events</p>
          <a
            href="/settings?tab=calendar"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Connect Calendar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <button
          onClick={loadUpcomingEvents}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
              <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{event.summary}</h4>
              
              {event.start.dateTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {new Date(event.start.dateTime).toLocaleDateString()} at{' '}
                    {new Date(event.start.dateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <CalendarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">No upcoming events</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href="/settings?tab=calendar"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all events →
          </a>
        </div>
      )}
    </div>
  );
}; 