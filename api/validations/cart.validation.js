const { customJoi: Joi } = require('../utils/joi');

module.exports = {
  createCart: {
    params: Joi.object().keys({
      userId: Joi.number().required(),
    }),
  },
  getCart: {
    params: {
      userId: Joi.number().required(),
    },
  },
  addItemInCart: {
    params: {
      cartId: Joi.number().required(),
    },
    body: Joi.object().keys({
      productId: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
  },
  removeItemFromCart: {
    params: {
      cartId: Joi.number().required(),
    },
    body: Joi.object().keys({
      productId: Joi.number().required(),
    }),
  },
  checkout: {
    params: {
      cartId: Joi.number().required(),
    },
    body: Joi.object().keys({
      discountCode: Joi.string().optional(),
    }),
  },
};
