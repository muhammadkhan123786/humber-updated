
import { IBaseEntity } from './Base.Interface';
export interface IServicesZones<TUserId = string> extends IBaseEntity<TUserId> {
    serviceZone: string;
}