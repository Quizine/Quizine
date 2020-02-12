/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()
const jsonSql = require('json-sql')('postgresql')
jsonSql.configure({
  valuesPrefix: '$',
  namedValues: false
})
module.exports = router

//A POST ROUTE TO MAKE A CUSTOM QUERY

// const sql = jsonSql.build({
//   type: 'select',
//   fields: ['menuName', 'mealType'],
//   table: 'menus',
//   join: [],
//   condition: {menuName: 'lobster', mealType: 'dinner'}
// })

// const anExample = [
//   {orders: [{total: {dataType: 'integer', options: ['$lte', 50]}}]}
// ]

router.get('/customQuery', async (req, res, next) => {
  try {
    const ex0 = [
      {
        orders: [
          {total: {dataType: 'integer', options: ['$lte', 50]}},
          {
            timeOfPurchase: {
              dataType: 'timestamp with time zone',
              options: ['week']
            }
          }
        ]
      }
    ]
    const ex1 = [
      {
        menus: [
          {menuName: {dataType: 'string', options: []}},
          {mealType: {dataType: 'string', options: []}}
        ]
      }
    ]
    const ex2 = [
      //THIS ONE PRODUCTS NULL IN CONDITIONS
      {
        waiters: [{name: {dataType: 'string', options: []}}]
      },
      {
        restaurants: [{restaurantName: {dataType: 'string', options: []}}]
      }
    ]

    const sql = jsonSql.build(translateQuery(ex1))

    console.log(`the query is: `, sql.query)
    console.log(`the values are`, sql.getValuesArray())

    const queryResults = await client.query(sql.query, sql.getValuesArray())
    res.json(queryResults)
  } catch (error) {
    next(error)
  }
})

//GETS THESE TABLE NAMES(just the names): MENUS, WAITERS, ORDERS
router.get('/', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_type='BASE TABLE'
      AND table_schema='public'
      AND table_name !='Sessions'
      AND table_name !='users'
      AND table_name !='menuOrders'
      AND table_name !='restaurants';`
      const tableNames = await client.query(text)
      res.json(tableNames.rows)
    }
  } catch (error) {
    next(error)
  }
})
//GETS RELEVANT COLUMN NAMES FOR A GIVEN TABLE
router.get('/:tableName', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = $1
      AND COLUMN_NAME <> 'id'
      AND COLUMN_NAME NOT LIKE '%At'
      AND COLUMN_NAME NOT LIKE '%Id'`
      const values = [req.params.tableName]
      const columns = await client.query(text, values)
      res.json(columns.rows)
    }
  } catch (error) {
    next(error)
  }
})
//GETS FOREIGN KEYS FOR A GIVEN TABLE AND THE COLUMN NAMES OF THE MENUORDERS JOIN TABLE IF APPROPRIATE
router.get('/:tableName/foreignTableNames', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT
      tc.table_schema,
      tc.constraint_name,
      tc.table_name,
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name= $1
      AND ccu.table_name <> 'restaurants';`
      const values = [req.params.tableName]
      const foreignTableNamesFromFK = await client.query(text, values)
      if (
        req.params.tableName === 'orders' ||
        req.params.tableName === 'menus'
      ) {
        const text = `
        SELECT
        tc.table_schema,
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name='menuOrders'
        AND ccu.table_name <> $1;`
        const values = [req.params.tableName]
        const foreignTableNameFromMenuOrders = await client.query(text, values)
        res.json(
          foreignTableNamesFromFK.rows.concat(
            foreignTableNameFromMenuOrders.rows
          )
        )
      } else {
        res.json(foreignTableNamesFromFK.rows)
      }
    }
  } catch (error) {
    next(error)
  }
})

//GETS DATATYPE
router.get('/:tableName/:columnName', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT data_type from information_schema.columns
      WHERE table_name = $1
      AND column_name = $2;`
      const values = [req.params.tableName, req.params.columnName]
      const datatypeQuery = await client.query(text, values)
      const datatype = datatypeQuery.rows[0].data_type
      res.json(datatype)
    }
  } catch (error) {
    next(error)
  }
})

