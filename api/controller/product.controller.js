exports.getProductList = async (req, res, next) => {
  try {
    return res.json({
      status: 200,
      message: 'Details Fetched Successfully',
      data: { count: 0, rows: [] },
    });
  } catch (error) {
    return next(error);
  }
};
