const Sequelize = require('sequelize')
const db = require('../db')

const Restaurant = db.define('restaurant', {
  restaurantName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Restaurant
