import { IBaseEntity } from '../Base.Interface';

export interface IModuleAction<TUserId = string,TMODULEID=string> extends IBaseEntity<TUserId> {
    actionKey: string;
    name:string;
    moduleId:TMODULEID;
}