const getSales = (userId) => [
  {
    $match: {
      $expr: { $eq: ["$CreatorId", { $toObjectId: userId }] },
    },
  },
  {
    $lookup: {
      from: "productsolds",
      let: { currentId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$SalesId", "$$currentId"] },
          },
        },
        {
          $project: {
            ProductId: 1,
            Quantity: 1,
            TotalPaid: 1,
            RecordStatusType_ReferenceId: 1,
          },
        },
        {
          $lookup: {
            from: "products",
            let: { currentId: "$ProductId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$currentId"] },
                },
              },
              {
                $project: {
                  ProductDetailId: 1,
                  Price: 1,
                },
              },
              {
                $lookup: {
                  from: "productdetails",
                  let: { currentId: "$ProductDetailId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$currentId"] },
                      },
                    },
                    {
                      $project: {
                        Description: 1,
                        BarCode: 1,
                        Name: 1,
                        SKU: 1,
                      },
                    },
                  ],
                  as: "ProductDetailId",
                },
              },
            ],
            as: "ProductId",
          },
        },
        {
          $project: {
            _id: 1,
            Name: {
              $first: { $first: "$ProductId.ProductDetailId.Name" },
            },
            Price: { $first: "$ProductId.Price" },
            TotalPaid: 1,
            RecordStatusType_ReferenceId: 1,
          },
        },
      ],
      as: "ProductSold",
    },
  },
  {
    $project: {
      _id: 1,
      ProductSold: "$ProductSold",
      PaymentTypeId: 1,
      CreatorId: 1,
      isVoid: 1,
      CashReceived: 1,
      TotalPaid: 1,
      Change: 1,
      RecordStatusType_ReferenceId: 1,
      __v: 1,
    },
  },
];

exports.getSales = getSales;
