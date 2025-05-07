const { customJoi: Joi } = require('../utils/joi');

module.exports = {
  createCart: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  },
};
