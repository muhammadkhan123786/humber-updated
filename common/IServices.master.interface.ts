import { IBaseEntity } from './Base.Interface';
export interface IServicesMasterInterface<TUserId = string> extends IBaseEntity<TUserId> {
    MasterServiceType: string,
    description: string

}