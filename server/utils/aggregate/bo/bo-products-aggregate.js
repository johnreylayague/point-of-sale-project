const getProducts = (userId) => [
  {
    $match: {
      $expr: { $eq: ["$CreatorId", { $toObjectId: userId }] },
    },
  },
  {
    $lookup: {
      from: "productdetails",
      let: { productId: "$ProductDetailId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$productId"] },
          },
        },
        {
          $project: {
            Name: 1,
            SKU: 1,
            BarCode: 1,
            Description: 1,
          },
        },
      ],
      as: "productdetail",
    },
  },
  {
    $lookup: {
      from: "inventories",
      let: { inventoryId: "$InventoryId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$inventoryId"] },
          },
        },
        {
          $project: {
            TrackStock: 1,
            InStock: 1,
            LowStock: 1,
          },
        },
      ],
      as: "inventory",
    },
  },
  {
    $lookup: {
      from: "attachments",
      let: { attachmentId: "$AttachmentId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$attachmentId"] },
          },
        },
        {
          $project: {
            Image: 1,
          },
        },
      ],
      as: "attachment",
    },
  },
  {
    $project: {
      _id: 1,
      Name: { $first: "$productdetail.Name" },
      SKU: { $first: "$productdetail.SKU" },
      BarCode: { $first: "$productdetail.BarCode" },
      Description: { $first: "$productdetail.Description" },
      Price: 1,
      Cost: 1,
      Image: { $first: "$attachment.Image" },
      TrackStock: { $first: "$inventory.TrackStock" },
      InStock: { $first: "$inventory.InStock" },
      LowStock: { $first: "$inventory.LowStock" },
      SoldByOptionId: 1,
      CategoryId: 1,
      ShapeId: 1,
      ColorId: 1,
      RepresentationId: 1,
      RecordStatusType_ReferenceId: 1,
      CreatorId: 1,
      __v: 1,
      id: "$_id",
    },
  },
];

exports.getProducts = getProducts;
