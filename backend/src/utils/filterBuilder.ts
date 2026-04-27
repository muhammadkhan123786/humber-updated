export const applyFilters = (pipeline: any[], options: any) => {
  const { search, searchField, startDate, endDate } = options;

  // ✅ SEARCH
  if (search && searchField) {
    pipeline.push({
      $match: {
        [searchField]: {
          $regex: search,
          $options: "i",
        },
      },
    });
  }

  // ✅ DATE RANGE (generic)
  if (startDate && endDate) {
    pipeline.push({
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    });
  }

  return pipeline;
};