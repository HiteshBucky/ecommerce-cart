const _ = require('lodash');
const APIError = require('../utils/APIError');

const DB = global.sequelize;

exports.createCart = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await DB.User.findOne({
      whilere: { id: userId },
    });
    if (!user) {
      throw new APIError({ status: 404, message: 'User not found' });
    }

    // Check if cart already exists for the user
    const existingCart = await DB.Cart.findOne({ where: { user_id: userId } });
    if (existingCart) {
      throw new APIError({
        status: 400,
        message: 'Cart already exists for this user',
      });
    }

    // Create a new cart
    await DB.Cart.create({
      user_id: userId,
      total_price: 0,
      total_items: 0,
    });

    return res.json({ status: 200, message: 'Cart Created Successfully' });
  } catch (error) {
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    console.log('get cart');
    const { userId } = req.params;
    // Check if user exists
    const user = await DB.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new APIError({ status: 404, message: 'User not found' });
    }

    // find the cart for the user
    const cart = await DB.Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.json({
        status: 404,
        message: 'Cart not found',
        data: null,
      });
    }

    // find the cart items for the user
    const cartItems = await DB.CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: DB.Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
        },
      ],
    });

    const response = {
      cart: {
        id: cart.id,
        total_items: cartItems.length,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
      })),
    };

    return res.json({
      status: 200,
      message: 'Details Fetched Successfully',
      data: response,
    });
  } catch (error) {
    return next(error);
  }
};

exports.addItemInCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    // Check if cart exists
    const cart = await DB.Cart.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new APIError({ status: 404, message: 'Cart not found' });
    }

    // Check if product exists
    const product = await DB.Product.findOne({ where: { id: productId } });
    if (!product) {
      throw new APIError({ status: 404, message: 'Product not found' });
    }

    // Check if item already exists in the cart
    const existingItem = await DB.CartItem.findOne({
      where: { cart_id: cartId, product_id: productId },
    });
    if (existingItem) {
      // Update the quantity of the existing item
      await DB.CartItem.update(
        { quantity: existingItem.quantity + quantity },
        { where: { id: existingItem.id } }
      );
    } else {
      // Add new item to the cart
      await DB.CartItem.create({
        cart_id: cartId,
        product_id: productId,
        quantity,
      });
    }

    return res.json({ status: 200, message: 'Item added Successfully' });
  } catch (error) {
    return next(error);
  }
};

exports.removeItemFromCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.body;
    // Check if cart exists
    const cart = await DB.Cart.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new APIError({ status: 404, message: 'Cart not found' });
    }
    // Check if product exists
    const product = await DB.Product.findOne({ where: { id: productId } });
    if (!product) {
      throw new APIError({ status: 404, message: 'Product not found' });
    }
    // Check if item exists in the cart
    const existingItem = await DB.CartItem.findOne({
      where: { cart_id: cartId, product_id: productId },
    });
    if (!existingItem) {
      throw new APIError({ status: 404, message: 'Item not found in cart' });
    }
    // Remove item from the cart
    await DB.CartItem.destroy({ where: { id: existingItem.id } });

    return res.json({ status: 200, message: 'Item removed Successfully' });
  } catch (error) {
    return next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { discountCode } = req.body;

    // Check if cart exists
    const cart = await DB.Cart.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new APIError({ status: 404, message: 'Cart not found' });
    }

    // check if cart is empty
    const cartItems = await DB.CartItem.findAll({
      where: { cart_id: cartId },
      include: [{ model: DB.Product, as: 'product' }],
    });
    if (cartItems.length === 0) {
      throw new APIError({ status: 400, message: 'Cart is empty' });
    }

    // Check if discount code is valid
    let discountPercent = 0;
    let discount = null;
    if (discountCode) {
      discount = await DB.DiscountCode.findOne({
        where: { code: discountCode, is_used: false },
      });
      if (!discount) {
        throw new APIError({ status: 400, message: 'Invalid discount code' });
      }

      // Check if the discount code is applicable for this order
      const nthOrder = discount.nth_order;

      const globalOrderCount = await DB.Order.count();
      const isApplicable = (globalOrderCount + 1) % nthOrder === 0;

      if (isApplicable) {
        discountPercent = discount.discount_percent;
      }
    }

    // Calculate total price
    const totalPrice = _.sumBy(
      cartItems,
      (item) => parseFloat(item.product.price) * item.quantity
    );

    // Apply discount if applicable
    const finalPrice = totalPrice - (totalPrice * discountPercent) / 100;

    await DB.sequelize.transaction(async (transaction) => {
      // Create order
      const order = await DB.Order.create(
        {
          user_id: cart.user_id,
          total_price: finalPrice,
          discount_code_id: discountCode ? discount.id : null,
          total_amount: totalPrice,
          discount_amount: (totalPrice * discountPercent) / 100,
          final_amount: finalPrice,
        },
        { transaction }
      );

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await DB.OrderItem.bulkCreate(orderItems, { transaction });

      // Mark discount code as used if applicable
      if (discountCode) {
        await DB.DiscountCode.update(
          { is_used: true },
          { where: { id: discount.id }, transaction }
        );
      }

      // Clear the cart
      await DB.CartItem.destroy({ where: { cart_id: cartId }, transaction });
    });

    return res.json({ status: 200, message: 'Order Created Successfully' });
  } catch (error) {
    return next(error);
  }
};
