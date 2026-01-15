import { IBaseEntity } from "./Base.Interface";

export type AttributeType =
  | "text"
  | "number"
  | "dropdown"
  | "list"
  | "date"
  | "checkbox"
  | "radio"
  | "textarea";

export interface IAttribute<TUserId = string, TAttributeId = string>
  extends IBaseEntity<TUserId> {
  attributeName: string;
  type: AttributeType;
  categoryId?: string | null; // Add this
  isForSubcategories?: boolean; // Add this
   options?: { label: string; value: string }[];
  isRequired?: boolean;
  status?: "active" | "inactive";
  code?: string;
  isDefault?: boolean;
}
