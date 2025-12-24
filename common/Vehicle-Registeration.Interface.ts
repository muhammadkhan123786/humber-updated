import { IBaseEntity } from "./Base.Interface";
export interface ICustomerVehicleRegInterface<
    TUserId = string,
    TCustomerId = string,
    TVehicleBrandId = string
> extends IBaseEntity<TUserId> {
    customerId: TCustomerId;
    vehicleBrandId: TVehicleBrandId;
    makeYear: string;
    serialNumber: string;
    purchaseYear: string;
}
