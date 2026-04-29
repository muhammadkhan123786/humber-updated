export const applyPagination = (pipeline: any[], skip: number, limit: number) => {
  return [
    ...pipeline,
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ["$totalCount.count", 0] }
      }
    }
  ];
};