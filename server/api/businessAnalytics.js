const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/numberOfOrdersPerHour', async (req, res, next) => {
  try {
    const interval = req.query.interval
    if (req.user.id) {
      // ADD TO EVERY QUERY AND ADD WHERE restaurantId.....  <-------------------------------
      const numberOfOrdersPerHour = await client.query(
        `SELECT EXTRACT(hour FROM "timeOfPurchase") AS hour,
        COUNT(*) AS "numberOfOrders"
        FROM orders
        WHERE "timeOfPurchase" >= NOW() - interval '1 ${interval}'
        WHERE "restaurantId" = ${req.user.restaurantId}
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
        WHERE "restaurantId" = ${req.user.restaurantId}
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

router.get('/graphs/tipPercentageByWaiters', async (req, res, next) => {
  try {
    const timeInterval = req.query.timeInterval
    if (req.user.id) {
      const tipPercentageByWaiters = await client.query(
        `SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
      FROM ORDERS
      JOIN WAITERS ON orders."waiterId" = waiters.id
      WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'
      WHERE "restaurantId" = ${req.user.restaurantId}
      GROUP BY waiters.name
      ORDER BY "averageTipPercentage" DESC;`
      )
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
      WHERE "restaurantId" = ${req.user.restaurantId}
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

router.get('/stockQueries', async (req, res, next) => {
  try {
    const responseObject = {}
    const mealType = 'dinner'
    const interval = 'year'

    const waitersByTipPercent = await client.query(`
    SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
    FROM ORDERS
    JOIN WAITERS ON orders."waiterId" = waiters.id
    WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY waiters.name
    ORDER BY "averageTipPercentage" DESC;`)
    const waitersByTipPercentFormatted = axisMapping(
      waitersByTipPercent.rows,
      waitersByTipPercent.fields[0].name,
      waitersByTipPercent.fields[1].name
    )
    responseObject.waitersByTipPercentXAxis = waitersByTipPercentFormatted[0]
    responseObject.waitersByTipPercentYAxis = waitersByTipPercentFormatted[1]

    const waitersByAvgServedDish = await client.query(`
    SELECT waiters.name, ROUND(SUM ("menuOrders".quantity) / 7)
    FROM "menuOrders"
    JOIN ORDERS ON orders.id = "menuOrders"."orderId"
    JOIN WAITERS ON orders."waiterId" = waiters.id
    WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY waiters.name;`)
    const waitersByAvgServedDishFormatted = axisMapping(
      waitersByAvgServedDish.rows,
      waitersByAvgServedDish.fields[0].name,
      waitersByAvgServedDish.fields[1].name
    )
    responseObject.waitersByAvgServedDishXAxis =
      waitersByAvgServedDishFormatted[0]
    responseObject.waitersByAvgServedDishYAxis =
      waitersByAvgServedDishFormatted[1]

    // WOULD BE NICE TO CONVERT TO %
    const menuItemsByOrder = await client.query(`SELECT menus."menuName" AS "menuItem",
    SUM("menuOrders".quantity) AS "quantity" FROM menus
    JOIN "menuOrders" ON menus.id = "menuOrders"."menuId"
    JOIN orders ON orders.id = "menuOrders"."orderId"
    WHERE menus."mealType" = '${mealType}'
    AND orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY "menuItem";`)
    const menuItemsByOrderFormatted = axisMapping(
      menuItemsByOrder.rows,
      menuItemsByOrder.fields[0].name,
      menuItemsByOrder.fields[1].name
    )
    responseObject.menuItemsByOrderXAxis = menuItemsByOrderFormatted[0]
    responseObject.menuItemsByOrderYAxis = menuItemsByOrderFormatted[1]

    const guestPerDay = await client.query(`SELECT
    EXTRACT(DOW FROM orders."timeOfPurchase") AS "dayOfWeek", SUM (orders."numberOfGuests") AS "totalNumberOfGuests"
    FROM orders
    WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    GROUP BY "dayOfWeek" ORDER BY "dayOfWeek" ASC;`)
    const guestPerDayFormatted = axisMapping(
      guestPerDay.rows,
      guestPerDay.fields[0].name,
      guestPerDay.fields[1].name
    )
    responseObject.guestPerDayXAxis = guestPerDayFormatted[0]
    responseObject.guestPerDayYAxis = guestPerDayFormatted[1]

    res.json(responseObject)
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

function financial(x) {
  return Number(Number.parseFloat(x).toFixed(2))
}
