// import { CallLog, FollowUpReminder, DashboardStats, CallTrendData, CallTypeData, AgentPerformance } from '../types/callLog';
// import { apiHelper } from '@/helper/apiHelper';

// export const callLogService = {
//   // Get dashboard statistics
//   async getStats(): Promise<DashboardStats> {
//     const response = await apiHelper('/call-logs/stats', {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Get call trend data
//   async getCallTrend(): Promise<CallTrendData[]> {
//     const response = await apiHelper('/call-logs/trend', {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Get call type distribution
//   async getCallTypeDistribution(): Promise<CallTypeData[]> {
//     const response = await apiHelper('/call-logs/call-types', {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Get agent performance
//   async getAgentPerformance(): Promise<AgentPerformance[]> {
//     const response = await apiHelper('/call-logs/agent-performance', {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Get recent calls
//   async getRecentCalls(limit: number = 10): Promise<CallLog[]> {
//     const response = await apiHelper(`/call-logs/recent?limit=${limit}`, {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Get follow-up reminders
//   async getFollowUpReminders(): Promise<FollowUpReminder[]> {
//     const response = await apiHelper('/call-logs/follow-ups', {
//       method: 'GET',
//     });
//     return response.data;
//   },

//   // Create new call log
//   async createCallLog(data: Partial<CallLog>): Promise<CallLog> {
//     const response = await apiHelper('/call-logs', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//     return response.data;
//   },

//   // Update call log status
//   async updateCallStatus(id: string, status: string): Promise<CallLog> {
//     const response = await apiHelper(`/call-logs/${id}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     });
//     return response.data;
//   },

//   // Complete follow-up
//   async completeFollowUp(id: string): Promise<void> {
//     await apiHelper(`/call-logs/follow-ups/${id}/complete`, {
//       method: 'PATCH',
//     });
//   },
// };






import { CallLog, FollowUpReminder, DashboardStats, CallTrendData, CallTypeData, AgentPerformance } from '../types/callLog';

