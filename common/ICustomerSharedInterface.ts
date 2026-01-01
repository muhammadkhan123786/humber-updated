import { IBaseEntity } from './Base.Interface';
import { customerType } from './DTOs/Customer.dto';

export interface ICustomerBase<TUserId = string, TPersonId = string, TAddressId = string, TContactId = string, TCustomerSourceId = string, TAccountId = string> extends IBaseEntity<TUserId> {
    personId: TPersonId;
    addressId: TAddressId;
    contactId: TContactId;
    accountId: TAccountId;
    sourceId: TCustomerSourceId;
    customerType: customerType;
}


export interface IDomesticCustomer
    <TUserId = string, TPersonId = string, TAddressId = string, TContactId = string, TCustomerSourceId = string>
    extends ICustomerBase<TUserId, TPersonId, TAddressId, TContactId, TCustomerSourceId> {
    customerType: "domestic";
}

export interface ICorporateCustomer
    <TUserId = string, TPersonId = string, TAddressId = string, TContactId = string, TCustomerSourceId = string>
    extends ICustomerBase<TUserId, TPersonId, TAddressId, TContactId, TCustomerSourceId> {
    customerType: "corporate";
    companyName: string;
    registrationNo: string;
    vatNo?: string;
    website?: string;
}


export type Customer
    <TUserId = string, TPersonId = string,
        TAddressId = string, TContactId = string,
        TCustomerSourceId = string> = IDomesticCustomer<TUserId, TPersonId, TAddressId, TContactId, TCustomerSourceId> | ICorporateCustomer<TUserId, TPersonId, TAddressId, TContactId, TCustomerSourceId>;