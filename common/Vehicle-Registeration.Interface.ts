import { IBaseEntity } from "./Base.Interface";

export type VehicleType = "Scooter" | "Mobility Vehicle";


export interface ICustomerVehicleRegInterface<
    TUserId = string,
    TCustomerId = string,
    TVehicleBrandId = string,
    TVehicleModelId = string
> extends IBaseEntity<TUserId> {
    customerId: TCustomerId;
    vehicleBrandId: TVehicleBrandId;

    vehicleModelId: TVehicleModelId;

    makeYear: number;
    purchaseYear: number;

    serialNumber: string;
    vehicleType: VehicleType;

    purchaseDate: Date;
    warrantyStartDate: Date;
    warrantyEndDate: Date;

    vehiclePhoto?: string;
    note?: string;
}

