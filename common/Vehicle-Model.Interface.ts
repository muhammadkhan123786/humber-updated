import { IBaseEntity } from './Base.Interface';
export interface IVehicleModelInterface<TUserId = string, IBrandId = string> extends IBaseEntity<TUserId> {
    brandId: IBrandId
    modelName: string;

}