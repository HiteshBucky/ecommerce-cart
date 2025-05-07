module.exports = {
  apps: [
    {
      name: 'ecommerce',
      script: 'current/index.js',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
