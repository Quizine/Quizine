const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

router.get('/lunchAndDinnerRevenueComparison', async (req, res, next) => {
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
      ${
        req.query.timeInterval !== 'allPeriod'
          ? 'WHERE orders."timeOfPurchase" >= NOW() - ' +
            `'${req.query.timeInterval} year'` +
            '::interval AND orders."timeOfPurchase" <= NOW()'
          : 'WHERE orders."timeOfPurchase" <= NOW()'
      }

      AND orders."restaurantId" = $1
      GROUP BY mon, date, yyyy, "mealType"
      ORDER BY date;`

      const values = [req.user.restaurantId]
      const lunchAndDinnerRevenueComparison = await client.query(text, values)
      const allDateRevenue = {
        month: [],
        lunchRevenue: [],
        dinnerRevenue: []
      }
      lunchAndDinnerRevenueComparison.rows.forEach((row, idx) => {
        if (row.mealType === 'lunch') {
          allDateRevenue.month.push(`${row.mon} ${String(row.yyyy)}`)
          allDateRevenue.lunchRevenue.push(Number(row.monthlyRevenue))
        } else {
          allDateRevenue.dinnerRevenue.push(Number(row.monthlyRevenue))
        }
      })
      res.json(allDateRevenue)
    }
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line complexity
router.get('/avgRevenuePerGuest', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text, values, correctStartDate, correctEndDate

      if (req.query.timeInterval) {
        if (req.query.timeInterval !== 'allPeriod') {
          correctStartDate = new Date()
          correctStartDate.setDate(
            correctStartDate.getDate() - +req.query.timeInterval
          )
          correctStartDate = new Date(correctStartDate.toString().slice(0, 15))
        } else {
          const startDateText =
            'SELECT "timeOfPurchase" as date FROM orders WHERE orders."restaurantId" = $1 ORDER BY date ASC LIMIT 1;'
          const startDateValues = [req.user.restaurantId]
          const startDateData = await client.query(
            startDateText,
            startDateValues
          )
          correctStartDate = startDateData.rows[0].date
        }
        correctEndDate = new Date()
        correctEndDate.setMinutes(0)
        text = `SELECT ${
          req.query.xAxisOption === 'DOW'
            ? `EXTRACT('${
                req.query.xAxisOption
              }' FROM "timeOfPurchase") AS day,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
        ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) "yAxisData"
        FROM orders
        ${
          req.query.timeInterval !== 'allPeriod'
            ? `WHERE orders."timeOfPurchase" >= '${correctStartDate.toUTCString()}' AND orders."timeOfPurchase" <= NOW()`
            : 'WHERE orders."timeOfPurchase" <= NOW()'
        }

        AND orders."restaurantId" = $1
        GROUP BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'}
        ORDER BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'} ASC;`
        values = [req.user.restaurantId]
      } else {
        text = `SELECT ${
          req.query.xAxisOption === 'DOW'
            ? `EXTRACT('${
                req.query.xAxisOption
              }' FROM "timeOfPurchase") AS day,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
        ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) "yAxisData"
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'}
        ORDER BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'} ASC;`
        correctStartDate = new Date(req.query.startDate)
        correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        correctEndDate.setMinutes(0)
        values = [correctStartDate, correctEndDate, req.user.restaurantId]
      }
      const avgRevPerGuest = await client.query(text, values)
      const formattedData =
        req.query.xAxisOption === 'DOW'
          ? formattingDaysOfWeek(avgRevPerGuest.rows)
          : formattingData(
              avgRevPerGuest.rows,
              correctStartDate,
              correctEndDate,
              req.query.xAxisOption
            )
      const startDate = correctStartDate.toString().slice(0, 15)
      const endDate = correctEndDate.toString()
      res.json({...formattedData, startDate, endDate})
    }
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line complexity
router.get('/numberOfOrders', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text, values, correctStartDate, correctEndDate
      if (req.query.timeInterval) {
        if (req.query.timeInterval !== 'allPeriod') {
          correctStartDate = new Date()
          correctStartDate.setDate(
            correctStartDate.getDate() - +req.query.timeInterval
          )
          correctStartDate = new Date(correctStartDate.toString().slice(0, 15))
        } else {
          const startDateText =
            'SELECT "timeOfPurchase" as date FROM orders WHERE orders."restaurantId" = $1 ORDER BY date ASC LIMIT 1;'
          const startDateValues = [req.user.restaurantId]
          const startDateData = await client.query(
            startDateText,
            startDateValues
          )
          correctStartDate = startDateData.rows[0].date
        }
        correctEndDate = new Date()
        correctEndDate.setMinutes(0)
        text = `SELECT ${
          req.query.xAxisOption === 'avgHour'
            ? `EXTRACT('hour' FROM "timeOfPurchase") AS hour,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
      COUNT(*) AS "yAxisData"
      FROM orders
      ${
        req.query.timeInterval !== 'allPeriod'
          ? `WHERE orders."timeOfPurchase" >= '${correctStartDate.toUTCString()}' AND orders."timeOfPurchase" <= NOW()`
          : 'WHERE orders."timeOfPurchase" <= NOW()'
      }
      AND orders."restaurantId" = $1
      GROUP BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'}
      ORDER BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'} ASC;`

        values = [req.user.restaurantId]
      } else {
        text = `SELECT ${
          req.query.xAxisOption === 'avgHour'
            ? `EXTRACT('hour' FROM "timeOfPurchase") AS hour,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
        COUNT(*) AS "yAxisData"
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'}
        ORDER BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'} ASC;`
        correctStartDate = new Date(req.query.startDate)
        correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        correctEndDate.setMinutes(0)
        values = [correctStartDate, correctEndDate, req.user.restaurantId]
      }
      const numberOfOrders = await client.query(text, values)
      const formattedData =
        req.query.xAxisOption === 'avgHour'
          ? formattingNumberOfOrdersPerHour(numberOfOrders.rows)
          : formattingData(
              numberOfOrders.rows,
              correctStartDate,
              correctEndDate,
              req.query.xAxisOption
            )
      const startDate = correctStartDate.toString().slice(0, 15)
      res.json({...formattedData, startDate})
    }
  } catch (error) {
    next(error)
  }
})

