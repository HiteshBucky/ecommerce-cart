const router = require('express').Router();

const controller = require('../controller/product.controller');

router.route('/').get(controller.getProductList);

module.exports = router;
