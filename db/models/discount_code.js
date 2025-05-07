module.exports = (sequelize, DataTypes) => {
  const DiscountCode = sequelize.define(
    'DiscountCode',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      discount_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      nth_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'discount_codes',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  DiscountCode.associate = (models) => {
    DiscountCode.hasOne(models.Order, {
      foreignKey: 'discount_code_id',
      as: 'order',
    });
  };

  return DiscountCode;
};
