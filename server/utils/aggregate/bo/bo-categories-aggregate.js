const getCategory = (userId) => [
  {
    $match: {
      $expr: { $eq: ["$CreatorId", { $toObjectId: userId }] },
    },
  },
  {
    $lookup: {
      from: "products",
      let: { categoryId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$CategoryId", "$$categoryId"] },
          },
        },
        {
          $count: "count",
        },
      ],
      as: "products",
    },
  },
  {
    $project: {
      _id: 1,
      Name: 1,
      RecordStatusType_ReferenceId: 1,
      CreatorId: 1,
      ColorId: 1,
      ProductsCount: {
        $first: {
          $cond: {
            if: {
              $eq: [{ $size: "$products.count" }, 0],
            },
            then: [0],
            else: "$products.count",
          },
        },
      },
      __v: 1,
      id: "$_id",
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
];

exports.getCategory = getCategory;
