import { IBaseEntity } from '../Base.Interface';

export interface ILABOURCOST<TUserId = string> extends IBaseEntity<TUserId> {
    name: string;
    value: number;
}

