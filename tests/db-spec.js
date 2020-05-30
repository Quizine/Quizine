import {expect} from 'chai'

const db = require('../server/db')
const {
  User,
  Order, //Desi
  MenuItem //John
} = require('../server/db/models')

describe('Sequelize Model', () => {
  describe('User Model', () => {
    before(() => db.sync({force: true}))
    afterEach(() => db.sync({force: true}))
    it('has fields firstName, lastName, email, title, imgUrl, admin', async () => {
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Shen',
        email: 'shen@email.com',
        title: 'Administrative Manager',
        imgUrl: 'default',
        admin: false
      })
      expect(user.firstName).to.equal('Jane')
      expect(user.lastName).to.equal('Shen')
      expect(user.email).to.equal('shen@email.com')
      expect(user.title).to.equal('Administrative Manager')
      expect(user.imgUrl).to.equal('default')
      expect(user.admin).to.equal(false)
    })
  })

  describe('Order Model', () => {})
})
