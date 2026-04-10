import { CallRecording, RecordingStats } from '../types/callRecording';

// Static data - Easy to replace with API later
const STATIC_RECORDINGS: CallRecording[] = [
  {
    _id: 'rec_001',
    recordingId: 'REC-001',
    customer: { _id: 'c1', name: 'Robert Johnson', phone: '07700900123' },
    callDate: '2026-03-10T09:15:00',
    duration: 754,
    agent: { _id: 'a1', name: 'John Smith', email: 'john@example.com' },
    status: 'Available',
    fileSize: '2.4 MB',
    fileSizeBytes: 2516582,
    quality: 'HD',
    topic: 'Battery issue resolution',
    recordingUrl: '/recordings/rec_001.mp3',
    createdAt: '2026-03-10T09:15:00',
  },
  {
    _id: 'rec_002',
    recordingId: 'REC-002',
    customer: { _id: 'c2', name: 'Emily Davis', phone: '07700900124' },
    callDate: '2026-03-10T09:45:00',
    duration: 501,
    agent: { _id: 'a2', name: 'Sarah Wilson', email: 'sarah@example.com' },
    status: 'Available',
    fileSize: '1.6 MB',
    fileSizeBytes: 1677721,
    quality: 'HD',
    topic: 'Product information',
    recordingUrl: '/recordings/rec_002.mp3',
    createdAt: '2026-03-10T09:45:00',
  },
  {
    _id: 'rec_003',
    recordingId: 'REC-003',
    customer: { _id: 'c3', name: 'Michael Brown', phone: '07700900125' },
    callDate: '2026-03-10T10:20:00',
    duration: 947,
    agent: { _id: 'a3', name: 'Mike Johnson', email: 'mike@example.com' },
    status: 'Processing',
    fileSize: '3.1 MB',
    fileSizeBytes: 3250585,
    quality: 'HD',
    topic: 'Service complaint',
    recordingUrl: '/recordings/rec_003.mp3',
    createdAt: '2026-03-10T10:20:00',
  },
  {
    _id: 'rec_004',
    recordingId: 'REC-004',
    customer: { _id: 'c4', name: 'Jessica Miller', phone: '07700900126' },
    callDate: '2026-03-10T11:05:00',
    duration: 1136,
    agent: { _id: 'a4', name: 'Emma Davis', email: 'emma@example.com' },
    status: 'Available',
    fileSize: '3.8 MB',
    fileSizeBytes: 3984588,
    quality: 'HD',
    topic: 'Sales inquiry',
    recordingUrl: '/recordings/rec_004.mp3',
    createdAt: '2026-03-10T11:05:00',
  },
  {
    _id: 'rec_005',
    recordingId: 'REC-005',
    customer: { _id: 'c5', name: 'David Wilson', phone: '07700900127' },
    callDate: '2026-03-10T11:30:00',
    duration: 612,
    agent: { _id: 'a5', name: 'Tom Brown', email: 'tom@example.com' },
    status: 'Available',
    fileSize: '2.0 MB',
    fileSizeBytes: 2097152,
    quality: 'Standard',
    topic: 'Warranty claim',
    recordingUrl: '/recordings/rec_005.mp3',
    createdAt: '2026-03-10T11:30:00',
  },
  {
    _id: 'rec_006',
    recordingId: 'REC-006',
    customer: { _id: 'c6', name: 'Linda Anderson', phone: '07700900128' },
    callDate: '2026-03-10T12:15:00',
    duration: 405,
    agent: { _id: 'a1', name: 'John Smith', email: 'john@example.com' },
    status: 'Available',
    fileSize: '1.3 MB',
    fileSizeBytes: 1363148,
    quality: 'HD',
    topic: 'Parts inquiry',
    recordingUrl: '/recordings/rec_006.mp3',
    createdAt: '2026-03-10T12:15:00',
  },
  {
    _id: 'rec_007',
    recordingId: 'REC-007',
    customer: { _id: 'c7', name: 'James Taylor', phone: '07700900129' },
    callDate: '2026-03-10T13:00:00',
    duration: 1338,
    agent: { _id: 'a2', name: 'Sarah Wilson', email: 'sarah@example.com' },
    status: 'Processing',
    fileSize: '4.5 MB',
    fileSizeBytes: 4718592,
    quality: 'HD',
    topic: 'Technical support',
    recordingUrl: '/recordings/rec_007.mp3',
    createdAt: '2026-03-10T13:00:00',
  },
  {
    _id: 'rec_008',
    recordingId: 'REC-008',
    customer: { _id: 'c8', name: 'Patricia Martin', phone: '07700900130' },
    callDate: '2026-03-10T13:45:00',
    duration: 873,
    agent: { _id: 'a3', name: 'Mike Johnson', email: 'mike@example.com' },
    status: 'Available',
    fileSize: '2.9 MB',
    fileSizeBytes: 3040870,
    quality: 'HD',
    topic: 'Quality concern',
    recordingUrl: '/recordings/rec_008.mp3',
    createdAt: '2026-03-10T13:45:00',
  },
];

const STATIC_STATS: RecordingStats = {
  totalRecordings: 248,
  todayRecordings: 32,
  processingCount: 5,
  storageUsed: '1.8 GB',
  storageUsedBytes: 1932735283,
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const callRecordingService = {
  // Get all recordings
  async getRecordings(filters?: { search?: string; status?: string }): Promise<CallRecording[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-recordings', { method: 'GET', params: filters });
    // return response.data;
    
    await delay(500);
    let filtered = [...STATIC_RECORDINGS];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(rec =>
        rec.recordingId.toLowerCase().includes(search) ||
        rec.customer.name.toLowerCase().includes(search) ||
        rec.topic.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status && filters.status !== 'All') {
      filtered = filtered.filter(rec => rec.status === filters.status);
    }
    
    return filtered;
  },

  // Get recording stats
  async getStats(): Promise<RecordingStats> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-recordings/stats', { method: 'GET' });
    // return response.data;
    
    await delay(300);
    return STATIC_STATS;
  },

  // Get single recording
  async getRecordingById(id: string): Promise<CallRecording | null> {
    // TODO: Replace with actual API call
    await delay(300);
    return STATIC_RECORDINGS.find(rec => rec._id === id) || null;
  },

  // Download recording
  async downloadRecording(id: string): Promise<void> {
    // TODO: Replace with actual API call
    // const response = await apiHelper(`/call-recordings/${id}/download`, { method: 'GET', responseType: 'blob' });
    
    await delay(500);
    const recording = STATIC_RECORDINGS.find(rec => rec._id === id);
    if (recording) {
      // Simulate download
      window.open(recording.recordingUrl, '_blank');
    }
  },

  // Bulk download
  async bulkDownload(ids: string[]): Promise<void> {
    // TODO: Replace with actual API call
    await delay(1000);
    console.log('Bulk downloading:', ids);
  },

  // Update recording status
  async updateStatus(id: string, status: string): Promise<CallRecording> {
    // TODO: Replace with actual API call
    await delay(300);
    const recording = STATIC_RECORDINGS.find(rec => rec._id === id);
    if (recording) {
      recording.status = status as any;
    }
    return recording as CallRecording;
  },
};