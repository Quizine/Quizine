const Sequelize = require('sequelize')
const db = require('../db')

const MenuOrder = db.define('menuOrder', {
  quantity: {
    type: Sequelize.INTEGER
  }
})

module.exports = {MenuOrder}
