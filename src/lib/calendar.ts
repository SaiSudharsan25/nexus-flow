import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';

/**
 * Fetches the team's availability from Google Calendar.
 */
export async function getTeamAvailability(timeMin: string, timeMax: string) {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    // The ID of the team's shared calendar
    const calendarId = process.env.TEAM_CALENDAR_ID || 'primary';

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    throw new Error('Failed to fetch calendar availability');
  }
}