function formattingNumberOfOrdersPerHour(arr) {
  let currHour = 11
  let i = 0
  let xAxis = []
  let yAxis = []
  while (currHour <= 22) {
    if (arr[i] && currHour === +arr[i].hour) {
      if (currHour < 12) {
        xAxis.push(currHour + 'am')
      } else if (currHour === 12) {
        xAxis.push(currHour + 'pm')
      } else {
        xAxis.push(currHour - 12 + 'pm')
      }
      yAxis.push(+arr[i].yAxisData)
      currHour++
      i++
    } else {
      if (currHour < 12) {
        xAxis.push(currHour + 'am')
      } else if (currHour === 12) {
        xAxis.push(currHour + 'pm')
      } else {
        xAxis.push(currHour - 12 + 'pm')
      }
      yAxis.push(0)
      currHour++
    }
  }
  return {xAxis, yAxis}
}

function formattingDaysOfWeek(arr) {
  let store = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thurs',
    5: 'Fri',
    6: 'Sat'
  }
  let xAxis = []
  let yAxis = []
  let i = 0
  let currDay = 0
  while (currDay <= 6) {
    if (arr[i] && currDay === +arr[i].day) {
      xAxis.push(store[currDay])
      yAxis.push(+arr[i].yAxisData)
      currDay++
      i++
    } else {
      xAxis.push(store[currDay])
      yAxis.push(0)
      currDay++
    }
  }
  return {xAxis, yAxis}
}

// eslint-disable-next-line complexity
function formattingData(arr, startDate, endDate, xAxisOption) {
  let xAxis = []
  let yAxis = []
  let xAxisOptionHashTable = {
    year: [11, 16],
    month: [4, 7, 10, 16],
    week: [0, 16],
    day: [0, 16]
  }
  if (xAxisOption !== 'hour') {
    for (let i = 0; i < arr.length; i++) {
      let formattedElement
      if (xAxisOption === 'month') {
        formattedElement =
          arr[i].date
            .toString()
            .slice(
              xAxisOptionHashTable[xAxisOption][0],
              xAxisOptionHashTable[xAxisOption][1]
            ) +
          arr[i].date
            .toString()
            .slice(
              xAxisOptionHashTable[xAxisOption][2],
              xAxisOptionHashTable[xAxisOption][3]
            )
      } else if (xAxisOption === 'week') {
        if (i === 0) {
          formattedElement = startDate
            .toString()
            .slice(
              xAxisOptionHashTable[xAxisOption][0],
              xAxisOptionHashTable[xAxisOption][1]
            )
        } else {
          formattedElement = arr[i].date
            .toString()
            .slice(
              xAxisOptionHashTable[xAxisOption][0],
              xAxisOptionHashTable[xAxisOption][1]
            )
        }
      } else {
        formattedElement = arr[i].date
          .toString()
          .slice(
            xAxisOptionHashTable[xAxisOption][0],
            xAxisOptionHashTable[xAxisOption][1]
          )
      }
      xAxis.push(formattedElement)
      yAxis.push(arr[i].yAxisData)
    }
  } else {
    let i = 0
    while (startDate <= endDate) {
      if (
        +startDate.toString().slice(16, 18) < 11 ||
        +startDate.toString().slice(16, 18) > 22
      ) {
        startDate.setHours(startDate.getHours() + 1)
      } else if (
        arr[i] &&
        startDate.toString().slice(0, 21) ===
          arr[i].date.toString().slice(0, 21)
      ) {
        xAxis.push(arr[i].date.toString().slice(0, 21))
        yAxis.push(+arr[i].yAxisData)
        startDate.setHours(startDate.getHours() + 1)
        i++
      } else {
        xAxis.push(startDate.toString().slice(0, 21))
        yAxis.push(0)
        startDate.setHours(startDate.getHours() + 1)
      }
    }
  }
  return {xAxis, yAxis}
}
