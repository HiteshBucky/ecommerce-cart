module.exports = {
  up: async (queryInterface, Sequelize) => {
    // USERS
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // PRODUCTS
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // CARTS
    await queryInterface.createTable('carts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // CART ITEMS
    await queryInterface.createTable('cart_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cart_id: {
        type: Sequelize.INTEGER,
        references: { model: 'carts', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // DISCOUNT CODES
    await queryInterface.createTable('discount_codes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING, unique: true },
      is_used: { type: Sequelize.BOOLEAN, defaultValue: false },
      discount_percent: { type: Sequelize.INTEGER, defaultValue: 10 },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // ORDERS
    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      discount_code_id: {
        type: Sequelize.INTEGER,
        references: { model: 'discount_codes', key: 'id' },
        allowNull: true,
      },
      total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discount_amount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      final_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // ORDER ITEMS
    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      order_id: {
        type: Sequelize.INTEGER,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('discount_codes');
    await queryInterface.dropTable('cart_items');
    await queryInterface.dropTable('carts');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('users');
  },
};
