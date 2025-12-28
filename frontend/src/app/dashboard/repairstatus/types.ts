export interface IRepairStatus {
    _id: string;
    userId: string;
    repairStatus: string;
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface RepairStatusFormData {
    repairStatus: string;
    isActive: boolean;
    isDefault: boolean;
}