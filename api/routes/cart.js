const router = require('express').Router();

const { celebrate: validate } = require('celebrate');

const controller = require('../controller/cart.controller');
const discountCodeController = require('../controller/discount_code.controller');
const validation = require('../validations/cart.validation');

router
  .route('/discount-code')
  .get(discountCodeController.getAvailableDiscountCodeCheck);

router
  .route('/user/:userId')
  .get(validate(validation.getCart), controller.getCart);

router
  .route('/user/:userId')
  .post(validate(validation.createCart), controller.createCart);

router
  .route('/:cartId/item')
  .post(validate(validation.addItemInCart), controller.addItemInCart);

router
  .route('/:cartId/item')
  .delete(
    validate(validation.removeItemFromCart),
    controller.removeItemFromCart
  );

router
  .route('/:cartId/checkout')
  .put(validate(validation.checkout), controller.checkout);

module.exports = router;
