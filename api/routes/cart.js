const router = require('express').Router();

const controller = require('../controller/cart.controller');

router.route('/user/:userId').post(controller.createCart);

module.exports = router;
