
//  Update By Muzamil Hassan 7/1/2026

import { IBaseEntity } from './Base.Interface';
export interface ICategory<TUserId = string, TId = string, IParentId = string| null > extends IBaseEntity<TUserId> {
    categoryName: string;
    parentId?: IParentId;
    children?: ICategory<TId, TId>[];
}

// import { Types } from "mongoose";

// export interface ICategory<
//   TUserId = Types.ObjectId,
//   TId = Types.ObjectId,
//   TParentId = Types.ObjectId | null
// > extends IBaseEntity<TUserId> {
//   categoryName: string;
//   parentId: TParentId;
//   children?: ICategory<TId, TId>[];
// }
