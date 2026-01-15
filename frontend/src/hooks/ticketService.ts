// services/ticketService.ts
import axios from "axios";

// Use your environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

const ticketService = {
  // Create new ticket
  createTicket: async (ticketData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/customer-tickets`,
        ticketData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Create ticket error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to create ticket"
        );
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error("Error creating ticket request");
      }
    }
  },

  getTicket: async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/customer-tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getTickets: async (params?: any) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/customer-tickets`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateTicket: async (id: string, ticketData: FormData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/customer-tickets/${id}`,
      ticketData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteTicket: async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/customer-tickets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getCustomers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getCustomerVehicles: async (customerId: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/customer-vehicle-register`,
      {
        params: { customerId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getPriorities: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/service-request-prioprity-level`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getTicketStatuses: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/ticket-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get technicians
  getTechnicians: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/technicians`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Add interceptor for auth errors
  setupInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  },
};

// Setup interceptors
ticketService.setupInterceptors();

export default ticketService;
