
import { IBaseEntity } from './Base.Interface';
export interface IVehicleBrandInterface<TUserId = string> extends IBaseEntity<TUserId> {
    brandName: string;
}