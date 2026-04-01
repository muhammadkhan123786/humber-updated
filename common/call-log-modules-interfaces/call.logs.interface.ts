import { IBaseEntity } from '../Base.Interface';

export interface ICallLogs<
  TUserId = string,
  TCallTypeId = string,
  TPriorityLevelId = string,
  TSTATUSID=string,
  TFollowUpDate = string,
  TFollowUpTime = string,
> extends IBaseEntity<TUserId> {

  autoCallId: string;

  customerName: string;
  phoneNumber: string;

  address: string;
  postCode: string;
  city: string;

  callTypeId: TCallTypeId;
  priorityLevelId: TPriorityLevelId;
  callStatusId:TSTATUSID;

  agentName: string;

  callPurpose: string;
  callNotes: string;

  followUpDate: TFollowUpDate;
  followUpTime: TFollowUpTime;
  followUpNotes: string;

  callDuration: number;
}