// router.get('/:tableName/:columnName/timestamp', async (req, res, next) => {
//   try {
//     const datatypeQuery = await client.query(`
//     SELECT data_type from information_schema.columns
//     WHERE table_name = '${req.params.tableName}'
//     AND column_name = '${req.params.columnName}';`)
//     const datatype = datatypeQuery.rows[0].data_type
//     res.json(datatype)
//   } catch (error) {
//     next(error)
//   }
// })

// router.get('/:tableName/:columnName/integer', async (req, res, next) => {
//   try {
//     const datatypeQuery = await client.query(`
//     SELECT data_type from information_schema.columns
//     WHERE table_name = '${req.params.tableName}'
//     AND column_name = '${req.params.columnName}';`)
//     const datatype = datatypeQuery.rows[0].data_type
//     res.json(datatype)
//   } catch (error) {
//     next(error)
//   }
// })

//SHOULD JUST GIVE BACK THE COLUMN NAME?? WHAT DOES THIS DO? (GIVING ME STRANGE RESULTS)
router.get('/:tableName/:columnName/string', async (req, res, next) => {
  try {
    if (req.user.id) {
      const text = `
      SELECT DISTINCT "${req.params.columnName}" AS aliasname
      FROM ${req.params.tableName}
      WHERE "${req.params.columnName}" IS NOT NULL;`
      // const text = `SELECT DISTINCT $1 AS aliasname FROM $2
      // WHERE $1 IS NOT NULL;`
      const values = [req.params.columnName, req.params.tableName] //SUBSTITION NOT WORKING
      const valueOptions = await client.query(text)
      res.json(valueOptions.rows)
    }
  } catch (error) {
    next(error)
  }
})

// const internalObj = {
//   type: 'select',
//   fields: ['menuName', 'mealType'],
//   table: 'menus',
//   join: [],
//   condition: {menuName: 'lobster', mealType: 'dinner'}
// }

// const externalObj = [
//   {orders: [{total: {dataType: 'integer', options: ['$lte', 50]}}]}
// ]

