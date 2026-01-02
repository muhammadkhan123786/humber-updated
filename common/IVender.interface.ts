import { IBaseEntity } from './Base.Interface';
import { ICommonPersonalInfoInterface } from './common-interfaces/person.info.interface';
export interface IVender<TUserId = string, TPersonId = string, TAddressId = string, TContactId = string, IPaymentTermId = string, ICurrencyId = string> extends IBaseEntity<TUserId>, ICommonPersonalInfoInterface<TPersonId, TAddressId, TContactId> {
    venderType: "Supplier" | "Vender" | "Both",
    paymentTermId: IPaymentTermId,
    currencyId?: ICurrencyId,
    credit_Limit?: number,
    bank_name?: string,
    account_Number?: string,
    lead_Time_Days?: number,
    business_Name?: string,
    website?: string
}