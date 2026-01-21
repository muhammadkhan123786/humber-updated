import { commonProfileDto } from '../DTOs/profilecommonDto';

export type PAYMENT_FREQUENCY = "Daily" | "Weekly" | "Monthly";
export type DAYS = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type DUTY_ROSTER = {
    day: DAYS,
    isActive: boolean,
    startTime: string,
    endTime: string
};

export interface ITechnician<
    ICONTRACTID = string,
    IDEPARTMENTID = string,
    ISPECIALIZATIONIDS = string[],
    IACCOUNTID = string,
    IPERSONID = string,
    ICONTACTID = string,
    IADDRESSID = string,
> extends commonProfileDto {
    personId?: IPERSONID,
    contactId?: ICONTACTID,
    addressId?: IADDRESSID,
    dateOfBirth?: Date;
    employeeId?: string;
    dateOfJoining?: Date;
    contractTypeId?: ICONTRACTID;
    departmentId: IDEPARTMENTID;
    specializationIds?: ISPECIALIZATIONIDS;
    paymentFrequency: PAYMENT_FREQUENCY;
    salary?: number;
    bankAccountNumber?: string;
    taxId?: string;
    dutyRoster?: DUTY_ROSTER[];
    technicianDocuments?: string[];
    technicianDocumentsFile?: File[];
    additionalInformation?: {    // fixed typo
        emergencyContactName?: string;
        emergencyContactNumber?: string;
        healthInsuranceDetails?: string;
        additionalNotes?: string;
    };
    accountId?: IACCOUNTID
}
