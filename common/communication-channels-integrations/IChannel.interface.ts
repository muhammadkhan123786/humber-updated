import { IBaseEntity } from '../Base.Interface';

export interface IChannels<TUserId = string> extends IBaseEntity<TUserId> {
    channelName: string;
}

