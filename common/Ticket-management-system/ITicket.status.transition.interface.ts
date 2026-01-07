import { IBaseEntity } from '../Base.Interface';

export interface ITicketStatusTransitions<
    TUSERID = string,
    Tfrom_status_id = string,
    Taction_id = string,
    Tto_status_id = string,
    Tticket_type_id = string
> extends IBaseEntity<TUSERID> {
    from_status_id: Tfrom_status_id,
    action_id: Taction_id,
    to_status_id: Tto_status_id,
    ticket_type_id: Tticket_type_id,
    description?: string,
}