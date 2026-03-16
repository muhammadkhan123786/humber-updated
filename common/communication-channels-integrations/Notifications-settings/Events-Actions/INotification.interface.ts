import { IBaseEntity } from '../../../Base.Interface';

export interface INotificationEvent<TUserId = string> extends IBaseEntity<TUserId> {
    eventKey: string;
    name:string;
    description:string;
}

