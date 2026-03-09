import { IBaseEntity } from '../Base.Interface';

export interface ILABOURCOST<TUserId = string> extends IBaseEntity<TUserId> {
    iconName: string;
    icon: string;
}

