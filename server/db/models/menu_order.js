const Sequelize = require('sequelize')
const db = require('../db')

const Menu_Order = db.define('menu_order', {
  qty: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  priceOnOrder: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Menu_Order
