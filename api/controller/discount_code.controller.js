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

// this api will be used by UI to get the applicable discount code
exports.getAvailableDiscountCodeCheck = async (req, res, next) => {
  try {
    const discountCode = await DB.DiscountCode.findOne({
      where: {
        is_used: false,
      },
      order: [['id', 'DESC']],
      attributes: ['id', 'code', 'is_used', 'discount_percent', 'nth_order'],
    });
    if (!discountCode) {
      return res.json({
        status: 200,
        message: 'No discount code available',
        data: null,
      });
    }

    // If the discount code is available, then we have to check if its valid or not by checking the nth_order
    const { nth_order: nthOrder } = discountCode;

    // Discount code can be requested by every user, but is made available for every nth order only.
    // 1. Get global order count
    const globalOrderCount = await DB.Order.count();

    // 2. Check if the next order qualifies for discount
    const isApplicable = (globalOrderCount + 1) % nthOrder === 0;

    return res.json({
      status: 200,
      message: isApplicable
        ? 'Discount code is applicable on this order'
        : `Discount code is only applicable on every ${nthOrder}th order`,
      data: isApplicable ? discountCode : null,
    });
  } catch (error) {
    return next(error);
  }
};
