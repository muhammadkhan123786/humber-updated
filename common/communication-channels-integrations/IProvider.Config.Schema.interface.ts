import { IBaseEntity } from '../Base.Interface';

export type FieldType =
  | "text"
  | "password"
  | "number"
  | "select"
  | "boolean";

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // used if type = select
}

export interface IProviderConfig<
  TUserId = string,
  TProviderId = string
> extends IBaseEntity<TUserId> {
  providerId: TProviderId;
  fields: FieldSchema[];
}