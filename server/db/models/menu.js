const Sequelize = require('sequelize')
const db = require('../db')

const Menu = db.define('menu', {
  menuName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  beverageType: {
    type: Sequelize.ENUM,
    values: ['alcoholic', 'nonAlcoholic', null]
  },
  foodType: {
    type: Sequelize.ENUM,
    values: ['appetizer', 'main', 'dessert', null]
  },
  mealType: {
    type: Sequelize.ENUM,
    values: ['lunch', 'dinner', null]
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Menu
