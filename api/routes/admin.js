const router = require('express').Router();
const { celebrate: validate } = require('celebrate');

const controller = require('../controller/discount_code.controller');
const validation = require('../validations/discount_code.validation');

router.route('/discount-codes').get(controller.getAvailableDiscountCode);
router
  .route('/discount-codes')
  .post(validate(validation.addDiscountCode), controller.addDiscountCode);

module.exports = router;
