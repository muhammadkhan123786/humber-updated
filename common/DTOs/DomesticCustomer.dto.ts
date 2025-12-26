
export interface CreateBaseCustomerDto {
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
    zipCode: string;
    city: string;


}

