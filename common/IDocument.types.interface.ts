
import { IBaseEntity } from './Base.Interface';
export interface IDocumentType<TUserId = string> extends IBaseEntity<TUserId> {
    documentTypeName: string;
}