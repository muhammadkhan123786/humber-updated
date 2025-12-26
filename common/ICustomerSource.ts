
import { IBaseEntity } from "./Base.Interface";

export interface ICustomerSource<TUserId = string> extends IBaseEntity<TUserId> {
    customerSource: string;
}