import { dataValidationRulesInterface } from "./ISharedValidationInterface";
export function validateField(rules: dataValidationRulesInterface): string | null {
  const { name,value, required, min, max, minLength, maxLength, pattern } = rules;

  if (required && (value === "" || value === null || value === undefined)) {
    return `${name} this field is required`;
  }

  if (typeof value === "number") {
    if (min !== undefined && value < min) return `This ${name} minimum value is ${min} number required.`;
    if (max !== undefined && value > max) return `This ${name} maximum value is ${max} number required.`;
  }

  if (typeof value === "string") {
    if (minLength && value.length < minLength)
      return `This ${name} minimum length is ${minLength} required.`;
    if (maxLength && value.length > maxLength)
      return `This ${name} maximum length is ${maxLength} required.`;
    if (pattern && !pattern.test(value)) return `The ${name} is Invalid format`;
  }

  return null;
}
