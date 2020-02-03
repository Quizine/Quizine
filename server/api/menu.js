const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allMenu = await client.query('SELECT * FROM MENUS')
    res.json(allMenu)
  } catch (error) {
    next(error)
  }
})
