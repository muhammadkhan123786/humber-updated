import { IBaseEntity } from '../Base.Interface';

export type fileType = "VIDEO" | "IMAGE";

export interface ICustomerVideoManager<TUSERID = string, TTICKETID = string> extends IBaseEntity<TUSERID> {
    ticket_Id: TTICKETID,
    fileType: fileType,
    file_URL: string,
}