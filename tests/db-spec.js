import {expect} from 'chai'

const {db} = require('../server/db')
const {
  User,
  Restaurant,
  Order,
  Waiter,
  MenuItem,
  MenuItemOrder
} = require('../server/db/models')

describe('Sequelize Model', () => {
  describe('User Model', () => {
    before(() => db.sync({force: true}))
    afterEach(() => db.sync({force: true}))
  })

  describe('Order Model', () => {})
})
