import { IBaseEntity } from '../Base.Interface';

export interface ITicketType<TUSERID = string, TDepartmentId = string> extends IBaseEntity<TUSERID> {
    code: string;
    label: string;
    departmentId: TDepartmentId
}