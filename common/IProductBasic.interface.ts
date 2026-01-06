import { IBaseEntity } from './Base.Interface';

export interface IProductBasic<TUserId = string, TCategoryId = string, TTAXId = string, TCurrencyId = string, TVenderId = string, TChannelIds = string[] | null, TBrandId = string> extends IBaseEntity<TUserId> {
    productName: string;
    SKU?: string;
    productDes?: string;
    categoryId: TCategoryId;
    MPN?: string;
    UPSEAN?: string;
    TaxId?: TTAXId;
    currencyId?: TCurrencyId;
    warrantyDuration?: number;
    returnPeriods?: number;
    venderId?: TVenderId;
    leadTime?: number;
    stock: number;
    channelIds: TChannelIds;
    brandId: TBrandId;
}