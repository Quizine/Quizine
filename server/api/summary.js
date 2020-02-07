const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

//ADD "AND restauranId" condition

router.get('/restaurantInfo', async (req, res, next) => {
  try {
    if (req.user.id) {
      const restaurantInfo = await client.query(`
      SELECT "restaurantName", "location"
      FROM restaurants
      WHERE restaurants.id = ${req.user.restaurantId}`)
      res.json(restaurantInfo.rows)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfWaiters', async (req, res, next) => {
  try {
    const waiterCount = await client.query(`
      SELECT
      COUNT(*)
      FROM waiters `)
    const numOfWaiters = Number(waiterCount.rows[0].count)
    // probably issues
    console.log(numOfWaiters)
    res.json(numOfWaiters)
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfGuestsVsHour', async (req, res, next) => {
  try {
    const interval = req.query.interval
    const numberOfGuestsVsHour = await client.query(
      `
    SELECT
  EXTRACT(hour from orders."timeOfPurchase") AS hours,
  SUM(orders."numberOfGuests"),
  ROUND( 100.0 * (
  	SUM(orders."numberOfGuests")::DECIMAL / (
  		SELECT SUM(orders."numberOfGuests")
  		FROM orders
  		WHERE orders."timeOfPurchase" >= NOW() - INTERVAL '1 ${interval}'
  	)), 1) AS percentage
FROM ORDERS
WHERE orders."timeOfPurchase" >= NOW() - INTERVAL '1 ${interval}'
GROUP BY hours
ORDER BY hours;
      `
    )
    const percentageArr = numberOfGuestsVsHour.rows.map(el =>
      Number(el.percentage)
    )
    res.json(percentageArr)
  } catch (error) {
    next(error)
  }
})

router.get('/revenueVsTime', async (req, res, next) => {
  try {
    const year = req.query.year
    const revenueVsTime = await client.query(`
    select to_char("timeOfPurchase",'Mon') AS mon,
    date_trunc('month', orders."timeOfPurchase" ) as m,
    EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
    SUM("total") AS "monthlyRevenue"
    from orders
    WHERE orders."timeOfPurchase" >= NOW() - interval '${year} year'
    group by mon, m, yyyy
    order by m
    `)
    const allDateRevenue = {month: [], revenue: []}
    revenueVsTime.rows.forEach(row => {
      allDateRevenue.month.push(`${row.mon} ${String(row.yyyy)}`)
      allDateRevenue.revenue.push(Number(row.monthlyRevenue) / 100)
    })
    res.json(allDateRevenue)
  } catch (error) {
    next(error)
  }
})

router.get('/DOWAnalysisTable', async (req, res, next) => {
  try {
    const DOWAnalysisTable = await client.query(
      `SELECT EXTRACT(DOW FROM orders."timeOfPurchase") AS "dayOfWeek", SUM(orders."numberOfGuests") AS "numberOfGuests", ROUND((SUM(orders.total)::numeric)/100000,2) AS "dayRevenue", SUM("summedMenuOrder"."summedQuantity")
      FROM orders
      JOIN (SELECT SUM("menuOrders".quantity) AS "summedQuantity", "menuOrders"."orderId" FROM "menuOrders" GROUP BY "menuOrders"."orderId") AS "summedMenuOrder"
      ON orders.id = "summedMenuOrder"."orderId"
      WHERE orders."timeOfPurchase" >= NOW() - interval '1 year'
      GROUP BY "dayOfWeek"
      ORDER by "dayOfWeek" ASC;
        `
    )
    res.json(tableFormatting(DOWAnalysisTable.rows))
  } catch (error) {
    next(error)
  }
})

function tableFormatting(array) {
  let DOWconversion = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  array.forEach(element => {
    element.dayOfWeek = DOWconversion[element.dayOfWeek]
  })
  return array
}
