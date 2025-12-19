export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "date"
  | "select";


export interface dataValidationRulesInterface {
    name:string,
    value:any,
    type:FieldType,
    required?:boolean,
    min?:number,
    max?:number,
    minLength?:number,
    maxLength?:number,
    pattern?: RegExp;
    customValidator?: (value: any) => boolean | string;
}