import { IBaseEntity } from '../../../Base.Interface';

export interface INotificationTemplate<TUserId = string,TEVENTKEYID=string,TCHANNELID=string> extends IBaseEntity<TUserId> {
    eventKeyId: TEVENTKEYID;
    channelId:TCHANNELID;
    subject:string;
    templateBody:string;
}
