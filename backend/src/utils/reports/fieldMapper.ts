// utils/fieldMapper.ts
/**
 * Maps frontend column filter keys to actual MongoDB field paths.
 * @param options - The request options object containing `columnFilters`.
 * @param fieldMap - Object mapping frontend key → database path.
 * @returns A new options object with mapped columnFilters.
 */
export const mapColumnFilters = <T extends Record<string, any>>(
  options: T,
  fieldMap: Record<string, string>
): T => {
  const mappedColumnFilters: Record<string, string> = {};
  Object.entries(options.columnFilters || {}).forEach(([key, value]) => {
    const mappedKey = fieldMap[key] ?? key;
    mappedColumnFilters[mappedKey] = value as string;
  });
  return {
    ...options,
    columnFilters: mappedColumnFilters,
  };
};