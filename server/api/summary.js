const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const responseObject = {} //<------- MAKE SURE MATCHES RESTAURANT ID
    const interval = req.query.interval
    const revenue = await client.query(`
      SELECT
      SUM (total)
      FROM orders
      WHERE "timeOfPurchase" > now() - interval '1 year'`) //make time dynamic  <------
    responseObject.revenue = parseInt(revenue.rows[0].sum)

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
    res.json(responseObject)
  } catch (error) {
    next(error)
  }
})

router.get('/numberOfGuestsByHour', async (req, res, next) => {
  try {
    const interval = req.query.interval
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
    res.json(percentageArr)
  } catch (error) {
    next(error)
  }
})

router.get('/revenueVsTime', async (req, res, next) => {
  try {
    const year = req.query.year
    const revenueVsTime = await client.query(`
    select
	to_char("timeOfPurchase",'Mon') AS mon,
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
      allDateRevenue.revenue.push(financial(Number(row.monthlyRevenue) / 100))
    })
    console.log(allDateRevenue)
    res.json(allDateRevenue)
  } catch (error) {
    next(error)
  }
})
