const db = require('../db/models');

exports.init = () => {
  global.sequelize = db;
};
