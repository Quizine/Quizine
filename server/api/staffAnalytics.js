const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
module.exports = router

router.get('/tipPercentageVsWaiters', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text
      let values
      if (req.query.timeInterval) {
        text = `SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
        FROM ORDERS
        JOIN WAITERS ON orders."waiterId" = waiters.id
        WHERE orders."timeOfPurchase" >= NOW() - $1::interval
        AND orders."timeOfPurchase" <= NOW()
        ${
          req.query.waiterNames && req.query.waiterNames.length
            ? 'AND (' +
              req.query.waiterNames
                .map((waiterName, idx) => {
                  if (idx === 0) {
                    return `waiters.name LIKE '${waiterName}'`
                  }
                  return `or waiters.name LIKE '${waiterName}'`
                })
                .join(' ') +
              ')'
            : ''
        }
        AND waiters."restaurantId" = $2
        GROUP BY waiters.name
        ORDER BY "averageTipPercentage" DESC;`
        const timeInterval = req.query.timeInterval + ' days'
        values = [timeInterval, req.user.restaurantId]
      } else {
        text = `SELECT waiters.name, ROUND (AVG (orders.tip) / AVG(orders.subtotal) * 100) as "averageTipPercentage"
        FROM ORDERS
        JOIN WAITERS ON orders."waiterId" = waiters.id
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        ${
          req.query.waiterNames && req.query.waiterNames.length
            ? 'AND (' +
              req.query.waiterNames
                .map((waiterName, idx) => {
                  if (idx === 0) {
                    return `waiters.name LIKE '${waiterName}'`
                  }
                  return `or waiters.name LIKE '${waiterName}'`
                })
                .join(' ') +
              ')'
            : ''
        }
        AND waiters."restaurantId" = $3
        GROUP BY waiters.name
        ORDER BY "averageTipPercentage" DESC;`
        const correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [req.query.startDate, correctEndDate, req.user.restaurantId]
      }

      const queryResults = await client.query(text, values)
      const [xAxis, yAxis] = axisMapping(
        queryResults.rows,
        queryResults.fields[0].name,
        queryResults.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
  } catch (error) {
    next(error)
  }
})

router.get('/averageExpenditurePerGuestVsWaiters', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text
      let values
      if (req.query.timeInterval) {
        text = `SELECT waiters.name, ROUND(AVG(orders.revenue / orders."numberOfGuests"),2) as "averageExpenditurePerGuest" from waiters
        INNER JOIN orders
        ON orders."waiterId" = waiters."id"
        WHERE orders."timeOfPurchase" >= NOW() - $1::interval
        AND orders."timeOfPurchase" <= NOW()
        ${
          req.query.waiterNames && req.query.waiterNames.length
            ? 'AND (' +
              req.query.waiterNames
                .map((waiterName, idx) => {
                  if (idx === 0) {
                    return `waiters.name LIKE '${waiterName}'`
                  }
                  return `or waiters.name LIKE '${waiterName}'`
                })
                .join(' ') +
              ')'
            : ''
        }
        AND waiters."restaurantId" = $2
        GROUP BY waiters.name
        ORDER BY "averageExpenditurePerGuest" DESC;`
        const timeInterval = req.query.timeInterval + ' days'
        values = [timeInterval, req.user.restaurantId]
      } else {
        text = `SELECT waiters.name, ROUND(AVG(orders.revenue / orders."numberOfGuests"),2) as "averageExpenditurePerGuest" from waiters
        INNER JOIN orders
        ON orders."waiterId" = waiters."id"
        WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
        ${
          req.query.waiterNames && req.query.waiterNames.length
            ? 'AND (' +
              req.query.waiterNames
                .map((waiterName, idx) => {
                  if (idx === 0) {
                    return `waiters.name LIKE '${waiterName}'`
                  }
                  return `or waiters.name LIKE '${waiterName}'`
                })
                .join(' ') +
              ')'
            : ''
        }
        AND waiters."restaurantId" = $3
        GROUP BY waiters.name
        ORDER BY "averageExpenditurePerGuest" DESC;`
        const correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [req.query.startDate, correctEndDate, req.user.restaurantId]
      }

      const queryResults = await client.query(text, values)
      const [xAxis, yAxis] = axisMapping(
        queryResults.rows,
        queryResults.fields[0].name,
        queryResults.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
  } catch (error) {
    next(error)
  }
})

router.get('/totalNumberOfGuestsServedVsWaiters', async (req, res, next) => {
  try {
    if (req.user.id) {
      let text
      let values
      if (req.query.timeInterval) {
        text = `SELECT waiters.name, SUM(orders."numberOfGuests") as "totalNumOfGuestsServed"
          FROM waiters
          INNER JOIN orders ON orders."waiterId" = waiters."id"
          WHERE orders."timeOfPurchase" >= NOW() - $1::interval
          AND orders."timeOfPurchase" <= NOW()
          ${
            req.query.waiterNames && req.query.waiterNames.length
              ? 'AND (' +
                req.query.waiterNames
                  .map((waiterName, idx) => {
                    if (idx === 0) {
                      return `waiters.name LIKE '${waiterName}'`
                    } else {
                      return `or waiters.name LIKE '${waiterName}'`
                    }
                  })
                  .join(' ') +
                ')'
              : ''
          }
          AND waiters."restaurantId" = $2
          GROUP BY waiters.name
          ORDER BY "totalNumOfGuestsServed" DESC;`
        const timeInterval = req.query.timeInterval + ' days'
        values = [timeInterval, req.user.restaurantId]
      } else {
        text = `SELECT waiters.name, SUM(orders."numberOfGuests") as "totalNumOfGuestsServed"
          FROM waiters
          INNER JOIN orders ON orders."waiterId" = waiters."id"
          WHERE orders."timeOfPurchase" > $1 AND orders."timeOfPurchase" < $2
          ${
            req.query.waiterNames && req.query.waiterNames.length
              ? 'AND (' +
                req.query.waiterNames
                  .map((waiterName, idx) => {
                    if (idx === 0) {
                      return `waiters.name LIKE '${waiterName}'`
                    } else {
                      return `or waiters.name LIKE '${waiterName}'`
                    }
                  })
                  .join(' ') +
                ')'
              : ''
          }
          AND waiters."restaurantId" = $3
          GROUP BY waiters.name
          ORDER BY "totalNumOfGuestsServed" DESC;`
        const correctEndDate = new Date(
          Math.min(new Date(), new Date(req.query.endDate))
        )
        values = [req.query.startDate, correctEndDate, req.user.restaurantId]
      }

      const queryResults = await client.query(text, values)
      const [xAxis, yAxis] = axisMapping(
        queryResults.rows,
        queryResults.fields[0].name,
        queryResults.fields[1].name
      )
      res.json({xAxis, yAxis})
    }
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
