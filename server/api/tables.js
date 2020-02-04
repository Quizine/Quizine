const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/summary', async (req, res, next) => {
  try {
    const responseObject = {} //<------- MAKE SURE MATCHES RESTAURANT ID
    console.log('BECKENDIIIIII', req.query)
    const interval = req.query.interval
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

    // const numberOfGuestsByHour = await client.query(`
    // SELECT
    // EXTRACT(hour from orders."timeOfPurchase") AS hours,
    // ROUND( AVG (orders."numberOfGuests")) AS numberOfGuests
    // FROM ORDERS
    // WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}'
    // GROUP BY hours ORDER BY hours;
    // `)
    // responseObject.numberOfGuestsByHour = numberOfGuestsByHour.rows


    const numberOfGuestsByHour = await client.query(
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
    const percentageArr = numberOfGuestsByHour.rows.map(el =>
      Number(el.percentage)
    )
    responseObject.numberOfGuestsByHour = percentageArr
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

router.get('/stockQueries', async (req, res, next) => {
  try {
    const responseObject = {}
    const mealType = 'dinner'
    const interval = 'year'

    const waitersByTipPercent = await client.query(`SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage" FROM ORDERS
    JOIN WAITERS ON orders."waiterId" = waiters.id WHERE orders."timeOfPurchase" >= NOW() - interval '1 ${interval}' GROUP BY waiters.name ORDER BY "averageTipPercentage" DESC;`)
    const waitersByTipPercentFormatted = axisMapping(
      waitersByTipPercent.rows,
      waitersByTipPercent.fields[0].name,
      waitersByTipPercent.fields[1].name
    )
    responseObject.waitersByTipPercentXAxis = waitersByTipPercentFormatted[0]
    responseObject.waitersByTipPercentYAxis = waitersByTipPercentFormatted[1]

    const waitersByAvgServedDish = await client.query(`SELECT waiters.name, ROUND(SUM ("menuOrders".quantity) / 7) FROM "menuOrders"
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
    EXTRACT(DOW FROM orders."timeOfPurchase") AS "dayOfWeek", SUM (orders."numberOfGuests") AS "totalNumberOfGuests" FROM orders
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
