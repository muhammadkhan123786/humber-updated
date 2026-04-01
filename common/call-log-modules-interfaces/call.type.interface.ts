
import { IBaseEntity } from '../Base.Interface';
export interface ICallType<TUserId = string> extends IBaseEntity<TUserId> {
    callTypeName: string;

}