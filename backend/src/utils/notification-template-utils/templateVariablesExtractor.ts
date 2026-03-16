export const extractTemplateVariables = (template: string): string[] => {
  const regex = /{{(.*?)}}/g;

  const matches = template.match(regex);

  if (!matches) return [];

  return matches.map(v => v.replace(/{{|}}/g, "").trim());
};