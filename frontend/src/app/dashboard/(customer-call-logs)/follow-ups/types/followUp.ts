export interface FollowUp {
  _id: string;
  followUpId: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  relatedCallId: string;
  agent: {
    _id: string;
    name: string;
    email: string;
  };
  followUpDate: string;
  dueTime: string;
  status: 'Pending' | 'Completed' | 'Escalated';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  notes: string;
  daysRemaining: number;
  createdAt: string;
  completedAt?: string;
}

export interface FollowUpStats {
  pendingCount: number;
  dueTodayCount: number;
  overdueCount: number;
  completedCount: number;
  escalatedCount: number;
}