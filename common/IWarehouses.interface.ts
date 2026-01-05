import { IBaseEntity } from "./Base.Interface";

export interface IWarehouse<
    TUserId = string,
    TPersonId = string,
    TAddressId = string,
    TContactId = string,
>
    extends IBaseEntity<TUserId> {
    personId: TPersonId;
    addressId: TAddressId;
    contactId: TContactId;

}
