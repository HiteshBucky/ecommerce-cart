const DB = global.sequelize;

exports.getAvailableDiscountCode = async (req, res, next) => {
  try {
    const discountCode = await DB.DiscountCode.findOne({
      order: [['id', 'DESC']],
      attributes: ['id', 'code', 'is_used', 'discount_percent', 'nth_order'],
    });

    return res.json({
      status: 200,
      message: 'Details fetched Successfully',
      data: discountCode,
    });
  } catch (error) {
    return next(error);
  }
};

exports.addDiscountCode = async (req, res, next) => {
  try {
    // check if the discount code already exists
    await DB.DiscountCode.destroy({
      where: {
        is_used: false,
      },
    });

    const { code, discountPercent, nthOrder = 10 } = req.body;

    await DB.DiscountCode.create({
      code,
      is_used: false,
      discount_percent: discountPercent,
      nth_order: nthOrder,
    });

    return res.json({
      status: 200,
      message: 'Discount code added Successfully',
    });
  } catch (error) {
    return next(error);
  }
};
