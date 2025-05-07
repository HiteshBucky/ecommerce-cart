let { Joi } = require('celebrate');
Joi = Joi.extend(require('@hapi/joi-date'));

const customJoi = Joi.defaults((schema) =>
  schema.options({
    abortEarly: false,
    errors: {
      wrap: {
        label: false,
        array: false,
      },
    },
  })
);

module.exports = {
  customJoi,
};
