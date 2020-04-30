var Sequelize = require('sequelize');
var config = require('./config/config.json')

module.exports = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOSTNAME,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false // true by default. false because bydefault sequelize adds createdAt, modifiedAt columns with timestamps.if you want those columns make ths true.
    }
});