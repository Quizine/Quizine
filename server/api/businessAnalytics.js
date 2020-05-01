const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

//MONTHLY REVENUE FOR LUNCH AND DINNER
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

// --average number of guests served by waiter per order within a specific time frame
router.get('/avgNumberOfGuestsVsWaitersPerOrder', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT waiters."name",
      ROUND(AVG(orders."numberOfGuests" ), 2) AS performance
      FROM waiters
      JOIN orders ON orders."waiterId" = waiters.id
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      AND orders."restaurantId" = $2
      GROUP BY waiters."name"
      ORDER BY performance DESC;
      `
      const timeInterval = '1 ' + req.query.timeInterval
      const values = [timeInterval, req.user.restaurantId]
      const avgNumberOfGuestsVsWaitersPerOrder = await client.query(
        text,
        values
      )
      const [xAxis, yAxis] = axisMapping(
        avgNumberOfGuestsVsWaitersPerOrder.rows,
        avgNumberOfGuestsVsWaitersPerOrder.fields[0].name,
        avgNumberOfGuestsVsWaitersPerOrder.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfOrdersVsHour', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT EXTRACT(hour FROM "timeOfPurchase") AS hour,
      COUNT(*) AS "numberOfOrders"
      FROM orders
      WHERE "timeOfPurchase" >= NOW() - $1::interval
      AND orders."restaurantId" = $2
      GROUP BY hour
      ORDER BY hour
      ASC;`
      const timeInterval = '1 ' + req.query.timeInterval
      const values = [timeInterval, req.user.restaurantId]
      const numberOfOrdersPerHour = await client.query(text, values)
      const numberOfOrdersArr = numberOfOrdersPerHour.rows.map(el =>
        Number(el.numberOfOrders)
      )
      res.json(numberOfOrdersArr)
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
      const queriedData = await client.query(text, values)
      const queriedDataArr = queriedData.rows.map(el =>
        Number(el.revenue_per_guest)
      )
      res.json(queriedDataArr)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/tipPercentageVsWaiters', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
      FROM ORDERS
      JOIN WAITERS ON orders."waiterId" = waiters.id
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval
      AND waiters."restaurantId" = $2
      GROUP BY waiters.name
      ORDER BY "averageTipPercentage" DESC;`
      const timeInterval = '1 ' + req.query.timeInterval
      const values = [timeInterval, req.user.restaurantId]
      const tipPercentageByWaiters = await client.query(text, values)
      const [xAxis, yAxis] = axisMapping(
        tipPercentageByWaiters.rows,
        tipPercentageByWaiters.fields[0].name,
        tipPercentageByWaiters.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
  } catch (error) {
    next(error)
  }
})

//TOP 5 MENU ITEMS FOR PIE GRAPH
router.get(
  '/menuSalesNumbersVsMenuItemsTopOrBottom5',
  async (req, res, next) => {
    try {
      if (req.user.id) {
        let text
        const topOrBottom = req.query.topOrBottom
        if (topOrBottom === 'asc') {
          text = `

          SELECT "menuItems"."menuItemName" as name,
          SUM("menuItemOrders" .quantity) as total
          FROM "menuItemOrders"
          JOIN "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
          JOIN orders on orders.id = "menuItemOrders"."orderId"
          WHERE orders."timeOfPurchase" >= NOW() - $1::interval
          AND orders."restaurantId" = $2
          GROUP BY name
          ORDER BY total ASC
          LIMIT 5;
          `
        } else if (topOrBottom === 'desc') {
          text = `
          SELECT "menuItems"."menuItemName" as name,
          SUM("menuItemOrders".quantity) as total
          FROM "menuItemOrders"
          JOIN "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
          JOIN orders on orders.id = "menuItemOrders"."orderId"
          WHERE orders."timeOfPurchase" >= NOW() - $1::interval
          AND orders."restaurantId" = $2
          GROUP BY name
          ORDER BY total DESC
          LIMIT 5;
          `
        }
        const timeInterval = '1 ' + req.query.timeInterval
        const restaurantId = req.user.restaurantId
        const values = [timeInterval, restaurantId]
        //TEXT WILL BE UNDEFINED SHOULD TOP OR BOTTOM BE ANYTHING OTHER THAN ASC OR DESC
        //SO ESSENTIALLY SANITIZING THE DATA

        const menuSalesNumbers = await client.query(text, values)
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
  }
)

function axisMapping(arr, xAxisName, yAxisName) {
  const xAxis = []
  const yAxis = []
  arr.forEach(el => {
    xAxis.push(el[xAxisName])
    yAxis.push(+el[yAxisName])
  })

  return [xAxis, yAxis]
}
