const DB = global.sequelize;

exports.getProductList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const products = await DB.Product.findAndCountAll({
      limit,
      offset,
    });

    return res.json({
      status: 200,
      message: 'Details Fetched Successfully',
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};
