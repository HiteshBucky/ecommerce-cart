const router = require('express').Router();

const cartRoute = require('./cart');
const productRoute = require('./product');

router.get('/', (req, res) => res.send('API is running'));
router.use('/cart', cartRoute);
router.use('/product', productRoute);

module.exports = router;
