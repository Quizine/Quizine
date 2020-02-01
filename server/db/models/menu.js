const Sequelize = require('sequelize')
const db = require('../db')

const Menu = db.define('menu', {
  menuName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  beverageType: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['alcoholic', 'nonAlcoholic', null]
  },
  foodType: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['appetizer', 'main', 'dessert', null]
  },
  mealType: {
    allowNull: false,
    type: Sequelize.ENUM,
    values: ['lunch', 'dinner', null]
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Menu
