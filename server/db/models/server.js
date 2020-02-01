const Sequelize = require('sequelize')
const db = require('../db')

const Server = db.define('server', {
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
    allowNull: false,
    values: ['male', 'female']
  }
})

module.exports = Server
