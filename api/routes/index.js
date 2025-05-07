const router = require('express').Router();

const cartRoute = require('./cart');
const productRoute = require('./product');
const adminRoute = require('./admin');

router.get('/', (req, res) => res.send('API is running'));
router.use('/cart', cartRoute);
router.use('/product', productRoute);
router.use('/admin', adminRoute);

module.exports = router;
