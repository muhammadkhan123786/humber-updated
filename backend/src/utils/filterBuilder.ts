// export const applyFilters = (pipeline: any[], options: any) => {
//   const { search, searchField, startDate, endDate } = options;

//   // ✅ SEARCH
//   if (search && searchField) {
//     pipeline.push({
//       $match: {
//         [searchField]: {
//           $regex: search,
//           $options: "i",
//         },
//       },
//     });
//   }

//   // ✅ DATE RANGE (generic)
//   if (startDate && endDate) {
//     pipeline.push({
//       $match: {
//         createdAt: {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate),
//         },
//       },
//     });
//   }

//   return pipeline;
// };

export const applyFilters = (pipeline: any[], options: any) => {
  const { search, searchField, startDate, endDate, columnFilters } = options;

  const matchStage: any = {};

  // 1. Global search
  if (search && searchField) {
    matchStage[searchField] = { $regex: search, $options: "i" };
  }

  // 2. Column filters
  if (columnFilters && Object.keys(columnFilters).length > 0) {
    Object.entries(columnFilters).forEach(([field, value]) => {
      if (value !== undefined && value !== "") {
        // Numeric fields: use $gte/$lte range, not regex
        const num = parseFloat(value as string);
        if (!isNaN(num)) {
          matchStage[field] = { $gte: num };
        } else {
          matchStage[field] = { $regex: String(value), $options: "i" };
        }
      }
    });
  }

  // 3. Date filter
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  // ✅ FIX 1: push() not unshift() — must run AFTER lookups/unwinds
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  return pipeline;
};