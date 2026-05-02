/**
 * Lists documents from a specified Google Drive folder.
 * MOCKED for demo purposes to avoid API/OAuth errors.
 */
export async function listDriveFiles(folderId?: string) {
  console.log("Using Mock Drive Data to bypass API limitations.");
  return [
    {
      id: "mock_doc_1",
      name: "NexusFlow Architecture Diagram",
      webViewLink: "https://drive.google.com/mock1",
      iconLink: "https://ssl.gstatic.com/docs/doclist/images/icon_11_image_list.png",
      mimeType: "image/png"
    },
    {
      id: "mock_doc_2",
      name: "Prompt Wars Presentation Deck",
      webViewLink: "https://drive.google.com/mock2",
      iconLink: "https://ssl.gstatic.com/docs/doclist/images/icon_11_presentation_list.png",
      mimeType: "application/vnd.google-apps.presentation"
    }
  ];
}

export async function attachDocToTask(taskId: string, fileId: string, fileUrl: string) {
  return { 
    success: true, 
    taskId, 
    attachment: { fileId, fileUrl, attachedAt: new Date().toISOString() } 
  };
}
