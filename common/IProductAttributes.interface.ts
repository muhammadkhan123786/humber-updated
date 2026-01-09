import { IBaseEntity } from "./Base.Interface";

export type AttributeType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date";

export interface IAttribute<TUserId = string, TAttributeId = string>
  extends IBaseEntity<TUserId> {
  attributeName: string;
  type: AttributeType;
  categoryId?: string | null; // Add this
  isForSubcategories?: boolean; // Add this
  unit?: string; // Add this
  options?: { label: string; value: string }[];
  isRequired?: boolean;
  status?: "active" | "inactive";
  code?: string; // Add this for the unique code
}