// export const buildQueryOptions = (req: any) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const search = req.query.search || "";
//   const searchField = req.query.searchField || "";

//   const startDate = req.query.startDate;
//   const endDate = req.query.endDate;

//   const skip = (page - 1) * limit;

//   return {
//     page,
//     limit,
//     skip,
//     search,
//     searchField,
//     startDate,
//     endDate,
//   };
// };


export const buildQueryOptions = (req: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // parse columnFilters from JSON string (sent by your table hook)
  let columnFilters = {};
  try {
    if (req.query.columnFilters) {
      columnFilters = JSON.parse(req.query.columnFilters);
    }
  } catch (e) {
    columnFilters = {};
  }

  return {
    page,
    limit,
    skip,
    search: req.query.search || "",
    searchField: req.query.searchField || "",
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    columnFilters, // New: supports multiple column searches
  };
};

