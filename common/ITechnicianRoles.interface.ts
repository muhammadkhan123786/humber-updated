
import { IBaseEntity } from './Base.Interface';
export interface ITechnicianRoles<TUserId = string> extends IBaseEntity<TUserId> {
    technicianRole: string;
}