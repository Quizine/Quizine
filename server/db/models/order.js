const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  timeOfPurchase: {
    type: Sequelize.DATE,
    allowNull: false
  },
  subTotal: {
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
  numGuests: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  paymentMethod: {
    type: Sequelize.ENUM,
    values: ['cash', 'credit', 'debit'], //NOT SURE WHAT ENUM VALUES EVERYONE WANTS
    allowNull: false
  }
})

module.exports = Order
