exports.createCart = async (req, res, next) => {
  try {
    return res.json({ status: 200, message: 'Cart Created Successfully' });
  } catch (error) {
    return next(error);
  }
};
