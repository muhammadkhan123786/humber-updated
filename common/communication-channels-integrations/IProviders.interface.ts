import { IBaseEntity } from '../Base.Interface';

export interface IProviders<TUserId = string,TCHANNELID=string> extends IBaseEntity<TUserId> {
    providerName: string;
    channelId:TCHANNELID;
}

