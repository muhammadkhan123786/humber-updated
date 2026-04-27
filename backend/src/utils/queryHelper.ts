export const buildQueryOptions = (req: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const search = req.query.search || "";
  const searchField = req.query.searchField || "";

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    search,
    searchField,
    startDate,
    endDate,
  };
};