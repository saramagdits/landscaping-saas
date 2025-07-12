'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService, GoogleCalendar, CalendarEvent } from '@/lib/calendarService';

export const CalendarManager = () => {
  const { user, userProfile, requestCalendarAccess } = useAuth();
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isCalendarConnected = userProfile?.calendar?.isConnected || false;

  // Load user's calendars
  const loadCalendars = async () => {
    if (!user || !isCalendarConnected) return;

    try {
      setLoading(true);
      setError(null);
      const userCalendars = await calendarService.getCalendars(user.uid);
      setCalendars(userCalendars);
      
      // Select primary calendar by default
      const primaryCalendar = userCalendars.find(cal => cal.isPrimary);
      if (primaryCalendar) {
        setSelectedCalendar(primaryCalendar.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendars');
      console.error('Error loading calendars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load events for selected calendar
  const loadEvents = async (calendarId: string) => {
    if (!user || !isCalendarConnected) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get events for the next 7 days
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const calendarEvents = await calendarService.getEvents(
        user.uid,
        calendarId,
        now.toISOString(),
        nextWeek.toISOString()
      );
      setEvents(calendarEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Connect calendar (re-authenticate with calendar scope)
  const connectCalendar = async () => {
    if (!user) return;

    try {
      setIsConnecting(true);
      setError(null);
      console.log('Starting calendar connection process...');
      
      // Request calendar access with additional scopes
      await requestCalendarAccess();
      console.log('Calendar access request completed');
      
      // Reload calendars after connection
      await loadCalendars();
      console.log('Calendars loaded after connection');
    } catch (err) {
      console.error('Calendar connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect calendar');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect calendar
  const disconnectCalendar = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      await calendarService.disconnectCalendar(user.uid);
      setCalendars([]);
      setEvents([]);
      setSelectedCalendar(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect calendar');
      console.error('Error disconnecting calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle calendar selection
  const handleCalendarSelect = (calendarId: string) => {
    setSelectedCalendar(calendarId);
    loadEvents(calendarId);
  };

  // Load calendars on mount if connected
  useEffect(() => {
    if (isCalendarConnected) {
      loadCalendars();
    }
  }, [isCalendarConnected, user]);

  // Load events when calendar is selected
  useEffect(() => {
    if (selectedCalendar && isCalendarConnected) {
      loadEvents(selectedCalendar);
    }
  }, [selectedCalendar, isCalendarConnected]);

  if (!user) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">Please sign in to manage your calendar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Connection Status */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Google Calendar Integration</h2>
        
        {!isCalendarConnected ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Google Calendar</h3>
            <p className="text-gray-600 mb-6 px-4">
              Sync your Google Calendar to view and manage your events directly in the app.
            </p>
            <button
              onClick={connectCalendar}
              disabled={isConnecting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto w-full sm:w-auto justify-center"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect Google Calendar
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Calendar Connected</span>
              </div>
              <button
                onClick={disconnectCalendar}
                disabled={loading}
                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
            
            {userProfile?.calendar?.lastSync && (
              <p className="text-sm text-gray-600">
                Last synced: {new Date(userProfile.calendar.lastSync.toDate()).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Calendar List */}
      {isCalendarConnected && calendars.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Your Calendars</h3>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <button
                key={calendar.id}
                onClick={() => handleCalendarSelect(calendar.id)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors ${
                  selectedCalendar === calendar.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: calendar.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{calendar.name}</p>
                    {calendar.isPrimary && (
                      <p className="text-xs text-gray-500">Primary Calendar</p>
                    )}
                  </div>
                  {calendar.isEnabled && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex-shrink-0">
                      Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events List */}
      {isCalendarConnected && selectedCalendar && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Upcoming Events</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{event.summary}</h4>
                  {event.start.dateTime && (
                    <p className="text-sm text-gray-600">
                      {new Date(event.start.dateTime).toLocaleString()}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No upcoming events found.</p>
          )}
        </div>
      )}
    </div>
  );
}; 