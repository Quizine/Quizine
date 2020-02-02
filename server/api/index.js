const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
/*
steps to setup the config:
1. createdb nestegg
2. psql
3. CREATE USER yourname WITH PASSWORD 'yourpassword';
4. ALTER USER yourname WITH SUPERUSER;
*/
const client = new pg.Client(config)
client.connect()

module.exports = router

router.use('/users', require('./users'))
router.use('/waiters', require('./waiters'))
router.use('/orders', require('./orders'))
router.use('/menu', require('./menu'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
