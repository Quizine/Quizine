const Sequelize = require('sequelize')
const db = require('../db')

const Menu = db.define('menu', {
  menuItem: {
    type: Sequelize.STRING,
    allowNull: false
  },
  beverageType: {
    type: Sequelize.ENUM,
    values: ['alcohol', 'nonAlcohol'],
    allowNull: true
  },
  foodType: {
    type: Sequelize.ENUM,
    values: ['appetizer', 'main', 'dessert'],
    allowNull: true
  },
  mealType: {
    type: Sequelize.ENUM,
    values: ['lunch', 'dinner'],
    allowNull: true
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Menu
