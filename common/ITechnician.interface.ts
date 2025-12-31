import { IBaseEntity } from "./Base.Interface";

export type Day =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";

export interface ITechnicianZone<TZoneId = string> {
    zoneId: TZoneId;
    day: Day;
    startTime: string; // "08:00"
    endTime: string;   // "16:00"
}

export interface ITechnicianBaseInformation<TUserId = string, TPersonId = string, TContactId = string, TAddressId = string, TSkillsIds = string[], TRoleId = string, TAccountId = string>
    extends IBaseEntity<TUserId> {
    personId: TPersonId;
    contactId: TContactId;
    addressId: TAddressId;
    roleId: TRoleId;
    accountId: TAccountId;

    skills: TSkillsIds;           // service IDs
    zones: ITechnicianZone[];

    profilePic?: string;        // file path / URL
    documents?: string;       // multiple PDFs
}

