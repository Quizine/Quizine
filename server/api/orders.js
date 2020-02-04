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

router.get('/fields', async (req, res, next) => {
  try {
    const orderFields = await client.query('SELECT * FROM ORDERS WHERE ID = 1')
    res.json(orderFields.fields)
  } catch (error) {
    next(error)
  }
})
