export interface CallLog {
  _id: string;
  callId: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  callType: 'Inquiry' | 'Complaint' | 'Sales Lead' | 'Support';
  agent: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'Resolved' | 'In Progress' | 'Escalated' | 'Follow-Up' | 'Pending';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  duration: number;
  timestamp: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpTime?: string;
}

export interface FollowUpReminder {
  _id: string;
  reminderId: string;
  customer: string;
  customerId: string;
  callId: string;
  dueDate: string;
  dueTime: string;
  status: 'overdue' | 'due-today' | 'due-soon' | 'completed';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  notes: string;
  agent: string;
  agentId: string;
}

export interface DashboardStats {
  totalCallsToday: number;
  missedCalls: number;
  pendingFollowUps: number;
  resolvedIssues: number;
  avgResponseTime: number;
  activeTickets: number;
}

export interface CallTrendData {
  time: string;
  calls: number;
}

export interface CallTypeData {
  name: string;
  value: number;
  color: string;
}

export interface AgentPerformance {
  agent: string;
  calls: number;
  resolved: number;
}