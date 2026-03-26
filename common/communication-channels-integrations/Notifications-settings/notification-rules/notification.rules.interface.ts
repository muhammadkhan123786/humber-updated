import { IBaseEntity } from '../../../Base.Interface';


type RecipientType = 'Admin' | 'Technician' | 'Customer' | 'Driver';

export interface INotificationChannelTemplate<
  TCHANNELID = string,
  TTemplateId = string
> {
  channelId: TCHANNELID;
  templateId: TTemplateId;
}

export interface INotificationRulesInterface<
  TUserId = string,
  TEVENTKEYID = string,
  TCHANNELID = string,
  TTemplateId = string,
  TMODULEID=string,
  TACTIONID=string
> extends IBaseEntity<TUserId> {

  autoRuleId?: string;

  notificationRulesName: string;

  moduleId:TMODULEID;

  actionId:TACTIONID;

  eventKeyId: TEVENTKEYID;

  channels: INotificationChannelTemplate<
    TCHANNELID,
    TTemplateId
  >[];

  recipients: RecipientType[];

  conditions?: string;

  priority: number;

  description:string;
  
}

