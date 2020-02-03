const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allOrders = await client.query('SELECT * FROM ORDERS')
    res.json(allOrders)
  } catch (error) {
    next(error)
  }
})

router.get('/query', async (req, res, next) => {
  try {
    const allOrders = await client.query('SELECT * FROM ORDERS')
    res.json(allOrders)
  } catch (error) {
    next(error)
  }
})
