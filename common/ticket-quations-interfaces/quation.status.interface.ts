import { IBaseEntity } from '../Base.Interface';
export interface ITicketQuationStatus<TUserId = string> extends IBaseEntity<TUserId> {
    ticketQuationStatus: string
}