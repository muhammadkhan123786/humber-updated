import { IBaseEntity } from '../Base.Interface';

export interface ILABOURCOST<TUserId = string> extends IBaseEntity<TUserId> {
    Name: string;
    value: number;
}

