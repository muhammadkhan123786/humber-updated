
import { IBaseEntity } from './Base.Interface';
export interface ServiceRequestPrioprity<TUserId = string> extends IBaseEntity<TUserId> {
    serviceRequestPrioprity: string;
}