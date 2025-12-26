export interface IBaseEntity<TUserId = string> {
    userId: TUserId;
    isActive?: boolean;
    isDeleted?: boolean;
    isDefault?: boolean;
}