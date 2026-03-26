import { IBaseEntity } from '../../../Base.Interface';
export interface INotificationEvent<TUserId = string,TMODULEID=string> extends IBaseEntity<TUserId> {
    eventKey: string;
    name:string;
    description:string;
    moduleId?:TMODULEID;
    variables:{key:string,description:string}[];
}

