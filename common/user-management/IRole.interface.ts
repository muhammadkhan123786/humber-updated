import { IBaseEntity } from '../Base.Interface';

export interface IRole<TUSERID = string> extends IBaseEntity<TUSERID> {
    roleName: string;
}