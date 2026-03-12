import { IBaseEntity } from '../Base.Interface';

export interface IClientChannelConfigInterface<TUserId = string,TPROVIDERID=string> extends IBaseEntity<TUserId> {
   providerId:TPROVIDERID,
   configurationData:object
}

