import { useMemo} from "react";
import { normalizeMarketplaceName } from "../helper/normalizeMarketplaceName"

export function useAvailableMarketplaces(connections: any[]) {

  return useMemo(() => {
    return connections.map((connection: any) => {

      const name = normalizeMarketplaceName(connection.type);

      return {
        id: connection._id,
        name,
        displayName: connection.type,
        connectionId: connection._id,
      };
    });

  }, [connections]);

}