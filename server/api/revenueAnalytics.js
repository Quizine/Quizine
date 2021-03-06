/* eslint-disable max-statements */
const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

router.get('/lunchAndDinnerRevenueComparison', async (req, res, next) => {
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
        text = `SELECT DATE_TRUNC('${
          req.query.xAxisOption
        }', orders."timeOfPurchase" ) as date,
        CASE WHEN (EXTRACT(HOUR FROM "timeOfPurchase") < '16') then 'lunch'
          ELSE 'dinner'
        END as "mealType",
        SUM("revenue") AS revenue
        FROM orders
        ${
          req.query.timeInterval !== 'allPeriod'
            ? `WHERE orders."timeOfPurchase" >= '${correctStartDate.toUTCString()}' AND orders."timeOfPurchase" <= NOW()`
            : 'WHERE orders."timeOfPurchase" <= NOW()'
        }
        AND orders."restaurantId" = $1
        GROUP BY date, "mealType"
        ORDER BY date;`
        values = [req.user.restaurantId]
      } else {
        text = `SELECT DATE_TRUNC('${
          req.query.xAxisOption
        }', orders."timeOfPurchase" ) as date,
        CASE WHEN (EXTRACT(HOUR FROM "timeOfPurchase") < '16') then 'lunch'
          ELSE 'dinner'
        END as "mealType",
        SUM("revenue") AS revenue
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY date, "mealType"
        ORDER BY date;`
        correctStartDate = new Date(req.query.startDate)
        correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [correctStartDate, correctEndDate, req.user.restaurantId]
      }
      const lunchAndDinnerRevenueComparison = await client.query(text, values)
      const startDate = correctStartDate.toString().slice(0, 15)
      const endDate = correctEndDate.toString()
      const formattedLineGraphData = formattingLunchAndDinnerData(
        lunchAndDinnerRevenueComparison.rows,
        correctStartDate,
        correctEndDate,
        req.query.xAxisOption
      )
      res.json({...formattedLineGraphData, startDate, endDate})
    }
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line complexity
router.get('/detailedRevenueAnalysis', async (req, res, next) => {
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
        text = `SELECT ${
          req.query.xAxisOption === 'DOW'
            ? `EXTRACT('${
                req.query.xAxisOption
              }' FROM "timeOfPurchase") AS day,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
        ${
          req.query.aggOption === 'avgRevenuePerGuest'
            ? 'ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) "yAxisData"'
            : `ROUND(${req.query.aggOption}(revenue), 2) as "yAxisData"`
        }
        FROM orders
        ${
          req.query.timeInterval !== 'allPeriod'
            ? `WHERE orders."timeOfPurchase" >= '${correctStartDate
                .toUTCString()
                .slice(0, 16)}' AND orders."timeOfPurchase" <= NOW()`
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
        ${
          req.query.aggOption === 'avgRevenuePerGuest'
            ? 'ROUND((SUM(revenue)::numeric)/SUM("numberOfGuests"), 2) "yAxisData"'
            : `ROUND(${req.query.aggOption}(revenue), 2) as "yAxisData"`
        }
        FROM orders
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'}
        ORDER BY ${req.query.xAxisOption === 'DOW' ? 'day' : 'date'} ASC;`
        correctStartDate = new Date(req.query.startDate)
        correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [correctStartDate, correctEndDate, req.user.restaurantId]
      }
      const queriedData = await client.query(text, values)
      const startDate = correctStartDate.toString().slice(0, 15)
      const endDate = correctEndDate.toString()
      const formattedData =
        req.query.xAxisOption === 'DOW'
          ? formattingDaysOfWeek(queriedData.rows)
          : formattingData(
              queriedData.rows,
              correctStartDate,
              correctEndDate,
              req.query.xAxisOption
            )
      res.json({...formattedData, startDate, endDate})
    }
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line complexity
router.get('/detailedOrderAnalysis', async (req, res, next) => {
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
        text = `SELECT ${
          req.query.xAxisOption === 'avgHour'
            ? `EXTRACT('hour' FROM "timeOfPurchase") AS hour,`
            : `DATE_TRUNC('${
                req.query.xAxisOption
              }', orders."timeOfPurchase" ) as date,`
        }
      ${
        req.query.aggOption === 'numberOfOrders'
          ? 'COUNT(*) AS "yAxisData" FROM orders'
          : `ROUND(${
              req.query.aggOption
            }("aggQuantity".quantity),2) as "yAxisData" FROM orders INNER JOIN (SELECT SUM(quantity) as quantity, "orderId" FROM "menuItemOrders"
      GROUP BY "orderId") as "aggQuantity"
      ON orders.id = "aggQuantity"."orderId"`
      }
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
        ${
          req.query.aggOption === 'numberOfOrders'
            ? 'COUNT(*) AS "yAxisData" FROM orders'
            : `ROUND(${
                req.query.aggOption
              }("aggQuantity".quantity),2) as "yAxisData" FROM orders INNER JOIN (SELECT SUM(quantity) as quantity, "orderId" FROM "menuItemOrders"
        GROUP BY "orderId") as "aggQuantity"
        ON orders.id = "aggQuantity"."orderId"`
        }
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        AND orders."restaurantId" = $3
        GROUP BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'}
        ORDER BY ${req.query.xAxisOption === 'avgHour' ? 'hour' : 'date'} ASC;`
        correctStartDate = new Date(req.query.startDate)
        correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [correctStartDate, correctEndDate, req.user.restaurantId]
      }
      const queriedData = await client.query(text, values)
      const startDate = correctStartDate.toString().slice(0, 15)
      const endDate = correctEndDate.toString()
      const formattedData =
        req.query.xAxisOption === 'avgHour'
          ? formattingOrdersData(queriedData.rows)
          : formattingData(
              queriedData.rows,
              correctStartDate,
              correctEndDate,
              req.query.xAxisOption
            )

      res.json({...formattedData, startDate, endDate})
    }
  } catch (error) {
    next(error)
  }
})

function formattingOrdersData(arr) {
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
    year: [11, 15],
    month: [4, 7, 10, 15],
    week: [0, 15],
    day: [0, 15]
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
      yAxis.push(+arr[i].yAxisData)
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

// eslint-disable-next-line complexity
function formattingLunchAndDinnerData(arr, startDate, endDate, xAxisOption) {
  let xAxis = []
  let lunchRevenue = []
  let dinnerRevenue = []
  let xAxisOptionHashTable = {
    year: [11, 15],
    month: [4, 7, 10, 15],
    week: [0, 15],
    day: [0, 15]
  }

  if (
    xAxisOption !== 'hour' &&
    xAxisOption !== 'day' &&
    xAxisOption !== 'week'
  ) {
    for (let i = 0; i < arr.length; i++) {
      let formattedElement

      //Slicing date based on the x-axis option
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
      } else {
        //Formatting for year
        formattedElement = arr[i].date
          .toString()
          .slice(
            xAxisOptionHashTable[xAxisOption][0],
            xAxisOptionHashTable[xAxisOption][1]
          )
      }

      //Creating x-axis for front end
      if (xAxis.length === 0 || xAxis[xAxis.length - 1] !== formattedElement) {
        xAxis.push(formattedElement)
      }

      //Separating data based on meal type (lunch or dinner)
      if (arr[i].mealType === 'lunch') {
        lunchRevenue.push(+arr[i].revenue)
      } else {
        dinnerRevenue.push(+arr[i].revenue)
      }
    }
  } else if (xAxisOption === 'hour') {
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
        if (arr[i].mealType === 'lunch') {
          lunchRevenue.push(+arr[i].revenue)
          dinnerRevenue.push(0)
        } else {
          dinnerRevenue.push(+arr[i].revenue)
          lunchRevenue.push(0)
        }

        startDate.setHours(startDate.getHours() + 1)
        i++
      } else {
        xAxis.push(startDate.toString().slice(0, 21))
        lunchRevenue.push(0)
        dinnerRevenue.push(0)
        startDate.setHours(startDate.getHours() + 1)
      }
    }
  } else if (xAxisOption === 'day') {
    let i = 0
    while (startDate <= endDate) {
      if (
        arr[i] &&
        startDate.toString().slice(0, 15) ===
          arr[i].date.toString().slice(0, 15)
      ) {
        if (
          xAxis.length === 0 ||
          arr[i].date.toString().slice(0, 15) !== xAxis[xAxis.length - 1]
        ) {
          xAxis.push(arr[i].date.toString().slice(0, 15))
        }
        if (arr[i].mealType === 'lunch') {
          if (xAxis.length - 1 !== lunchRevenue.length) {
            lunchRevenue.push(0)
          }
          lunchRevenue.push(+arr[i].revenue)
        } else {
          if (xAxis.length - 1 !== dinnerRevenue.length) {
            dinnerRevenue.push(0)
          }
          dinnerRevenue.push(+arr[i].revenue)
        }

        if (
          !arr[i + 1] ||
          (arr[i + 1] &&
            xAxis[xAxis.length - 1] !== arr[i + 1].date.toString().slice(0, 15))
        ) {
          startDate.setDate(startDate.getDate() + 1)
        }
        i++
      } else {
        xAxis.push(startDate.toString().slice(0, 15))
        lunchRevenue.push(0)
        dinnerRevenue.push(0)
        startDate.setDate(startDate.getDate() + 1)
      }
    }
    if (lunchRevenue.length < dinnerRevenue.length) {
      lunchRevenue.push(0)
    }
    if (lunchRevenue.length > dinnerRevenue.length) {
      dinnerRevenue.push(0)
    }
  } else if (xAxisOption === 'week') {
    let i = 0

    //Logic for first date of week data array
    xAxis.push(startDate.toString().slice(0, 15))

    if (startDate < arr[i].date) {
      dinnerRevenue.push(0)
      lunchRevenue.push(0)
    }

    if (startDate >= arr[i].date && arr[i].mealType === 'dinner') {
      dinnerRevenue.push(+arr[i].revenue)
      i++
    } else if (startDate >= arr[i].date && arr[i].mealType !== 'dinner') {
      dinnerRevenue.push(0)
    }

    if (startDate >= arr[i].date && arr[i].mealType === 'lunch') {
      lunchRevenue.push(+arr[i].revenue)
      i++
    } else if (startDate >= arr[i].date && arr[i].mealType !== 'lunch') {
      lunchRevenue.push(0)
    }

    //Logic for remaining dates of week data array
    startDate = arr[i].date
    while (startDate <= endDate) {
      if (
        arr[i] &&
        startDate.toString().slice(0, 15) ===
          arr[i].date.toString().slice(0, 15)
      ) {
        if (
          xAxis.length === 0 ||
          arr[i].date.toString().slice(0, 15) !== xAxis[xAxis.length - 1]
        ) {
          xAxis.push(arr[i].date.toString().slice(0, 15))
        }
        if (arr[i].mealType === 'lunch') {
          if (xAxis.length - 1 !== lunchRevenue.length) {
            lunchRevenue.push(0)
          }
          lunchRevenue.push(+arr[i].revenue)
        } else {
          if (xAxis.length - 1 !== dinnerRevenue.length) {
            dinnerRevenue.push(0)
          }
          dinnerRevenue.push(+arr[i].revenue)
        }

        if (
          !arr[i + 1] ||
          (arr[i + 1] &&
            xAxis[xAxis.length - 1] !== arr[i + 1].date.toString().slice(0, 15))
        ) {
          startDate.setDate(startDate.getDate() + 7)
        }
        i++
      } else {
        xAxis.push(startDate.toString().slice(0, 15))
        lunchRevenue.push(0)
        dinnerRevenue.push(0)
        startDate.setDate(startDate.getDate() + 7)
      }
    }
    if (lunchRevenue.length < dinnerRevenue.length) {
      lunchRevenue.push(0)
    }
    if (lunchRevenue.length > dinnerRevenue.length) {
      dinnerRevenue.push(0)
    }
  }
  return {xAxis, lunchRevenue, dinnerRevenue}
}
