
import { IBaseEntity } from '../Base.Interface';
export interface ICallStatus<TUserId = string> extends IBaseEntity<TUserId> {
    callStatus: string;
}