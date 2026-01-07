import { IBaseEntity } from '../Base.Interface';

export interface ITicketStatus<TUSERID = string> extends IBaseEntity<TUSERID> {
    code: string;
    label: string;
    is_Terminal: boolean;
}