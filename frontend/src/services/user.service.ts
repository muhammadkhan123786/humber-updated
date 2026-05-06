// services/user.service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const userService = {
    // Get all users with filters
    getUsers: async (filters: {
        search?: string;
        status?: string;
        role?: string;
        page?: number;
        limit?: number;
    }) => {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        const response = await fetch(`${API_BASE_URL}/users?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Get user stats
    getStats: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/users/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Lock/Unlock user
    toggleLock: async (userId: string) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/users/${userId}/lock`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Add to existing userService
getUserById: async (userId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
},
};