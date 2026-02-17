import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000/api";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  employeeId: string;
  dateOfJoining: string;
  shopName: string;
  specializations: string[];
}

interface TechnicianProfileResponse {
  success: boolean;
  message: string;
  data: {
    technician: any;
    shop: any;
  };
}

interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Fetch technician profile
const fetchTechnicianProfile = async (): Promise<ProfileData> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BASE_URL}/technician-profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const result: TechnicianProfileResponse = await response.json();
  
  if (result.success && result.data) {
    const { technician, shop } = result.data;
    return {
      firstName: technician.personId?.firstName || '',
      lastName: technician.personId?.lastName || '',
      email: technician.accountId?.email || '',
      phoneNumber: technician.contactId?.phoneNumber || '',
      address: technician.addressId?.address || '',
      employeeId: technician.employeeId || '',
      dateOfJoining: technician.dateOfJoining || '',
      shopName: shop?.shopName || '',
      specializations: technician.specializationIds?.map((spec: any) => spec.MasterServiceType) || []
    };
  }
  
  throw new Error('Invalid response format');
};

// Update technician profile
const updateTechnicianProfile = async (payload: UpdateProfilePayload): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BASE_URL}/update-technician-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to update profile');
  }
  
  return result;
};

export const useTechnicianProfile = () => {
  const queryClient = useQueryClient();

  // Fetch profile query
  const profileQuery = useQuery({
    queryKey: ['technicianProfile'],
    queryFn: fetchTechnicianProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateTechnicianProfile,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['technicianProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    refetch: profileQuery.refetch,
  };
};
