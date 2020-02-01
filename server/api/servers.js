const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // callback
    const allServers = await client.query('SELECT * FROM SERVERS')
    console.log(`here are all servers: `, allServers)
    res.json(allServers)
  } catch (error) {
    next(error)
  }
})
