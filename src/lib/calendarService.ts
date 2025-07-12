import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface GoogleCalendar {
  id: string;
  name: string;
  color: string;
  isPrimary: boolean;
  isEnabled: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  organizer?: {
    email: string;
    displayName?: string;
  };
  htmlLink?: string;
  created: string;
  updated: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private readonly GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

  private constructor() {}

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  // Get user's calendars
  async getCalendars(uid: string): Promise<GoogleCalendar[]> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const calendar = userData.calendar;

      if (!calendar?.isConnected || !calendar.accessToken) {
        throw new Error('Calendar not connected');
      }

      // Check if token is expired and refresh if needed
      const accessToken = await this.refreshTokenIfNeeded(uid, calendar);

      const response = await fetch(`${this.GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch calendars: ${response.statusText}`);
      }

      const data = await response.json();
      const calendars: GoogleCalendar[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.summary,
        color: item.backgroundColor || '#4285f4',
        isPrimary: item.primary || false,
        isEnabled: item.selected || false,
      }));

      // Update user's calendar list
      await this.updateUserCalendars(uid, calendars);

      return calendars;
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

  // Get events from a specific calendar
  async getEvents(uid: string, calendarId: string, timeMin?: string, timeMax?: string): Promise<CalendarEvent[]> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const calendar = userData.calendar;

      if (!calendar?.isConnected || !calendar.accessToken) {
        throw new Error('Calendar not connected');
      }

      // Check if token is expired and refresh if needed
      const accessToken = await this.refreshTokenIfNeeded(uid, calendar);

      const params = new URLSearchParams({
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      if (timeMin) params.append('timeMin', timeMin);
      if (timeMax) params.append('timeMax', timeMax);

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Create a new event
  async createEvent(uid: string, calendarId: string, event: Omit<CalendarEvent, 'id' | 'created' | 'updated'>): Promise<CalendarEvent> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const calendar = userData.calendar;

      if (!calendar?.isConnected || !calendar.accessToken) {
        throw new Error('Calendar not connected');
      }

      // Check if token is expired and refresh if needed
      const accessToken = await this.refreshTokenIfNeeded(uid, calendar);

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update an existing event
  async updateEvent(uid: string, calendarId: string, eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const calendar = userData.calendar;

      if (!calendar?.isConnected || !calendar.accessToken) {
        throw new Error('Calendar not connected');
      }

      // Check if token is expired and refresh if needed
      const accessToken = await this.refreshTokenIfNeeded(uid, calendar);

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(uid: string, calendarId: string, eventId: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const calendar = userData.calendar;

      if (!calendar?.isConnected || !calendar.accessToken) {
        throw new Error('Calendar not connected');
      }

      // Check if token is expired and refresh if needed
      const accessToken = await this.refreshTokenIfNeeded(uid, calendar);

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Refresh access token if expired
  private async refreshTokenIfNeeded(uid: string, calendar: any): Promise<string> {
    if (!calendar.refreshToken) {
      console.warn('No refresh token available, using current access token');
      return calendar.accessToken;
    }

    // Check if token is expired (with 5 minute buffer)
    const now = Date.now();
    const expiryTime = calendar.tokenExpiry || 0;
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (now >= (expiryTime - bufferTime)) {
      // Token is expired or will expire soon, refresh it
      try {
        const newTokens = await this.refreshAccessToken(calendar.refreshToken);
        
        // Filter out undefined values from calendar object before spreading
        const filteredCalendar = Object.fromEntries(
          Object.entries(calendar).filter(([_, value]) => value !== undefined)
        );
        
        // Update user's tokens in Firestore
        await setDoc(doc(db, 'users', uid), {
          calendar: {
            ...filteredCalendar,
            accessToken: newTokens.access_token,
            tokenExpiry: now + (newTokens.expires_in * 1000),
            lastSync: new Date(),
          },
        }, { merge: true });

        return newTokens.access_token;
      } catch (error) {
        console.warn('Failed to refresh token, using current access token:', error);
        return calendar.accessToken;
      }
    }

    return calendar.accessToken;
  }

  // Refresh access token using refresh token
  private async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  // Update user's calendar list in Firestore
  private async updateUserCalendars(uid: string, calendars: GoogleCalendar[]): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
      calendar: {
        calendars,
        lastSync: new Date(),
      },
    }, { merge: true });
  }

  // Connect calendar (store tokens after OAuth)
  async connectCalendar(uid: string, accessToken: string, refreshToken?: string): Promise<void> {
    const now = Date.now();
    const expiryTime = now + (3600 * 1000); // Assume 1 hour expiry if not provided

    console.log('Connecting calendar for user:', uid, 'Has refresh token:', !!refreshToken);

    // Create calendar object without undefined values
    const calendarData: any = {
      isConnected: true,
      accessToken,
      tokenExpiry: expiryTime,
      lastSync: new Date(),
      calendars: [],
    };

    // Only add refreshToken if it's provided
    if (refreshToken) {
      calendarData.refreshToken = refreshToken;
    }

    await setDoc(doc(db, 'users', uid), {
      calendar: calendarData,
    }, { merge: true });

    console.log('Calendar connection data stored in Firestore');
  }

  // Disconnect calendar
  async disconnectCalendar(uid: string): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
      calendar: {
        isConnected: false,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        lastSync: null,
        calendars: [],
      },
    }, { merge: true });
  }
}

export const calendarService = GoogleCalendarService.getInstance(); 