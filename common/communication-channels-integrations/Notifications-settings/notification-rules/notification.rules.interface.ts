import { IBaseEntity } from '../../../Base.Interface';

export interface INotificationRulesInterface<TUserId = string,TEVENTKEYID=string,TCHANNELID=string,TTemplateId=string,TMODULEID=string> extends IBaseEntity<TUserId> {
    autoRuleId:string;
    notificationRulesName:string;
    eventKeyId: TEVENTKEYID;
    moduleId:TMODULEID;
    channelIds:TCHANNELID[];
    templateId:TTemplateId;
    conditions:string;
    priority:number;
}


