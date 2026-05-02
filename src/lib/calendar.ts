/**
 * Fetches the team's availability from Google Calendar.
 * MOCKED for demo purposes to avoid API/OAuth errors.
 */
export async function getTeamAvailability(timeMin: string, timeMax: string) {
  console.log("Using Mock Calendar Data to bypass API limitations.");
  return [
    {
      id: "mock_event_1",
      summary: "Team Sync & Planning",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
    },
    {
      id: "mock_event_2",
      summary: "Google Cloud Architecture Review",
      start: { dateTime: new Date(Date.now() + 7200000).toISOString() },
      end: { dateTime: new Date(Date.now() + 10800000).toISOString() },
    }
  ];
}
