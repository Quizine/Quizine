const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
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

router.get('/newQuery', async (req, res, next) => {
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

router.get('/numberOfOrdersPerHour', async (req, res, next) => {
  try {
    const interval = req.query.interval
    if (req.user.id) {
      const numberOfOrdersPerHour = await client.query(
        `SELECT EXTRACT(hour FROM "timeOfPurchase") AS hour,
        COUNT(*) AS "numberOfOrders"
        FROM orders
        WHERE "timeOfPurchase" >= NOW() - interval '1 ${interval}'
        GROUP BY hour
        ORDER BY hour
        ASC;`
      )
      const numberOfOrdersArr = numberOfOrdersPerHour.rows.map(el =>
        Number(el.numberOfOrders)
      )
      res.json(numberOfOrdersArr)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/avgRevPerGuest', async (req, res, next) => {
  try {
    const interval = req.query.interval
    if (req.user.id) {
      const avgRevPerGuest = await client.query(
        `SELECT EXTRACT(DOW FROM "timeOfPurchase") AS day, 
        ROUND((SUM(total)::numeric)/SUM("numberOfGuests")/100, 2) revenue_per_guest
        FROM orders
        WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
        GROUP BY day
        ORDER BY day ASC;`
      )
      const avgRevPerGuestArr = avgRevPerGuest.rows.map(el =>
        Number(el.revenue_per_guest)
      )
      res.json(avgRevPerGuestArr)
    }
  } catch (error) {
    next(error)
  }
})
