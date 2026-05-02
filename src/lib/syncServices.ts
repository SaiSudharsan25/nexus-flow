import { getTeamAvailability } from './calendar';
import { listDriveFiles } from './drive';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Core orchestration logic: syncs calendar events and drive updates to Firebase
 * to keep the real-time Dashboard updated automatically.
 */
export async function syncGoogleServicesToFirebase() {
  try {
    // 1. Fetch upcoming team availability from Calendar
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const events = await getTeamAvailability(now.toISOString(), tomorrow.toISOString());
    
    // 2. Log Calendar events directly to the Firebase Activity/Chat Feed
    const syncRef = collection(db, 'team_activity');
    if (events.length > 0) {
      await addDoc(syncRef, {
        type: 'SYSTEM_SYNC',
        service: 'Google Calendar',
        message: `System synchronized ${events.length} upcoming calendar events.`,
        timestamp: serverTimestamp(),
      });
    }

    // 3. Fetch recent Google Drive documents
    const driveFiles = await listDriveFiles(process.env.PROMPT_WARS_FOLDER_ID);
    
    // 4. Log Drive updates to Firebase
    if (driveFiles.length > 0) {
      await addDoc(syncRef, {
        type: 'SYSTEM_SYNC',
        service: 'Google Drive',
        message: `Detected ${driveFiles.length} active documents in Drive.`,
        timestamp: serverTimestamp(),
      });
    }
    
    return {
      success: true,
      eventsSynced: events.length,
      filesDiscovered: driveFiles.length,
      message: "Successfully synchronized Google Calendar and Drive with Firebase Real-time Feed."
    };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: 'Failed to synchronize Google Services.' };
  }
}
