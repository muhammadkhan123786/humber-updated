import { IBaseEntity } from '../Base.Interface';

export interface ITicketActions<TUSERID = string> extends IBaseEntity<TUSERID> {
    code: string;
    label?: string;
}