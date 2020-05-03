const router = require('express').Router()
const pg = require('pg')
const config =
  process.env.DATABASE_URL ||
  'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

//REVENUE PER DAY FOR CALENDAR
router.get('/revenueByDay', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT
      SUM(orders.revenue )
      FROM orders
      WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
      AND orders."restaurantId" = $3;`
      const correctStartDate = new Date(req.query.date)
      const correctEndDate = new Date(
        Math.min(new Date(), new Date(req.query.date + ' 23:59'))
      )
      const values = [correctStartDate, correctEndDate, req.user.restaurantId]
      const revenueByDay = await client.query(text, values)
      revenueByDay.rows[0] ? res.json(revenueByDay.rows[0].sum) : res.json(0)
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
      WHERE orders."timeOfPurchase" ::date = $1
      AND orders."restaurantId" = $2;`
      const date = req.query.date
      const values = [date, req.user.restaurantId]
      const waitersOnADay = await client.query(text, values)
      res.json(waitersOnADay.rows)
    }
  } catch (error) {
    next(error)
  }
})
//--most popular dish on a specific day
router.get('/mostPopularDishOnADay', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT "menuItems"."menuItemName" as name,
      SUM("menuItemOrders".quantity) as total
      FROM "menuItemOrders"
      JOIN "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
      JOIN orders on orders.id = "menuItemOrders"."orderId"
      WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
      AND "menuItems"."beverageType" isnull
      AND orders."restaurantId" = $3
      GROUP BY name
      ORDER BY total desc
      limit 1;
      `

      const correctStartDate = new Date(req.query.date)
      const correctEndDate = new Date(
        Math.min(new Date(), new Date(req.query.date + ' 23:59'))
      )
      const values = [correctStartDate, correctEndDate, req.user.restaurantId]
      const mostPopularDishOnADay = await client.query(text, values)
      mostPopularDishOnADay.rows[0]
        ? res.json(mostPopularDishOnADay.rows[0].name)
        : res.json('No Dishes Served Yet')
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
      FROM waiters
      WHERE waiters."restaurantId" = $1;`
      const values = [req.user.restaurantId]
      const waiterCount = await client.query(text, values)
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
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
      )), 1) AS percentage
      FROM ORDERS
      WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
      AND orders."restaurantId" = $3
      GROUP BY hours
      ORDER BY hours;`
      let correctStartDate = new Date()
      correctStartDate.setDate(
        correctStartDate.getDate() - +req.query.timeInterval
      )
      correctStartDate = new Date(correctStartDate.toString().slice(0, 15))
      let correctEndDate = new Date()
      correctEndDate.setMinutes(0)
      const values = [correctStartDate, correctEndDate, req.user.restaurantId]
      const numberOfGuestsVsHour = await client.query(text, values)
      const formattedData = numberOfGuestsVsHourFormatting(
        numberOfGuestsVsHour.rows
      )
      res.json(formattedData)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/revenueVsTime', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT to_char("timeOfPurchase",'Mon') AS mon,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
        DATE_TRUNC('month', orders."timeOfPurchase" ) as m,
        SUM("revenue") AS "monthlyRevenue"
        FROM orders
        WHERE orders."timeOfPurchase" <= NOW()
        AND orders."restaurantId" = $1
        GROUP BY mon, m, yyyy
        ORDER BY m;`

      const values = [req.user.restaurantId]
      const revenueVsTime = await client.query(text, values)
      const formattedData = revenueVsTimeFormatting(revenueVsTime.rows)
      res.json(formattedData)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/DOWAnalysisTable', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `SELECT EXTRACT(DOW FROM orders."timeOfPurchase") AS "dayOfWeek",
      SUM(orders."numberOfGuests") AS "numberOfGuests",
      ROUND((SUM(orders.revenue)::numeric),2) AS "dayRevenue",
      SUM("summedMenuItemOrder"."summedQuantity") AS "menuItemsSold"
            FROM orders
            JOIN (SELECT SUM("menuItemOrders".quantity) AS "summedQuantity", "menuItemOrders"."orderId"
            FROM "menuItemOrders"
            GROUP BY "menuItemOrders"."orderId") AS "summedMenuItemOrder"
            ON orders.id = "summedMenuItemOrder"."orderId"
            WHERE orders."timeOfPurchase" >= $1
            AND orders."timeOfPurchase" <= $2
            AND orders."restaurantId" = $3
            GROUP BY "dayOfWeek"
            ORDER by "dayOfWeek" ASC;
        `
      let correctStartDate = new Date()
      correctStartDate.setDate(correctStartDate.getDate() - 365)
      correctStartDate = new Date(correctStartDate.toString().slice(0, 15))
      let correctEndDate = new Date()
      correctEndDate.setMinutes(0)
      const values = [correctStartDate, correctEndDate, req.user.restaurantId]
      const DOWAnalysisTable = await client.query(text, values)
      res.json(tableFormatting(DOWAnalysisTable.rows))
    }
  } catch (error) {
    next(error)
  }
})

//HELPER FUNCTIONS
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

function revenueVsTimeFormatting(arr) {
  let xAxis = []
  let year2018 = []
  let year2019 = []
  let year2020 = []

  for (let i = 0; i < arr.length; i++) {
    if (i <= 11) {
      xAxis.push(arr[i].mon)
    }
    if (arr[i].yyyy === 2018) {
      year2018.push(+arr[i].monthlyRevenue)
    }
    if (arr[i].yyyy === 2019) {
      year2019.push(+arr[i].monthlyRevenue)
    }
    if (arr[i].yyyy === 2020) {
      year2020.push(+arr[i].monthlyRevenue)
    }
  }
  while (year2020.length < 12) {
    year2020.push(0)
  }

  return {xAxis, year2018, year2019, year2020}
}

function numberOfGuestsVsHourFormatting(arr) {
  const xAxis = []
  const yAxis = []
  let hourConversion = {
    11: '11am',
    12: '12pm',
    13: '1pm',
    14: '2pm',
    15: '3pm',
    16: '4pm',
    17: '5pm',
    18: '6pm',
    19: '7pm',
    20: '8pm',
    21: '9pm',
    22: '10pm'
  }
  let hourTracking = 11
  let end = 22
  let i = 0
  while (hourTracking <= end) {
    if (hourTracking === arr[i].hours) {
      xAxis.push(hourConversion[hourTracking])
      yAxis.push(arr[i].percentage)
      i++
      hourTracking++
    } else {
      xAxis.push(hourConversion[hourTracking])
      yAxis.push(0)
      hourTracking++
    }
  }
  return {xAxis, yAxis}
}
