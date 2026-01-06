

import { IBaseEntity } from './Base.Interface';
export interface ICategory<TUserId = string, IParentId = string | null> extends IBaseEntity<TUserId> {
    categoryName: string;
    parentId: IParentId;
}