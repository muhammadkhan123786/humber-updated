export interface IVehicleBrandInterface<TUserId = string> {
    userId: TUserId;
    brandName: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isDefault?: boolean;
}

export interface ICustomerVehicleRegInterface<
    TUserId = string,
    TCustomerId = string,
    TVehicleBrandId = string
> {
    userId: TUserId;
    customerId: TCustomerId;
    vehicleBrandId: TVehicleBrandId;
    makeYear: string;
    serialNumber: string;
    purchaseYear: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isDefault?: boolean;
}

export interface ICustomerSharedInterface<TUserId = string> {
    userId?: TUserId;
    firstName: string;
    address: string;
    email: string;
    mobileNumber: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isDefault?: boolean;
}
