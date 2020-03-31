const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

router.get('/monthlyRevenueVsLunchVsDinner', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT to_char("timeOfPurchase",'Mon') AS mon,
      "menuItems"."mealType",
        DATE_TRUNC('month', orders."timeOfPurchase" ) as m,
        EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
        SUM("revenue")/7 AS "monthlyRevenue"
        FROM orders
        join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
        join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
        WHERE orders."timeOfPurchase" >= NOW() - $1::interval
        and orders."timeOfPurchase" <= NOW()
        AND orders."restaurantId" = $2
        and "menuItems"."mealType" is not null
        GROUP BY mon, m, yyyy, "menuItems"."mealType"
        ORDER BY m;`

      const year = req.query.year
      // const interval = `${year} year`
      const interval = `${year} year + ${new Date().getDate() - 1} days`
      const values = [interval, req.user.restaurantId]
      const monthlyRevenueVsLunchVsDinner = await client.query(text, values)
      const allDateRevenue = {
        lunchMonth: [],
        lunchRevenue: [],
        dinnerMonth: [],
        dinnerRevenue: []
      }
      monthlyRevenueVsLunchVsDinner.rows.forEach((row, idx) => {
        if (idx % 2 === 0) {
          allDateRevenue.lunchMonth.push(`${row.mon} ${String(row.yyyy)}`)
          allDateRevenue.lunchRevenue.push(Number(row.monthlyRevenue))
        } else {
          allDateRevenue.dinnerMonth.push(`${row.mon} ${String(row.yyyy)}`)
          allDateRevenue.dinnerRevenue.push(Number(row.monthlyRevenue))
        }
      })
      res.json(allDateRevenue)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/avgRevenuePerGuestVsDOW', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT EXTRACT(DOW FROM "timeOfPurchase") AS day,
      ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) revenue_per_guest
      FROM orders
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      AND orders."restaurantId" = $2
      GROUP BY day
      ORDER BY day ASC;`
      const timeInterval = '1 ' + req.query.timeInterval
      const values = [timeInterval, req.user.restaurantId]
      const avgRevPerGuest = await client.query(text, values)
      const avgRevPerGuestArr = avgRevPerGuest.rows.map(el =>
        Number(el.revenue_per_guest)
      )
      res.json(avgRevPerGuestArr)
    }
  } catch (error) {
    next(error)
  }
})
