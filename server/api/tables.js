const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/summary', async (req, res, next) => {
  try {
    const responseObject = {} //<------- MAKE SURE MATCHES RESTAURANT ID
    const interval = 'year'
    const revenue = await client.query(`
    SELECT
    SUM (total)
    FROM orders
    WHERE "timeOfPurchase" > now() - interval '1 year'`) //make time dynamic  <------
    responseObject.revenue = parseInt(revenue.rows[0].sum)

    const revenueVsTime = await client.query(`
    SELECT to_char("timeOfPurchase",'Mon') AS mon,
    EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
    SUM("total") AS "monthlyRevenue"
    FROM orders
    GROUP BY 1,2`)
    responseObject.revenueVsTime = revenueVsTime.rows

    const waiterCount = await client.query(`
    SELECT
    COUNT(*)
    FROM waiters
    WHERE "updatedAt" > now() - interval '1 month' `)
    responseObject.waiterCount = parseInt(waiterCount.rows[0].count)

    const numberOfGuestsByHour = await client.query(`
    SELECT
    EXTRACT(hour from orders."timeOfPurchase") AS hours,
    ROUND( AVG (orders."numberOfGuests")) AS numberOfGuests
    FROM ORDERS
    WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY hours ORDER BY hours;
    `)
    responseObject.numberOfGuestsByHour = numberOfGuestsByHour.rows

    res.json(responseObject)
  } catch (error) {
    next(error)
  }
})

router.get('/fields', async (req, res, next) => {
  try {
    const allFields = await client.query(
      `SELECT table_name
        FROM information_schema.tables
        WHERE table_type='BASE TABLE'
        AND table_schema='public'
        AND table_name !='Sessions'
        AND table_name !='users'
        AND table_name !='menuOrders'
        AND table_name !='restaurants'`
    )
    res.json(allFields.rows)
  } catch (error) {
    next(error)
  }
})

router.get('/businessAnalytics', async (req, res, next) => {
  try {
    const interval = 'year'
    const waitersByTipPercent = await client.query(`SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.total) * 100) as averageTipPercentage FROM ORDERS
    JOIN WAITERS ON orders."waiterId" = waiters.id GROUP BY waiters.name ORDER BY averageTipPercentage DESC WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval};`)

    const waitersByAvgServedDish = await client.query(`SELECT waiters.name, ROUND(SUM ("menuOrders".quantity) / 7) FROM "menuOrders"
    JOIN ORDERS ON orders.id = "menuOrders"."orderId"
    JOIN WAITERS ON orders."waiterId" = waiters.id
    WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY waiters.name;`)
  } catch (error) {
    next(error)
  }
})
