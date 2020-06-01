import {expect} from 'chai'

const db = require('../server/db')
const {User, Order, MenuItem} = require('../server/db/models')

describe('Sequelize Model', () => {
  describe('User Model', () => {
    before(() => db.sync({force: true}))
    afterEach(() => db.sync({force: true}))
    it('has first name, last name, email, title, imgUrl and admin fields', async () => {
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
        imgUrl: 'default'
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

  describe('Order Model', async () => {
    before(() => db.sync({force: true}))
    afterEach(() => db.sync({force: true}))
    it('has time of purchase field which is a date, and subtotal, tax, tip, revenue and number of guests fields which are numbers', async () => {
      const order = await Order.create({
        timeOfPurchase: 'Fri, 22 Nov 2019 22:38:00 GMT',
        subtotal: 220,
        tax: 22,
        tip: 20,
        revenue: 262,
        numberOfGuests: 5
      })
      expect(order.timeOfPurchase.toString()).to.equal(
        'Fri Nov 22 2019 17:38:00 GMT-0500 (Eastern Standard Time)'
      )
      expect(order.subtotal).to.equal(220)
      expect(order.tax).to.equal(22)
      expect(order.tip).to.equal(20)
      expect(order.revenue).to.equal(262)
      expect(order.numberOfGuests).to.equal(5)
      expect(order.timeOfPurchase).to.be.a('date')
      expect(order.subtotal).to.be.a('number')
      expect(order.tax).to.be.a('number')
      expect(order.tip).to.be.a('number')
      expect(order.revenue).to.be.a('number')
      expect(order.numberOfGuests).to.be.a('number')
    })
    it('requires time of purchase, subtotal, tax, tip, revenue and number of guests', async () => {
      const order = await Order.build({
        timeOfPurchase: null,
        subtotal: null,
        tax: null,
        tip: null,
        revenue: null,
        numberOfGuests: null
      })
      try {
        await order.validate()
        throw Error(
          'validation should have failed with time of purchase, subtotal, tax, tip, revenue and number of guests as null'
        )
      } catch (err) {
        expect(err.message).to.contain('order.timeOfPurchase cannot be null')
        expect(err.message).to.contain('order.subtotal cannot be null')
        expect(err.message).to.contain('order.tax cannot be null')
        expect(err.message).to.contain('order.tip cannot be null')
        expect(err.message).to.contain('order.revenue cannot be null')
        expect(err.message).to.contain('order.numberOfGuests cannot be null')
      }
    })
    it('type of time of purchase field is a date', async () => {
      const newOrder = {
        timeOfPurchase: 'string',
        subtotal: 220,
        tax: 22,
        tip: 20,
        revenue: 262,
        numberOfGuests: 5
      }
      try {
        await Order.create(newOrder)
        throw Error(
          'input syntax should have failed with time of purchase as string'
        )
      } catch (err) {
        expect(err.message).to.contain('Invalid date')
      }
    })
  })

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
