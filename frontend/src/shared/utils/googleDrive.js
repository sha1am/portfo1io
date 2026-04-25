const DRIVE_FILE_URL_PATTERN = /\/d\/([^/]+)/;

export const getGoogleDriveFileId = (urlOrId) => {
  if (!urlOrId) {
    throw new Error('A Google Drive file URL or id is required.');
  }

  const match = urlOrId.match(DRIVE_FILE_URL_PATTERN);
  return match ? match[1] : urlOrId;
};

export const createGoogleDriveAsset = (urlOrId) => {
  const fileId = getGoogleDriveFileId(urlOrId);
  const previewBaseUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return {
    fileId,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    previewUrl: previewBaseUrl,
    firstPagePreviewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
};
