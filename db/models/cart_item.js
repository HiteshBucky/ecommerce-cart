module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'cart_items',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      onDelete: 'CASCADE',
      as: 'cart',
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      as: 'product',
    });
  };

  return CartItem;
};
