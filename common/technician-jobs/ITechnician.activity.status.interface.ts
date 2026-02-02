import { IBaseEntity } from '../Base.Interface';

export interface ITechnicianJobStatus<TUserId = string> extends IBaseEntity<TUserId> {
    technicianJobStatus: string;
}

