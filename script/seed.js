'use strict'

const db = require('../server/db')
const {
  User,
  Restaurant,
  Order,
  Waiter,
  Menu,
  menuOrder
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

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
  const restaurants = await Restaurant.bulkCreate(restaurant)
  const waiters = await Waiter.bulkCreate(server)
  const menus = await Menu.bulkCreate(menu)
  const orders = await Order.bulkCreate(purchaseList)
  const menuOrders = await menuOrder.bulkCreate(orderMenuTable)

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
