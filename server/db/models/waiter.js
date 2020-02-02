const Sequelize = require('sequelize')
const db = require('../db')

const Waiter = db.define('waiter', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sex: {
    type: Sequelize.ENUM,
    values: ['male', 'female'],
    allowNull: true
  }
})

module.exports = Waiter
