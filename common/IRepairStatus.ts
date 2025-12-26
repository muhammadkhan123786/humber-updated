import { IBaseEntity } from './Base.Interface';
export interface IRepairStatus<TUserId = string> extends IBaseEntity<TUserId> {
    repairStatus: string;
}