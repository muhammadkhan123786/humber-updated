
export type customerType = "domestic" | "corporate";
export interface BaseCustomerDto {

    userId: string;
    //personal information.
    firstName: string;
    middleName?: string;
    lastName?: string;

    //contact information
    mobileNumber: string;
    phoneNumber?: string;
    emailId?: string;

    // addres 
    address: string;
    zipCode?: string;
    city?: string;
    country?: string;
    latitude?: string;
    longitude?: string;

    isActive?: boolean;
    isDeleted?: boolean;
    isDefault?: boolean;

    customerType: customerType
}

export interface DomesticCustomerDto extends BaseCustomerDto {
    customerType: "domestic",
}

export interface CorporateCutomerDto extends BaseCustomerDto {
    customerType: "corporate",

}

export type Customer = DomesticCustomerDto | CorporateCutomerDto;

