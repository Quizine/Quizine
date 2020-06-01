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
    it('firstName, lastName, email, title, imgUrl, and admin cannot be null', async () => {
      const user = await User.build()
      try {
        await user.validate()
        throw Error(
          'validation should have failed with firstName, lastName, email, title, and imgUrl as null'
        )
      } catch (err) {
        expect(err.message).to.contain('user.firstName cannot be null')
        expect(err.message).to.contain('user.lastName cannot be null')
        expect(err.message).to.contain('user.email cannot be null')
        expect(err.message).to.contain('user.title cannot be null')
        expect(err.message).to.contain('user.imgUrl cannot be null')
      }
    })
    it('admin should be false if left blank', async () => {
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Shen',
        email: 'shen@email.com',
        title: 'Administrative Manager',
        imgUrl: 'default',
        admin: false
      })
      expect(user.admin).to.equal(false)
    })
    it('email should be a valid email', async () => {
      const user = await User.build({
        firstName: 'Jane',
        lastName: 'Shen',
        email: 'gmail.com',
        title: 'Administrative Manager',
        imgUrl: 'default',
        admin: false
      })
      try {
        await user.validate()
        throw Error('validation should have failed with invalid email')
      } catch (err) {
        expect(err.message).to.contain('Validation isEmail on email failed')
      }
    })
  })

  describe('Order Model', () => {})

  describe('Menu Model', () => {
    before(() => db.sync({force: true}))
    afterEach(() => db.sync({force: true}))
    it('has menu item name, beverage type, food type, meal type, and price ', async () => {
      const menu = await MenuItem.create({
        menuItemName: 'chocolate',
        beverageType: null,
        foodType: 'dessert',
        mealType: null,
        price: 10
      })
      expect(menu.menuItemName).to.equal('chocolate')
      expect(menu.beverageType).to.equal(null)
      expect(menu.foodType).to.equal('dessert')
      expect(menu.mealType).to.equal(null)
      expect(menu.price).to.equal(10)
    })
    it('requires menu item name and price ', async () => {
      const menu = await MenuItem.build({
        menuItemName: null,
        price: null
      })
      try {
        await menu.validate()
        throw Error(
          'validation should have failed with name and address as null'
        )
      } catch (err) {
        expect(err.message).to.contain('menuItem.menuItemName cannot be null')
        expect(err.message).to.contain('menuItem.price cannot be null')
      }
    })
    it('beverageType other than alcohol, nonAlcohol, or null should fail validation', async () => {
      const menu = await MenuItem.build({
        menuItemName: 'coke',
        beverageType: 'soda',
        price: 10
      })
      try {
        await menu.validate()
        throw Error('validation should have failed with beverageType as soda')
      } catch (err) {
        expect(err.message).to.contain(
          'validation should have failed with beverageType as soda'
        )
      }
    })
    it('foodType other than appetizer, main, dessert, or null should fail validation', async () => {
      const menu = await MenuItem.build({
        menuItemName: 'soup',
        beverageType: 'soup',
        price: 10
      })
      try {
        await menu.validate()
        throw Error('validation should have failed with foodType as soup')
      } catch (err) {
        expect(err.message).to.contain(
          'validation should have failed with foodType as soup'
        )
      }
    })
    it('mealType other than lunch, dinner, or null should fail validation', async () => {
      const menu = await MenuItem.build({
        menuItemName: 'bread',
        mealType: 'breakfast',
        price: 10
      })
      try {
        await menu.validate()
        throw Error('validation should have failed with mealType as breakfast')
      } catch (err) {
        expect(err.message).to.contain(
          'validation should have failed with mealType as breakfast'
        )
      }
    })
  })
})
