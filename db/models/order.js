module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount_code_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_amount: DataTypes.DECIMAL(10, 2),
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      final_amount: DataTypes.DECIMAL(10, 2),
    },
    {
      tableName: 'orders',
      underscored: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Order.belongsTo(models.DiscountCode, {
      foreignKey: 'discount_code_id',
      as: 'discountCode',
    });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
  };

  return Order;
};
