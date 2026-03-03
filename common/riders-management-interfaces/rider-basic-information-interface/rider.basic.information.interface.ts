import { IBaseEntity } from "../../Base.Interface";

export type RiderSTATUS = "PENDING"|"APPROVED"|"REJECTED"|"TERMINATED"|"IN-ACTIVE"|"ACTIVE";
export interface IRiderBasicInformation<
TUSERID=string,
ADDRESSID=string,
PERSONID=string,
CONTACTID=string,
ACCOUNTID=string,
VEHICLETYPEID=string,
EMPLOYEEMENTTYPEID=string,
AVAILBILITIESIDS=string[],
CITIESIDS=string[]
> extends IBaseEntity<TUSERID> {
    riderAutoId:string;
    profilePic:string;
    addressId:ADDRESSID;
    personId:PERSONID;
    contactId:CONTACTID;
    DOB?:Date;
    accountId:ACCOUNTID;
    nationalIssuranceNumber:string; 
    emergencyContactNumber:string;
    phoneNumber:string;
    relationShip:string;
    bankName:string;
    accountHolderName:string;
    accountNumber:string;
    sortCode:string;
    licenseNumber:string;
    licenseExpiryDate:Date;
    yearsOfExperience:number;
    vehicleTypeId:VEHICLETYPEID;
    modelId:string;
    vehicleYear:string;
    licensePlate:string;
    insuranceCompany:string;
    policyNumber:string;
    insuranceExpiryDate:Date;
    licenseFrontPic:string;
    licenseBackPic:string;
    insuranceDocumentPic:string;
    motCertificateNumber?:string;
    motExpiryDate?:Date;
    motCertificatePic?:string;
    utilityBillPic?:string;
    employeementTypeId:EMPLOYEEMENTTYPEID;
    availbilitiesIds:AVAILBILITIESIDS;
    zones:CITIESIDS;
    riderStatus?:RiderSTATUS
}