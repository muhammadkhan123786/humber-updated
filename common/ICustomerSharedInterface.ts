import { IBaseEntity } from './Base.Interface';

export interface ICustomerSharedInterface<TUserId = string> extends IBaseEntity<TUserId> {
    firstName: string;
    address: string;
    email: string;
    mobileNumber: string;
}
