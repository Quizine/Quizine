const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const waiterCount = await client.query(`
      SELECT
      COUNT(*)
      FROM waiters `)
    const numOfWaiters = Number(waiterCount.rows[0].count)
    // probably issues
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
      allDateRevenue.revenue.push(Number(row.monthlyRevenue) / 100)
    })
    res.json(allDateRevenue)
  } catch (error) {
    next(error)
  }
})
