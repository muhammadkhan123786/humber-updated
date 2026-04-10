import { FollowUp, FollowUpStats } from '../types/followUp';

// Static data - Easy to replace with API later
const STATIC_FOLLOW_UPS: FollowUp[] = [
  {
    _id: 'fu_001',
    followUpId: 'FU-001',
    customer: { _id: 'c1', name: 'Robert Johnson', phone: '07700900123' },
    relatedCallId: 'CL-1001',
    agent: { _id: 'a1', name: 'John Smith', email: 'john@example.com' },
    followUpDate: '2026-03-12',
    dueTime: '10:00 AM',
    status: 'Pending',
    priority: 'High',
    notes: 'Follow up on battery replacement confirmation',
    daysRemaining: 2,
    createdAt: '2026-03-10T08:00:00',
  },
  {
    _id: 'fu_002',
    followUpId: 'FU-002',
    customer: { _id: 'c2', name: 'Emily Davis', phone: '07700900124' },
    relatedCallId: 'CL-1002',
    agent: { _id: 'a2', name: 'Sarah Wilson', email: 'sarah@example.com' },
    followUpDate: '2026-03-11',
    dueTime: '02:00 PM',
    status: 'Pending',
    priority: 'Medium',
    notes: 'Send product catalog and pricing',
    daysRemaining: 1,
    createdAt: '2026-03-10T09:00:00',
  },
  {
    _id: 'fu_003',
    followUpId: 'FU-003',
    customer: { _id: 'c3', name: 'Michael Brown', phone: '07700900125' },
    relatedCallId: 'CL-1003',
    agent: { _id: 'a3', name: 'Mike Johnson', email: 'mike@example.com' },
    followUpDate: '2026-03-10',
    dueTime: '04:00 PM',
    status: 'Escalated',
    priority: 'Critical',
    notes: 'Urgent: Address service delay concern',
    daysRemaining: 0,
    createdAt: '2026-03-08T10:00:00',
  },
  {
    _id: 'fu_004',
    followUpId: 'FU-004',
    customer: { _id: 'c4', name: 'Jessica Miller', phone: '07700900126' },
    relatedCallId: 'CL-1004',
    agent: { _id: 'a4', name: 'Emma Davis', email: 'emma@example.com' },
    followUpDate: '2026-03-13',
    dueTime: '11:00 AM',
    status: 'Pending',
    priority: 'Low',
    notes: 'Schedule product demonstration',
    daysRemaining: 3,
    createdAt: '2026-03-10T11:00:00',
  },
  {
    _id: 'fu_005',
    followUpId: 'FU-005',
    customer: { _id: 'c5', name: 'David Wilson', phone: '07700900127' },
    relatedCallId: 'CL-1005',
    agent: { _id: 'a5', name: 'Tom Brown', email: 'tom@example.com' },
    followUpDate: '2026-03-09',
    dueTime: '09:00 AM',
    status: 'Completed',
    priority: 'Medium',
    notes: 'Warranty claim processed successfully',
    daysRemaining: -1,
    createdAt: '2026-03-07T14:00:00',
    completedAt: '2026-03-09T10:00:00',
  },
  {
    _id: 'fu_006',
    followUpId: 'FU-006',
    customer: { _id: 'c6', name: 'Linda Anderson', phone: '07700900128' },
    relatedCallId: 'CL-1006',
    agent: { _id: 'a1', name: 'John Smith', email: 'john@example.com' },
    followUpDate: '2026-03-08',
    dueTime: '03:00 PM',
    status: 'Completed',
    priority: 'Low',
    notes: 'Parts delivered to customer',
    daysRemaining: -2,
    createdAt: '2026-03-06T09:00:00',
    completedAt: '2026-03-08T16:00:00',
  },
  {
    _id: 'fu_007',
    followUpId: 'FU-007',
    customer: { _id: 'c7', name: 'James Taylor', phone: '07700900129' },
    relatedCallId: 'CL-1007',
    agent: { _id: 'a2', name: 'Sarah Wilson', email: 'sarah@example.com' },
    followUpDate: '2026-03-14',
    dueTime: '01:00 PM',
    status: 'Pending',
    priority: 'High',
    notes: 'Technical issue resolution verification',
    daysRemaining: 4,
    createdAt: '2026-03-10T13:00:00',
  },
  {
    _id: 'fu_008',
    followUpId: 'FU-008',
    customer: { _id: 'c8', name: 'Patricia Martin', phone: '07700900130' },
    relatedCallId: 'CL-1008',
    agent: { _id: 'a3', name: 'Mike Johnson', email: 'mike@example.com' },
    followUpDate: '2026-03-11',
    dueTime: '10:30 AM',
    status: 'Escalated',
    priority: 'Critical',
    notes: 'Quality assurance manager review required',
    daysRemaining: 1,
    createdAt: '2026-03-09T15:00:00',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const followUpService = {
  // Get all follow-ups with filters
  async getFollowUps(filters?: { search?: string; status?: string; priority?: string }): Promise<FollowUp[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/follow-ups', { method: 'GET', params: filters });
    // return response.data;
    
    await delay(500);
    let filtered = [...STATIC_FOLLOW_UPS];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(fu =>
        fu.followUpId.toLowerCase().includes(search) ||
        fu.customer.name.toLowerCase().includes(search) ||
        fu.relatedCallId.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status && filters.status !== 'All') {
      filtered = filtered.filter(fu => fu.status === filters.status);
    }
    
    if (filters?.priority && filters.priority !== 'All') {
      filtered = filtered.filter(fu => fu.priority === filters.priority);
    }
    
    return filtered;
  },

  // Get follow-up statistics
  async getStats(): Promise<FollowUpStats> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/follow-ups/stats', { method: 'GET' });
    // return response.data;
    
    await delay(300);
    const pending = STATIC_FOLLOW_UPS.filter(fu => fu.status === 'Pending');
    return {
      pendingCount: pending.length,
      dueTodayCount: pending.filter(fu => fu.daysRemaining === 0).length,
      overdueCount: pending.filter(fu => fu.daysRemaining < 0).length,
      completedCount: STATIC_FOLLOW_UPS.filter(fu => fu.status === 'Completed').length,
      escalatedCount: STATIC_FOLLOW_UPS.filter(fu => fu.status === 'Escalated').length,
    };
  },

  // Complete follow-up
  async completeFollowUp(id: string): Promise<FollowUp> {
    // TODO: Replace with actual API call
    // const response = await apiHelper(`/follow-ups/${id}/complete`, { method: 'PATCH' });
    // return response.data;
    
    await delay(300);
    const followUp = STATIC_FOLLOW_UPS.find(fu => fu._id === id);
    if (followUp) {
      followUp.status = 'Completed';
      followUp.completedAt = new Date().toISOString();
    }
    return followUp as FollowUp;
  },

  // Reschedule follow-up
  async rescheduleFollowUp(id: string, newDate: string, newTime: string): Promise<FollowUp> {
    // TODO: Replace with actual API call
    // const response = await apiHelper(`/follow-ups/${id}/reschedule`, { 
    //   method: 'PATCH', 
    //   body: JSON.stringify({ followUpDate: newDate, dueTime: newTime })
    // });
    // return response.data;
    
    await delay(300);
    const followUp = STATIC_FOLLOW_UPS.find(fu => fu._id === id);
    if (followUp) {
      followUp.followUpDate = newDate;
      followUp.dueTime = newTime;
      followUp.status = 'Pending';
    }
    return followUp as FollowUp;
  },

  // Create new follow-up
  async createFollowUp(data: Partial<FollowUp>): Promise<FollowUp> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/follow-ups', { method: 'POST', body: JSON.stringify(data) });
    // return response.data;
    
    await delay(500);
    const newFollowUp = {
      _id: `fu_${Date.now()}`,
      followUpId: `FU-${String(STATIC_FOLLOW_UPS.length + 1).padStart(3, '0')}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as FollowUp;
    return newFollowUp;
  },
};