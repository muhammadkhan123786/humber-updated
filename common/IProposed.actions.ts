
import { IBaseEntity } from './Base.Interface';
export interface IProposedActions<TUserId = string> extends IBaseEntity<TUserId> {
    proposedActionName: string;
}