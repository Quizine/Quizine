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

router.get('/searchlast', async (req, res, next) => {
  try {
    // callback
    const interval = req.query.interval
    const allOrders = await client.query(
      `SELECT extract(hour from orders."timeOfPurchase"), orders."numGuests" FROM ORDERS WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'`
    )
    const arr = new Array(24).fill(0)
    allOrders.rows.forEach(order => {
      arr[order.date_part] += order.numGuests
    })
    const totalGuests = arr.slice(11, -1).reduce((accum, val) => accum + val)
    const arrInPercentage = arr
      .map(el => Math.ceil(el / totalGuests * 100))
      .slice(11, -1)
    console.log(arrInPercentage)
    res.json(arrInPercentage)
  } catch (error) {
    next(error)
  }
})
