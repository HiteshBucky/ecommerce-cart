module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: DataTypes.STRING,
    },
    {
      tableName: 'products',
      underscored: true,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cartItems',
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems',
    });
  };

  return Product;
};
