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

//MOVED TO THE TOP B/C OF ALL THE WILDCARD GET ROUTES BELOW
router.get('/customQuery', async (req, res, next) => {
  try {
    const FEQuery1 = [
      // works
      {
        menus: [{mealType: ['dinner']}, {menuName: ['lobster']}]
      }
    ]

    // {$or: [{menuName: ‘lobster’}, {menuName: ‘chicken’]}
    const FEQuery2 = [
      {
        menus: [{mealType: ['dinner']}, {menuName: ['lobster', 'chicken']}]
      }
    ]

    const sql = jsonSql.build(translateQuery(FEQuery2))

    // const sql = jsonSql.build({
    //   type: 'select',
    //   fields: ['menuName', 'mealType'],
    //   table: 'menus',
    //   join: [],
    //   condition: {menuName: 'lobster', mealType: 'dinner'}
    // })

    const queryResults = await client.query(sql.query, sql.getValuesArray())
    res.json(queryResults)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const tableNames = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_type='BASE TABLE'
    AND table_schema='public'
    AND table_name !='Sessions' 
    AND table_name !='users'
    AND table_name !='menuOrders'
    AND table_name !='restaurants';`)

    res.json(tableNames.rows)
  } catch (error) {
    next(error)
  }
})

router.get('/:tableName', async (req, res, next) => {
  try {
    const columns = await client.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${req.params.tableName}'
      AND COLUMN_NAME <> 'id'
      AND COLUMN_NAME NOT LIKE '%At'
      AND COLUMN_NAME NOT LIKE '%Id'`)
    res.json(columns.rows)
  } catch (error) {
    next(error)
  }
})

router.get('/:tableName/foreignTableNames', async (req, res, next) => {
  try {
    const foreignTableNamesFromFK = await client.query(`
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
    AND tc.table_name='${req.params.tableName}'
    AND ccu.table_name <> 'restaurants';`)
    if (req.params.tableName === 'orders' || req.params.tableName === 'menus') {
      const foreignTableNameFromMenuOrders = await client.query(`
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
      AND ccu.table_name <> '${req.params.tableName}';`)
      res.json(
        foreignTableNamesFromFK.rows.concat(foreignTableNameFromMenuOrders.rows)
      )
    } else {
      res.json(foreignTableNamesFromFK.rows)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/:tableName/:columnName', async (req, res, next) => {
  try {
    const datatypeQuery = await client.query(`
    SELECT data_type from information_schema.columns
    WHERE table_name = '${req.params.tableName}'
    AND column_name = '${req.params.columnName}';`)
    const datatype = datatypeQuery.rows[0].data_type
    res.json(datatype)
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

router.get('/:tableName/:columnName/string', async (req, res, next) => {
  try {
    const valueOptions = await client.query(`
    SELECT DISTINCT "${req.params.columnName}" AS aliasname from ${
      req.params.tableName
    }
    WHERE "${req.params.columnName}" IS NOT NULL;`)
    res.json(valueOptions.rows)
  } catch (error) {
    next(error)
  }
})
// orders ----> need foreign key "waiters" also need to exclude 'restaraurants'
// orders ----> need "menuOrders" table -------> foreign keys (orderId nad menuId)
//menus ----> menuOrders table ----> foreign keys (orderId and menuId)

// query = [
// {tableName: 'menu',
// menuName: [lobster, coke], //this case would be a select all
//  foodType: [dinner, lunch]
// }
//   ,
//   {tableName: waiters,
//   age: [>, 25]
//   }
// ]

// {'foodType': []} means select * foodTypes

// select "menuName", "mealType"
// from menus
// where "menuName" = 'lobster'
// and "mealType" = 'dinner';

const internalObj = {
  type: 'select',
  fields: ['menuName', 'mealType'],
  table: 'menus',
  join: [],
  condition: {menuName: 'lobster', mealType: 'dinner'}
}

// {menuName: ['lobster',b,c,d,e], foodType: [a,b,c]} object.keys.length

const query = [
  {
    menus: [{mealType: ['dinner', 'lunch']}, {menuName: ['lobster']}]
  }
]

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
      conditions[currentColumnName] = []
      columnObj[currentColumnName].forEach(condition => {
        conditions[currentColumnName].push(condition)
      })
    })
  })
  const transformedJoinTables = {}
  if (joinTables.length) {
    joinTables.forEach((tableName, idx) => {
      if (idx === 0) {
        transformedJoinTables[tableName] = {
          on: {[`${tableName}.id`]: `${baseTable}.${tableName}Id`}
        }
      } else {
        transformedJoinTables[tableName] = {
          on: {[`${tableName}.id`]: `${joinTables[idx - 1]}.${tableName}Id`}
        }
      }
    })
  }
  let transformedConditions = {}
  if (Object.keys(conditions).length > 1) {
    transformedConditions.$and = []
    for (let columnName in conditions) {
      if (conditions.hasOwnProperty(columnName)) {
        const orCondition = []
        if (conditions[columnName].length > 1) {
          //
          conditions[columnName].forEach(condition => {
            orCondition.push({[columnName]: condition})
          })
          transformedConditions.$and.push({$or: orCondition})
        } else {
          transformedConditions.$and.push({
            [columnName]: conditions[columnName][0]
          })
        }
      }
    }
  } else {
    const columnName = Object.keys(conditions)[0]
    if (conditions[columnName].length > 1) {
      transformedConditions.$or = []
      conditions[columnName].forEach(condition => {
        transformedConditions.$or.push({[columnName]: condition})
      })
    } else {
      transformedConditions = conditions
    }
  }
  translatedQuery.type = type
  translatedQuery.fields = columns
  translatedQuery.table = baseTable
  translatedQuery.join = transformedJoinTables //one more transformation
  translatedQuery.condition = transformedConditions //one more transformation
  console.log(`here is translate query`, translatedQuery)
  console.log(`conditions:`, translatedQuery)
  // here is translate query {
  //   type: 'select',
  //   fields: [ 'mealType', 'menuName' ],
  //   table: 'menus',
  //   join: {},
  //   condition: { '$and': [ [Object], [Object] ] }
  // }

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
