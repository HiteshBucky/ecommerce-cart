module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Cart, { foreignKey: 'user_id', as: 'cart' });
    User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
  };

  return User;
};
