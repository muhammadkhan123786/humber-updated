export interface IDriverCreateDTO<TDriverLicense = File[], TGovernmentId = File[], TVehicleRegister = File[], TInsuranceCertificates = File[], TBackgroundChecks = File[], TOtherDocuments = File[], TAccountId = string, TDRIVERPHOTO = File> {
    personalInfo: {
        firstName: string;
        lastName: string;
    };

    accountDetails: {
        emailId: string;
        password: string;
    };

    contactDetails: {
        phoneNumber: string;
        dateOfBirth: string; // YYYY-MM-DD
    };

    address: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };

    driverLicenseDetails: {
        licenseNumber: string;
        expiryDate: string; // YYYY-MM-DD
        experience: number; // years
    };

    vehicleDetails: {
        vehicleType: string;
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        color: string;
    };

    emergencyContact: {
        personName: string;
        phoneNumber: string;
        relationship: string;
    };

    documents?: {
        driverLicense?: TDriverLicense;
        governmentId?: TGovernmentId;
        vehicleRegister?: TVehicleRegister;
        insuranceCertificates?: TInsuranceCertificates;
        backgroundChecks?: TBackgroundChecks;
        otherDocuments?: TOtherDocuments;
    };
    role?: string;
    driverPhoto: TDRIVERPHOTO;

    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    isVerified: boolean;
    accountId?: TAccountId;
}
