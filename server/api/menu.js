const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // callback
    const allMenu = await client.query('SELECT * FROM MENUS')
    console.log(`here are all waiters: `, allMenu)
    res.json(allMenu)
  } catch (error) {
    next(error)
  }
})
