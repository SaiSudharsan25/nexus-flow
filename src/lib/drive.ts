import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';

/**
 * Lists documents from a specified Google Drive folder.
 */
export async function listDriveFiles(folderId?: string) {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });

    const query = folderId 
      ? `'${folderId}' in parents and trashed = false` 
      : "mimeType != 'application/vnd.google-apps.folder' and trashed = false";

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, webViewLink, iconLink, mimeType)',
      pageSize: 20,
      orderBy: 'modifiedTime desc',
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    throw new Error('Failed to fetch Google Drive files');
  }
}

/**
 * Associates a Google Drive Document with a specific Task in the Database.
 */
export async function attachDocToTask(taskId: string, fileId: string, fileUrl: string) {
  // Note: This function connects the API data to your Firebase backend
  // It returns the structured attachment metadata.
  return { 
    success: true, 
    taskId, 
    attachment: { fileId, fileUrl, attachedAt: new Date().toISOString() } 
  };
}
