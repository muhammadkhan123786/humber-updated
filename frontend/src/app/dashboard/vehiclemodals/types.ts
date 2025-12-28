export interface IVehicleModel {
    _id: string;
    userId: string;
    brandId: string | { _id: string; brandName: string }; // Populated data handle karne ke liye
    modelName: string;
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ModelFormData {
    brandId: string;
    modelName: string;
    isActive: boolean;
    isDefault: boolean;
}