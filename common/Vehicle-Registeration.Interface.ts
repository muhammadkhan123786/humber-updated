import { IBaseEntity } from "./Base.Interface";

export type VehicleType = "Scooter" | "Mobility Vehicle";

export interface ICustomerVehicleRegInterface<
    TUserId = string,
    TVehicleBrandId = string,
    TVehicleModelId = string,
    TCUSTOMERID = string,
    TCOLORID = string

> extends IBaseEntity<TUserId> {

    vehicleBrandId: TVehicleBrandId;

    vehicleModelId: TVehicleModelId;

    serialNumber?: string;
    vehicleType: VehicleType;

    purchaseDate?: Date;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;

    vehiclePhoto?: string;
    vehiclePhotoFile?: File;
    note?: string;
    customerId: TCUSTOMERID;
    isVehicleCompanyOwned: boolean;

    colorId?: TCOLORID;
    productName?: string;
    year?: string;

}