// Static data - Easy to replace with API later
const STATIC_DATA = {
  stats: {
    totalCallsToday: 159,
    missedCalls: 8,
    pendingFollowUps: 23,
    resolvedIssues: 142,
    avgResponseTime: 4.2,
    activeTickets: 34,
  },
  callTrend: [
    { time: '9 AM', calls: 12 },
    { time: '10 AM', calls: 18 },
    { time: '11 AM', calls: 25 },
    { time: '12 PM', calls: 20 },
    { time: '1 PM', calls: 15 },
    { time: '2 PM', calls: 22 },
    { time: '3 PM', calls: 28 },
    { time: '4 PM', calls: 19 },
  ],
  callTypes: [
    { name: 'Inquiry', value: 45, color: '#3B82F6' },
    { name: 'Complaint', value: 25, color: '#EF4444' },
    { name: 'Sales Lead', value: 20, color: '#10B981' },
    { name: 'Support', value: 35, color: '#F59E0B' },
  ],
  agentPerformance: [
    { agent: 'John', calls: 45, resolved: 40 },
    { agent: 'Sarah', calls: 52, resolved: 48 },
    { agent: 'Mike', calls: 38, resolved: 35 },
    { agent: 'Emma', calls: 41, resolved: 39 },
    { agent: 'Tom', calls: 36, resolved: 32 },
  ],
  recentCalls: [
    {
      _id: '1',
      callId: 'CL-001',
      customer: { _id: 'c1', name: 'Robert Johnson', phone: '07700900123' },
      callType: 'Support' as const,
      agent: { _id: 'a1', name: 'John Smith', email: 'john@example.com' },
      status: 'Resolved',
      priority: 'High',
      duration: 320,
      timestamp: new Date().toISOString(),
      followUpRequired: false,
    },
    {
      _id: '2',
      callId: 'CL-002',
      customer: { _id: 'c2', name: 'Emily Davis', phone: '07700900124' },
      callType: 'Inquiry' as const,
      agent: { _id: 'a2', name: 'Sarah Wilson', email: 'sarah@example.com' },
      status: 'In Progress',
      priority: 'Medium',
      duration: 180,
      timestamp: new Date().toISOString(),
      followUpRequired: true,
    },
    {
      _id: '3',
      callId: 'CL-003',
      customer: { _id: 'c3', name: 'Michael Brown', phone: '07700900125' },
      callType: 'Complaint' as const,
      agent: { _id: 'a3', name: 'Mike Johnson', email: 'mike@example.com' },
      status: 'Escalated',
      priority: 'Critical',
      duration: 450,
      timestamp: new Date().toISOString(),
      followUpRequired: true,
    },
    {
      _id: '4',
      callId: 'CL-004',
      customer: { _id: 'c4', name: 'Jessica Miller', phone: '07700900126' },
      callType: 'Sales Lead' as const,
      agent: { _id: 'a4', name: 'Emma Davis', email: 'emma@example.com' },
      status: 'Follow-Up',
      priority: 'Low',
      duration: 210,
      timestamp: new Date().toISOString(),
      followUpRequired: true,
    },
    {
      _id: '5',
      callId: 'CL-005',
      customer: { _id: 'c5', name: 'David Wilson', phone: '07700900127' },
      callType: 'Support' as const,
      agent: { _id: 'a5', name: 'Tom Brown', email: 'tom@example.com' },
      status: 'Pending',
      priority: 'Medium',
      duration: 150,
      timestamp: new Date().toISOString(),
      followUpRequired: false,
    },
  ] as CallLog[],
  followUps: [
    {
      _id: 'fu1',
      reminderId: 'FU-001',
      customer: 'Robert Johnson',
      customerId: 'c1',
      callId: 'CL-001',
      dueDate: '2026-03-10',
      dueTime: '04:00 PM',
      status: 'overdue' as const,
      priority: 'High' as const,
      notes: 'Follow up on battery replacement confirmation',
      agent: 'John Smith',
      agentId: 'a1',
    },
    {
      _id: 'fu2',
      reminderId: 'FU-003',
      customer: 'Michael Brown',
      customerId: 'c3',
      callId: 'CL-003',
      dueDate: '2026-03-10',
      dueTime: '05:30 PM',
      status: 'due-today' as const,
      priority: 'Critical' as const,
      notes: 'Address service delay concern',
      agent: 'Mike Johnson',
      agentId: 'a3',
    },
    {
      _id: 'fu3',
      reminderId: 'FU-002',
      customer: 'Emily Davis',
      customerId: 'c2',
      callId: 'CL-002',
      dueDate: '2026-03-11',
      dueTime: '02:00 PM',
      status: 'due-soon' as const,
      priority: 'Medium' as const,
      notes: 'Send product catalog and pricing',
      agent: 'Sarah Wilson',
      agentId: 'a2',
    },
    {
      _id: 'fu4',
      reminderId: 'FU-008',
      customer: 'Patricia Martin',
      customerId: 'c8',
      callId: 'CL-008',
      dueDate: '2026-03-11',
      dueTime: '10:30 AM',
      status: 'due-soon' as const,
      priority: 'Critical' as const,
      notes: 'Quality assurance manager review required',
      agent: 'Mike Johnson',
      agentId: 'a3',
    },
  ],
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const callLogService = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs/stats', { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.stats;
  },

  // Get call trend data
  async getCallTrend(): Promise<CallTrendData[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs/trend', { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.callTrend;
  },

  // Get call type distribution
  async getCallTypeDistribution(): Promise<CallTypeData[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs/call-types', { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.callTypes;
  },

  // Get agent performance
  async getAgentPerformance(): Promise<AgentPerformance[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs/agent-performance', { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.agentPerformance;
  },

  // Get recent calls
  async getRecentCalls(limit: number = 10): Promise<CallLog[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper(`/call-logs/recent?limit=${limit}`, { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.recentCalls.slice(0, limit);
  },

  // Get follow-up reminders
  async getFollowUpReminders(): Promise<FollowUpReminder[]> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs/follow-ups', { method: 'GET' });
    // return response.data;
    
    await delay(500);
    return STATIC_DATA.followUps;
  },

  // Create new call log
  async createCallLog(data: Partial<CallLog>): Promise<CallLog> {
    // TODO: Replace with actual API call
    // const response = await apiHelper('/call-logs', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // });
    // return response.data;
    
    await delay(500);
    const newCall = {
      _id: `call_${Date.now()}`,
      callId: `CL-${String(STATIC_DATA.recentCalls.length + 1).padStart(3, '0')}`,
      ...data,
      timestamp: new Date().toISOString(),
    } as CallLog;
    return newCall;
  },

  // Update call log status
  async updateCallStatus(id: string, status: string): Promise<CallLog> {
    // TODO: Replace with actual API call
    // const response = await apiHelper(`/call-logs/${id}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status }),
    // });
    // return response.data;
    
    await delay(500);
    const call = STATIC_DATA.recentCalls.find(c => c._id === id);
    if (call) {
      call.status = status as any;
    }
    return call as CallLog;
  },

  // Complete follow-up
  async completeFollowUp(id: string): Promise<void> {
    // TODO: Replace with actual API call
    // await apiHelper(`/call-logs/follow-ups/${id}/complete`, { method: 'PATCH' });
    
    await delay(500);
    const followUp = STATIC_DATA.followUps.find(f => f._id === id);
    if (followUp) {
      followUp.status = 'completed' as 'overdue' | 'due-today' | 'due-soon' ;
    }
  },
};