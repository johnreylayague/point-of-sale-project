const getProducts = async (req, res, next) => {
  const {} = req.body;

  res.status(200).json({ message: "Successfully retrieve records" });
};

exports.getProducts = getProducts;
