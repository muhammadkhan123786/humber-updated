export interface IServiceType {
    _id: string;
    userId: string;
    MasterServiceType: string;
    description?: string;
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceFormData {
    MasterServiceType: string;
    description: string;
    isActive: boolean;
    isDefault: boolean;
}