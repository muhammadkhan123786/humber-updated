import { IBaseEntity } from '../Base.Interface';

export interface ITicketReferenceTypes<TUSERID = string> extends IBaseEntity<TUSERID> {
    code: string,
    label: string,
}