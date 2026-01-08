import { IBaseEntity } from '../Base.Interface';

export interface IDepartments<TUSERID = string> extends IBaseEntity<TUSERID> {

    departmentName: string;

}