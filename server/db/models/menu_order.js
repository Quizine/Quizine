const Sequelize = require('sequelize')
const db = require('../db')

const MenuOrder = db.define('menuOrder', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = {MenuOrder}
