const Sequelize = require('sequelize')
const db = require('../db')

const MenuItemOrder = db.define('menuItemOrder', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = {MenuItemOrder}
