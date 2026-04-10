export interface CallRecording {
  _id: string;
  recordingId: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  callDate: string;
  duration: number; // in seconds
  agent: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'Available' | 'Processing' | 'Transcribing' | 'Archived';
  fileSize: string; // in MB
  fileSizeBytes: number;
  quality: 'HD' | 'Standard';
  topic: string;
  recordingUrl: string;
  transcript?: string;
  createdAt: string;
}

export interface RecordingStats {
  totalRecordings: number;
  todayRecordings: number;
  processingCount: number;
  storageUsed: string;
  storageUsedBytes: number;
}