"use client"
export interface MarketplaceConnection {
  _id: string;
  type: string;
  name: string;
  status: string;
}
import  { useEffect, useState} from "react";
import { getMarketplaceConnections } from "@/services/marketplace-distribution.api";

export function useMarketplaceConnections(userId?: string) {
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);

  useEffect(() => {
    if (!userId) return;

    async function loadConnections() {
      try {
        const res = await getMarketplaceConnections(userId!);

        const connected = res.data.filter(
          (c: any) => c.status === "connected"
        );

        setConnections(connected);
      } catch (err) {
        console.error("Error loading connections", err);
      }
    }

    loadConnections();
  }, [userId]);

  return connections;
}