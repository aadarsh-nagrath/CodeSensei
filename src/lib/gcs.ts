import { Storage } from '@google-cloud/storage';

// Lazy initialization to avoid build-time errors
let storage: Storage | null = null;
let bucketName: string | null = null;

function getStorage() {
  if (!storage) {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
      throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required');
    }
    
    // Initialize Google Cloud Storage
    // For Workload Identity, we don't need to specify credentials
    // GCP automatically injects temporary credentials for the attached service account
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      // No keyFilename needed for Workload Identity
    });
  }
  return storage;
}

function getBucketName() {
  if (!bucketName) {
    bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || null;
    if (!bucketName) {
      throw new Error('GOOGLE_CLOUD_BUCKET_NAME environment variable is required');
    }
  }
  return bucketName;
}

export function getBucket() {
  return getStorage().bucket(getBucketName());
}

// Upload file to GCS
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const bucket = getBucket();
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(file, {
      metadata: {
        contentType,
      },
      public: true, // Make the file publicly accessible
    });

    // Return the public URL
    return `https://storage.googleapis.com/${getBucketName()}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw new Error('Failed to upload file to Google Cloud Storage');
  }
}

// Delete file from GCS
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const bucket = getBucket();
    await bucket.file(fileName).delete();
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw new Error('Failed to delete file from Google Cloud Storage');
  }
}

// Generate unique filename
export function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `profile-images/${userId}/${timestamp}.${extension}`;
}
