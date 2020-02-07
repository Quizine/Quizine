'use strict'

const db = require('../server/db')
const {
  User,
  Restaurant,
  Order,
  Waiter,
  Menu,
  MenuOrder
} = require('../server/db/models')

const {
  server,
  menu,
  purchaseList,
  orderMenuTable
} = require('../databaseSeedScripts/orderSeedScript')

let restaurant = [
  {
    restaurantName: 'Pastis',
    category: 'French',
    location: '52 Gansevoort St, New York, NY 10014'
  }
]

let userArray = [
  {
    firstName: 'Nathan',
    lastName: 'Lilson',
    email: 'nathan@email.com',
    password: '123',
    restaurantId: 1,
    title: 'Restaurant Manager',
    imgUrl:
      'https://www.acitydiscount.com/images/mkt/content/282/Restaurant-manager-holding-hands-boh-kitchen-1.jpg'
  },
  {
    firstName: 'Anna',
    lastName: 'Verrier',
    email: 'anna@email.com',
    password: '123',
    restaurantId: 1,
    title: 'Restaurant Owner',
    imgUrl:
      'https://hiring-assets.careerbuilder.com/media/attachments/careerbuilder-ar_post-2372.jpg?1465925468'
  }
]

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const restaurants = await Restaurant.bulkCreate(restaurant)
  const waiters = await Waiter.bulkCreate(server)
  const orders = await Order.bulkCreate(purchaseList)
  const users = await User.bulkCreate(userArray)
  const menus = await Menu.bulkCreate(menu)
  const menuOrders = await MenuOrder.bulkCreate(orderMenuTable)

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
