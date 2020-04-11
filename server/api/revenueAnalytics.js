const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

router.get('/monthlyRevenueVsLunchVsDinner', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT  to_char("timeOfPurchase",'Mon') AS mon,
      DATE_TRUNC('month', orders."timeOfPurchase" ) as date,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
      CASE WHEN (EXTRACT(HOUR FROM "timeOfPurchase") < '16') then 'lunch'
         ELSE 'dinner'
       END as "mealType",
      SUM("revenue") AS "monthlyRevenue"
      FROM orders
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      AND orders."timeOfPurchase" <= NOW()
      AND orders."restaurantId" = $2
      GROUP BY mon, date, yyyy, "mealType"
      ORDER BY date;`
      const year = req.query.year
      const interval = `${year} year`
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
      let text
      let values
      if (req.query.timeInterval) {
        text = `SELECT EXTRACT(DOW FROM "timeOfPurchase") AS day,
      ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) revenue_per_guest
      FROM orders
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      AND orders."timeOfPurchase" <= NOW()
      AND orders."restaurantId" = $2
      GROUP BY day
      ORDER BY day ASC;`
        const timeInterval = req.query.timeInterval + ' days'
        values = [timeInterval, req.user.restaurantId]
      } else {
        text = `SELECT EXTRACT(DOW FROM "timeOfPurchase") AS day,
        ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) revenue_per_guest
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY day
        ORDER BY day ASC;`
        values = [req.query.startDate, req.query.endDate, req.user.restaurantId]
      }
      const avgRevPerGuest = await client.query(text, values)
      const yAxis = avgRevPerGuest.rows.map(el => Number(el.revenue_per_guest))
      res.json({yAxis})
    }
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfOrdersVsHour', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text
      let values
      if (req.query.timeInterval) {
        text = `SELECT EXTRACT(hour FROM "timeOfPurchase") AS hour,
      COUNT(*) AS "numberOfOrders"
      FROM orders
      WHERE "timeOfPurchase" >= NOW() - $1::interval
      AND orders."timeOfPurchase" <= NOW()
      AND orders."restaurantId" = $2
      GROUP BY hour
      ORDER BY hour
      ASC;`
        const timeInterval = req.query.timeInterval + ' days'
        values = [timeInterval, req.user.restaurantId]
      } else {
        text = `SELECT EXTRACT(hour FROM "timeOfPurchase") AS hour,
        COUNT(*) AS "numberOfOrders"
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY hour
        ORDER BY hour
        ASC;`
        values = [req.query.startDate, req.query.endDate, req.user.restaurantId]
      }
      const numberOfOrdersPerHour = await client.query(text, values)
      const yAxis = numberOfOrdersPerHour.rows.map(el =>
        Number(el.numberOfOrders)
      )
      res.json({yAxis})
    }
  } catch (error) {
    next(error)
  }
})