//CUSTOM QUERYING HELPER FUNCTIONS
function translateQuery(customQueryArr) {
  const translatedQuery = {}
  const type = 'select'
  let baseTable = ''
  const columns = []
  const joinTables = [] //each table needs to be an object
  const conditions = {} //each condition will be key value pairs
  customQueryArr.forEach((tableObj, idx) => {
    const currentTableName = Object.keys(tableObj)[0] //getting tableName
    if (idx === 0) {
      baseTable = currentTableName
    } else {
      joinTables.push(currentTableName)
    }
    tableObj[currentTableName].forEach(columnObj => {
      const currentColumnName = Object.keys(columnObj)[0]
      columns.push(currentColumnName)
      conditions[currentColumnName] = {}
      if (columnObj[currentColumnName].dataType === 'integer') {
        conditions[currentColumnName].dataType =
          columnObj[currentColumnName].dataType
        conditions[currentColumnName].values =
          columnObj[currentColumnName].options
      } else if (
        columnObj[currentColumnName].dataType === 'timestamp with time zone'
      ) {
        //      WHERE orders."timeOfPurchase" ::date = $1
        // WHERE orders."timeOfPurchase" >= NOW() - $1::interval
        conditions.timeOfPurchase = {}
        conditions.timeOfPurchase.dataType = 'timestamp'
        let interval = columnObj[currentColumnName].options[0]
        let now = new Date()
        if (interval === 'year') {
          now.setFullYear(now.getFullYear() - 1)
        } else if (interval === 'month') {
          now.setMonth(now.getMonth() - 1)
        } else if (interval === 'week') {
          now.setDate(now.getDate() - 7)
        }
        conditions.timeOfPurchase.values = ['$gte', now]
      } else {
        //IT'S A STRING
        conditions[currentColumnName].values = []
        conditions[currentColumnName].dataType = 'string'
        columnObj[currentColumnName].options.forEach(condition => {
          conditions[currentColumnName].values.push(condition) //this needs to be an object
        })
      }
    })
  })
  const transformedJoinTables = {}
  if (joinTables.length) {
    joinTables.forEach((tableName, idx) => {
      if (idx === 0) {
        transformedJoinTables[tableName] = {
          on: {
            [`${tableName}.id`]: `${baseTable}.${tableName.slice(
              0,
              tableName.length - 1
            )}Id`
          }
        }
      } else {
        transformedJoinTables[tableName] = {
          on: {
            [`${tableName}.id`]: `${joinTables[idx - 1]}.${tableName.slice(
              0,
              tableName.length - 1
            )}Id`
          }
        }
      }
    })
  }
  console.log(`conditions:`, conditions)
  let transformedConditions = {}
  if (Object.keys(conditions).length > 1) {
    transformedConditions.$and = []
    for (let columnName in conditions) {
      if (conditions.hasOwnProperty(columnName)) {
        if (conditions[columnName].dataType === 'string') {
          const orCondition = []
          if (conditions[columnName].values.length > 1) {
            conditions[columnName].values.forEach(condition => {
              orCondition.push({[columnName]: condition})
            })
            transformedConditions.$and.push({$or: orCondition})
          } else if (conditions[columnName].values.length === 1) {
            transformedConditions.$and.push({
              [columnName]: conditions[columnName].values[0]
            })
          }
        } else if (conditions[columnName].values.length) {
          transformedConditions.$and.push({
            [columnName]: {
              [conditions[columnName].values[0]]:
                conditions[columnName].values[1]
            }
          })
        }
      }
    }
  } else {
    const columnName = Object.keys(conditions)[0]
    if (conditions[columnName].length > 1) {
      transformedConditions.$or = []
      conditions[columnName].forEach(condition => {
        if (condition) {
          transformedConditions.$or.push({[columnName]: condition})
        }
      })
    } else {
      transformedConditions = conditions[0]
      console.log(`what is here???`, transformedConditions)
    }
  }

  translatedQuery.type = type
  translatedQuery.fields = columns
  translatedQuery.table = baseTable
  translatedQuery.join = transformedJoinTables //one more transformation
  translatedQuery.condition = transformedConditions //one more transformation
  if (translatedQuery.condition.$and) {
    if (!translatedQuery.condition.$and.length) {
      delete translatedQuery.condition
    }
  }

  if (!Object.keys(translatedQuery.condition).length) {
    delete translatedQuery.condition
  }
  console.log(`here is translate query`, translatedQuery)
  console.log(`conditions further down in the func:`, translatedQuery.condition)
  // here is translate query {
  //   type: 'select',
  //   fields: [ 'mealType', 'menuName' ],
  //   table: 'menus',
  //   join: {},
  //   condition: { '$and': [ [Object], [Object] ] }
  // }
  // for (let key in translatedQuery.condition) {
  //   if (translatedQuery.condition.hasOwnProperty(key)) {
  //     if (translatedQuery.condition[key] === '$and') {
  //       for (let i = 0; i < translatedQuery.condition.$and.length; i++) {
  //         let element =
  //         if (tra)
  //       }
  //     }
  //     else {

  //     }
  //   }
  // }

  //SEE IF COLUMN NAMES HAVE UNDEFINED VALUES
  //use delete operator
  for (let key in translatedQuery.condition) {
    const value = translatedQuery.condition[key]
    console.log(`here is the key`, key)
    console.log(`and value`, value)
    if (Array.isArray(value)) {
      value.forEach(item => {
        console.log(`here is an array item`, item)
      })
    }
  }

  return translatedQuery
}
