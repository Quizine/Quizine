const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const {timeInterval, tableName, columnName} = req.query
    const newQuery = await client.query(
      `SELECT "${columnName}" 
        FROM ${tableName} 
        WHERE ${tableName}."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'`
    )

    res.json(newQuery.rows)
  } catch (error) {
    next(error)
  }
})

router.get('/fields', async (req, res, next) => {
  try {
    const tables = {}
    const menuFields = await client.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'menus'`)
    const waiterFields = await client.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'waiters'`)
    const orderFields = await client.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'orders'`)
    tables.menus = menuFields.rows
    tables.waiters = waiterFields.rows
    tables.orders = orderFields.rows
    res.json(tables)
  } catch (error) {
    next(error)
  }
})
