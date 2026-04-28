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
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  let columnFilters: Record<string, string> = {};

  try {
    if (req.query.columnFilters) {
      const raw = req.query.columnFilters;

      if (typeof raw === "string" && raw.startsWith("{")) {
        // ✅ Properly JSON stringified object from frontend
        columnFilters = JSON.parse(raw);
      } else if (typeof raw === "object" && !Array.isArray(raw)) {
        // Already an object (edge case with some parsers)
        columnFilters = raw;
      }

      // 🔍 Debug: remove in production
      console.log("✅ Parsed columnFilters:", columnFilters);
    }
  } catch (err) {
    console.error("❌ Failed to parse columnFilters:", req.query.columnFilters, err);
    columnFilters = {};
  }

  const options = {
    page,
    limit,
    skip,
    search:      req.query.search      || "",
    searchField: req.query.searchField || "productName",
    startDate:   req.query.startDate,
    endDate:     req.query.endDate,
    columnFilters,
  };

  // 🔍 Debug: remove in production
  console.log("📦 buildQueryOptions result:", options);

  return options;
};

