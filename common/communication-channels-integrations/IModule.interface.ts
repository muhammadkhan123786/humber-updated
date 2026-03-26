import { IBaseEntity } from '../Base.Interface';

export interface IModule<TUserId = string> extends IBaseEntity<TUserId> {
    moduleName: string;
    moduleKey:string;
}

