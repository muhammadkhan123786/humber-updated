const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export interface TicketResponse {
  success: boolean;
  message: string;
  tickets: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  urgency?: string;
  source?: string;
}

export const fetchTechnicianTickets = async (filters: TicketFilters = {}): Promise<TicketResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Build query string
  const queryParams = new URLSearchParams();
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/technician-dashboard/technician-tickets${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch tickets' }));
    throw new Error(error.message || 'Failed to fetch tickets');
  }
  const data = await response.json();
  console.log('Fetch Tickets Response:', data);
  return data;
};

