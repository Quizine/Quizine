const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
/*
*** IF THE BELOW DOESN'T WORK, LET SLAVA OR I KNOW
steps to setup the config:
1. createdb nestegg
2. psql
3. \c nestegg
4. CREATE SUPERUSER yourname WITH PASSWORD 'yourpassword';
*/
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // callback
    const allWaiters = await client.query('SELECT * FROM WAITERS')
    console.log(`here are all waiters: `, allWaiters)
    res.json(allWaiters)
  } catch (error) {
    next(error)
  }
})
