// Init sequelize
const app = require('./config/express');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

app.listen(port, () => console.info(`server started on port ${port} (${env})`));

module.exports = app;
