  "use client";
  import axios from "axios";
  import { IGoodsReceivedNote } from "../../../common/IGRN.interface";

  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/grn`;

  const getAuthConfig = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getUserId = () => {
    if (typeof window === "undefined") return "";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id;
  };

  export interface GRNResponse {
    data: IGoodsReceivedNote[];
    total: number;
    page: number;
    limit: number;
  }

  /* ---------------- FETCH ---------------- */
  export const fetchGRNs = async (
    page = 1,
    limit = 10,
    search = "",
  
  ): Promise<GRNResponse> => {
      console.log(getUserId());
    const res = await axios.get(API_URL, {
      ...getAuthConfig(),
      params: {
        userId: getUserId(),
        page,
        limit,
        search,
        
      },
    });
    return res.data;
  };

  /* ---------------- CREATE ---------------- */
  export const createGRN = async (
    payload: Partial<IGoodsReceivedNote>
  ): Promise<IGoodsReceivedNote> => {
  
    const userId = getUserId();
  
  const completePayload = {
    ...payload,
    userId,
  };
    const res = await axios.post(API_URL, completePayload, getAuthConfig());
    return res.data;
  };

  /* ---------------- UPDATE ---------------- */
  export const updateGRN = async (
    id: string,
    payload: Partial<IGoodsReceivedNote>
  ): Promise<IGoodsReceivedNote> => {
    const res = await axios.put(`${API_URL}/${id}`, payload, getAuthConfig());
    return res.data;
  };

  /* ---------------- DELETE ---------------- */
  export const deleteGRN = async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return res.data;
  };

  /* ---------------- GENERATE NEXT NUMBER ---------------- */
export const fetchNextDocumentNumber = async (
  type: "GRN" | "GRN_REFERENCE" | "RETURN"
): Promise<{ nextNumber: string }> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/document-numbers/next`, {
    ...getAuthConfig(),
    params: { 
      type,
      userId: getUserId(),
    },
  });
  return res.data;
};
