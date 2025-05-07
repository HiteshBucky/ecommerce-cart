const { customJoi: Joi } = require('../utils/joi');

module.exports = {
  addDiscountCode: {
    body: {
      code: Joi.string().required(),
      discountPercent: Joi.number().required(),
      nthOrder: Joi.number().optional(),
    },
  },
};
