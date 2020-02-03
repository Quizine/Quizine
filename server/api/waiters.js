const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allWaiters = await client.query('SELECT * FROM WAITERS')
    res.json(allWaiters)
  } catch (error) {
    next(error)
  }
})

router.get('/query/:field/:input', async (req, res, next) => {
  try {
    const {field, input} = req.params
    const allWaiters = await client.query(
      `SELECT * FROM WAITERS WHERE ${field} = '${input}'`
    )
    res.json(allWaiters)
  } catch (error) {
    next(error)
  }
})
