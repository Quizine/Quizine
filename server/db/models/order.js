const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  timeOfPurchase: {
    type: Sequelize.DATE,
    allowNull: false
  },
  subtotal: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tax: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tip: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  numberOfGuests: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Order
