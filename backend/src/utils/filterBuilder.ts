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

  // 1. Global Search (Existing logic)
  if (search && searchField) {
    matchStage[searchField] = { $regex: search, $options: "i" };
  }

  // 2. Dynamic Column Filters (New professional logic)
  if (columnFilters && Object.keys(columnFilters).length > 0) {
    Object.entries(columnFilters).forEach(([field, value]) => {
      if (value) {
        // Use regex for strings, exact match for others
        matchStage[field] = { $regex: String(value), $options: "i" };
      }
    });
  }

  // 3. Date Range
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  return pipeline;
};