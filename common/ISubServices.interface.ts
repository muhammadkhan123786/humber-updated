
import { IBaseEntity } from './Base.Interface';

export interface ISubServicesInterface<TUserId = string, UMasterServiceId = string> extends IBaseEntity<TUserId> {
    masterServiceId: UMasterServiceId,
    subServiceName: string,
    cost?: number,
    notes?: string
}

