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
    $lookup: {
      from: "shapes",
      let: { shapeId: "$ShapeId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$shapeId"] },
          },
        },
        {
          $project: {
            Shape: 1,
          },
        },
      ],
      as: "shape",
    },
  },
  {
    $lookup: {
      from: "colors",
      let: { colorId: "$ColorId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$colorId"] },
          },
        },
        {
          $project: {
            Color: 1,
          },
        },
      ],
      as: "color",
    },
  },
  {
    $project: {
      _id: 1,
      Name: { $first: "$productdetail.Name" },
      SKU: { $first: "$productdetail.SKU" },
      BarCode: { $first: "$productdetail.BarCode" },
      Price: 1,
      Cost: 1,
      ImagePath: { $first: "$attachment.Image" },
      TrackStock: { $first: "$inventory.TrackStock" },
      InStock: { $first: "$inventory.InStock" },
      LowStock: { $first: "$inventory.LowStock" },
      SoldByOptionId: 1,
      CategoryId: 1,
      ShapeName: {
        $first: {
          $cond: {
            if: {
              $eq: [{ $size: "$shape.Shape" }, 0],
            },
            then: null,
            else: "$shape.Shape",
          },
        },
      },
      ColorName: {
        $first: {
          $cond: {
            if: {
              $eq: [{ $size: "$color.Color" }, 0],
            },
            then: null,
            else: "$color.Color",
          },
        },
      },
      RepresentationId: 1,
      RecordStatusType_ReferenceId: 1,
      CreatorId: 1,
      __v: 1,
      id: "$_id",
    },
  },
];

exports.getProducts = getProducts;
