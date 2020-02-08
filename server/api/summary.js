const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

//ADD "AND restauranId" condition (later)

//REVENUE PER DAY FOR CALENDAR
router.get('/revenueByDay', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT
      SUM(orders.total )
      FROM orders
      WHERE orders."timeOfPurchase" ::date = $1;`
      const date = req.query.date
      const values = [date]
      const revenueByDay = await client.query(text, values)
      res.json(revenueByDay.rows[0].sum) //RETURNS JUST THE #
    }
  } catch (error) {
    next(error)
  }
})
//--list of waiters on specific day:
router.get('/waitersOnADay', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT 
      DISTINCT waiters."name"
      FROM waiters
      JOIN orders on orders."waiterId" = waiters.id
      WHERE orders."timeOfPurchase" ::date = $1;`
      const date = req.query.date
      const values = [date]
      const waitersOnADay = await client.query(text, values)
      res.json(waitersOnADay.rows) //RETURNS AN ARRAY OF OBJS WITH NAMES
    }
  } catch (error) {
    next(error)
  }
})
//--most popular dish on a specific day: **still need by the date...
router.get('/mostPopularDishOnADay', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT menus."menuName" as name,
      SUM("menuOrders" .quantity) as total
      FROM "menuOrders"
      JOIN menus on menus.id = "menuOrders"."menuId"
      JOIN orders on orders.id = "menuOrders"."orderId" 
      WHERE orders."timeOfPurchase" ::date = $1
      AND
      menus."beverageType" isnull
      GROUP BY name
      ORDER BY total desc
      limit 1;
      `
      const date = req.query.date
      const values = [date]
      const mostPopularDishOnADay = await client.query(text, values)
      res.json(mostPopularDishOnADay.rows[0].name)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/restaurantInfo', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT "restaurantName", "location"
      FROM restaurants
      WHERE restaurants.id = $1;`
      const restaurantId = req.user.restaurantId
      const values = [restaurantId]
      const restaurantInfo = await client.query(text, values)
      res.json(restaurantInfo.rows)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfWaiters', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT
      COUNT(*)
      FROM waiters; `
      const waiterCount = await client.query(text)
      const numOfWaiters = Number(waiterCount.rows[0].count)
      res.json(numOfWaiters)
    }
  } catch (error) {
    next(error)
  }
})
router.get('/numberOfGuestsVsHour', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT
    EXTRACT(hour from orders."timeOfPurchase") AS hours,
    SUM(orders."numberOfGuests"),
    ROUND( 100.0 * (
      SUM(orders."numberOfGuests")::DECIMAL / (
        SELECT SUM(orders."numberOfGuests")
        FROM orders
        WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      )), 1) AS percentage
  FROM ORDERS
  WHERE orders."timeOfPurchase" >= NOW() - $1::interval
  GROUP BY hours
  ORDER BY hours;`
      const interval = 1 + ' ' + req.query.interval
      const values = [interval]
      const numberOfGuestsVsHour = await client.query(text, values)
      const percentageArr = numberOfGuestsVsHour.rows.map(el =>
        Number(el.percentage)
      )
      res.json(percentageArr)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/revenueVsTime', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      select to_char("timeOfPurchase",'Mon') AS mon,
      date_trunc('month', orders."timeOfPurchase" ) as m,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
      SUM("total") AS "monthlyRevenue"
      from orders
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      group by mon, m, yyyy
      order by m;
      `
      const year = req.query.year
      const interval = year + ' year'
      const values = [interval]
      const revenueVsTime = await client.query(text, values)
      const allDateRevenue = {month: [], revenue: []}
      revenueVsTime.rows.forEach(row => {
        allDateRevenue.month.push(`${row.mon} ${String(row.yyyy)}`)
        allDateRevenue.revenue.push(Number(row.monthlyRevenue) / 100)
      })
      res.json(allDateRevenue)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/DOWAnalysisTable', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT EXTRACT(DOW FROM orders."timeOfPurchase") AS "dayOfWeek", SUM(orders."numberOfGuests") AS "numberOfGuests", ROUND((SUM(orders.total)::numeric)/100000,2) AS "dayRevenue", SUM("summedMenuOrder"."summedQuantity")
      FROM orders
      JOIN (SELECT SUM("menuOrders".quantity) AS "summedQuantity", "menuOrders"."orderId" FROM "menuOrders" GROUP BY "menuOrders"."orderId") AS "summedMenuOrder"
      ON orders.id = "summedMenuOrder"."orderId"
      WHERE orders."timeOfPurchase" >= NOW() - interval '1 year'
      GROUP BY "dayOfWeek"
      ORDER by "dayOfWeek" ASC;
        `
      const DOWAnalysisTable = await client.query(text)
      res.json(tableFormatting(DOWAnalysisTable.rows))
    }
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
