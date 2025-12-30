
import { IBaseEntity } from './Base.Interface';
export interface IServiceRequestType<TUserId = string> extends IBaseEntity<TUserId> {
    serviceRequestType: string;
}