module.exports = {
  async up(queryInterface) {
    const users = Array.from({ length: 5 }).map((_, i) => ({
      name: `User ${i + 1}`,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const products = Array.from({ length: 20 }).map((_, i) => ({
      name: `Product ${i + 1}`,
      price: (Math.random() * 100 + 10).toFixed(2),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('users', users);
    await queryInterface.bulkInsert('products', products);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
