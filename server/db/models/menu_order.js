const Sequelize = require('sequelize')
const db = require('../db')

const menuOrder = db.define('menuOrder', {
  quantity: {
    type: Sequelize.INTEGER
  }
})

module.exports = {menuOrder}
