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

const exampleArrangementObj = {
  groupBy: 'foodType'
  // sortBy: 'sum'
}

const exampleQuery = [
  {
    orders: [
      {
        quantity: {dataType: 'integer', options: ['$gte', 3], funcType: 'sum'}
      }
    ]
  },
  // {
  //   orders: [
  //     {
  //       tip: {dataType: 'integer', options: ['$gte', 50]}
  //     },
  //     {
  //       quantity: {dataType: 'integer', options: ['$gte', 3]}
  //     }
  //   ]
  // },
  {
    menus: [
      {
        foodType: {dataType: 'string', options: []}
      }
    ]
  }

  // {
  //   menuOrders: [
  //     {
  //       quantity: {dataType: 'integer', options: ['$gte', 3]}
  //     }
  //   ]
  // }
]

//A POST ROUTE TO MAKE A CUSTOM QUERY

router.post('/customQuery', async (req, res, next) => {
  try {
    // const customQueryRequest = exampleQuery
    const customQueryRequest = req.body.customQueryRequest //custom query from FE
    console.log(`here@`, customQueryRequest)
    const arrangementQueryRequest = req.body.arrangementQueryRequest
    const sql = jsonSql.build(
      translateQuery(customQueryRequest, arrangementQueryRequest)
    ) // serialize customQueryRequest to object that can be fed into jsonSql package ---> using translateQuery helper function

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

//CUSTOM QUERYING HELPER FUNCTIONS
function translateQuery(customQueryArr, arrangementObj) {
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
      if (
        columnObj[currentColumnName].funcType &&
        columnObj[currentColumnName].funcType.length
      ) {
        let funcObj = {
          func: {
            name: columnObj[currentColumnName].funcType,
            args: [{field: currentColumnName}]
          },
          alias: `${columnObj[currentColumnName].funcType} ${currentColumnName}`
        }
        columns.push(funcObj)
      } else {
        columns.push(currentColumnName)
      }
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
        if (
          (baseTable === 'menus' && tableName === 'orders') ||
          (baseTable === 'orders' && tableName === 'menus')
        ) {
          transformedJoinTables.menuOrders = {
            on: {
              [`${baseTable}.id`]: `"menuOrders".${baseTable.slice(
                0,
                baseTable.length - 1
              )}Id`
            }
          }
          transformedJoinTables[tableName] = {
            on: {
              [`${tableName}.id`]: `"menuOrders".${tableName.slice(
                0,
                tableName.length - 1
              )}Id`
            }
          }
        } else {
          transformedJoinTables[tableName] = {
            on: {
              [`${tableName}.id`]: `${baseTable}.${tableName.slice(
                0,
                tableName.length - 1
              )}Id`
            }
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
          } else {
            transformedConditions.$and.push({
              [columnName]: {$isNot: null}
            })
          }
        } else if (conditions[columnName].values.length) {
          if (conditions[columnName].values[0] === '$is') {
            transformedConditions.$and.push({
              [columnName]: conditions[columnName].values[1]
            })
          } else {
            transformedConditions.$and.push({
              [columnName]: {
                [conditions[columnName].values[0]]:
                  conditions[columnName].values[1]
              }
            })
          }
        }
      }
    }
  } else if (Object.keys(conditions).length === 1) {
    const columnName = Object.keys(conditions)[0] //timeOfPurchase
    if (conditions[columnName].values.length > 1) {
      if (conditions[columnName].dataType === 'string') {
        transformedConditions.$or = []
        conditions[columnName].values.forEach(condition => {
          if (condition) {
            transformedConditions.$or.push({[columnName]: condition})
          }
        })
      } else if (conditions[columnName].values[0] === '$is') {
        transformedConditions = {
          [columnName]: conditions[columnName].values[1]
        }
      } else {
        transformedConditions = {
          [columnName]: {
            [conditions[columnName].values[0]]: conditions[columnName].values[1]
          }
        }
      }
    } else if (conditions[columnName].values.length === 1) {
      transformedConditions = {[columnName]: conditions[columnName].values[0]}
      console.log(`what is here???`, transformedConditions)
    } else if (conditions[columnName].values.length === 0) {
      transformedConditions = {[columnName]: {$isNot: null}}
    }
  }
  console.log('transformed condition: ', transformedConditions)
  translatedQuery.type = type
  translatedQuery.fields = columns
  translatedQuery.table = baseTable
  translatedQuery.join = transformedJoinTables //one more transformation
  translatedQuery.condition = transformedConditions //one more transformation
  translatedQuery.group = arrangementObj.groupBy

  console.log(`before translated query condition`, translatedQuery.condition)
  if (translatedQuery.condition) {
    if (!Object.keys(translatedQuery.condition).length) {
      delete translatedQuery.condition
    } else if (translatedQuery.condition.$and) {
      if (!translatedQuery.condition.$and.length) {
        delete translatedQuery.condition
      }
    }
  }
  return translatedQuery
}
