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
    console.log('what is this --->', req.query)
    const {timeInterval, tableName, columnName} = req.query
    console.log(
      'sql code ------->',
      `SELECT "${columnName}" FROM ${tableName} WHERE ${tableName}."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'`
    )
    const newQuery = await client.query(
      `SELECT "${columnName}" FROM ${tableName} WHERE ${tableName}."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'`
    )
    console.log('query ------->', newQuery)
    res.json(newQuery)
  } catch (error) {
    next(error)
  }
})

router.get('/graphs/tipPercentageByWaiters', async (req, res, next) => {
  try {
    const timeInterval = req.query.timeInterval
    const tipPercentageByWaiters = await client.query(
      `SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
      FROM ORDERS
      JOIN WAITERS ON orders."waiterId" = waiters.id
      WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'
      GROUP BY waiters.name
      ORDER BY "averageTipPercentage" DESC;`
    )
    const [xAxis, yAxis] = axisMapping(
      tipPercentageByWaiters.rows,
      tipPercentageByWaiters.fields[0].name,
      tipPercentageByWaiters.fields[1].name
    )
    res.json({xAxis, yAxis})
  } catch (error) {
    next(error)
  }
})

router.get('/graphs/menuSalesNumbers', async (req, res, next) => {
  try {
    if (req.user.id) {
      const timeInterval = req.query.timeInterval
      const menuSalesNumbers = await client.query(`
      SELECT menus."menuName" as name,
      SUM("menuOrders" .quantity) as total
      FROM "menuOrders"
      JOIN menus on menus.id = "menuOrders"."menuId"
      JOIN orders on orders.id = "menuOrders"."orderId"
      WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'
      GROUP BY name
      ORDER BY total desc;
      `)
      const [xAxis, yAxis] = axisMapping(
        menuSalesNumbers.rows,
        menuSalesNumbers.fields[0].name,
        menuSalesNumbers.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
  } catch (error) {
    next(error)
  }
})

function axisMapping(arr, xAxisName, yAxisName) {
  const xAxis = []
  const yAxis = []
  arr.forEach(el => {
    xAxis.push(el[xAxisName])
    yAxis.push(+el[yAxisName])
  })

  return [xAxis, yAxis]
}
