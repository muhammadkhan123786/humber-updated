import { commonProfileDto } from "./profilecommonDto";
import { ITechnicianZone } from '../ITechnician.interface';

export interface technicianProfileDto extends commonProfileDto {
    userId: string;
    roleId: string;
    zones: ITechnicianZone[];
    technicianRoleId: string;
    skills: string[];
    profilePic?: string;        // file path / URL
    documents?: string;
}