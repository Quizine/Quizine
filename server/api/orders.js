const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // callback
    const allOrders = await client.query('SELECT * FROM ORDERS')
    console.log(`here are all waiters: `, allOrders)
    res.json(allOrders)
  } catch (error) {
    next(error)
  }
})
