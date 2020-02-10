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
    const sql = jsonSql.build({
      type: 'select',
      fields: ['menuName', 'mealType'],
      table: 'menus',
      join: [],
      condition: {menuName: 'lobster', mealType: 'dinner'}
    })

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
const query = [
  {
    menus: [
      {mealType: ['dinner']},
      {menuName: ['lobster']},
      {mealType: ['dinner']}
    ]
  }
]

const internalObj = {
  type: 'select',
  fields: ['menuName', 'mealType'],
  table: 'menus',
  join: [],
  condition: {menuName: 'lobster', mealType: 'dinner'}
}

//CUSTOM QUERYING HELPER FUNCTIONS
function translateQuery(queryArr) {
  const baseSelect = []
  const select = []
  const from = [] //WILL ONLY HAVE ONE ITEM IN IT
  const join = []
  const where = [] //WILL ONLY HAVE ONE ITEM IN IT
  const and = []
  queryArr.forEach(queryObj => {
    for (const table in queryObj) {
      if (queryObj.hasOwnProperty(table)) {
        if (from.length < 1) from.push(table)
        else join.push(table)
        const columnNameAndSelectValues = queryObj[table]
        columnNameAndSelectValues.forEach((item, index) => {
          for (const column in item) {
            if (item.hasOwnProperty(column)) {
              if (index === 0) baseSelect.push(column)
              else select.push(column)
              const whereItemArr = item[column]
              whereItemArr.forEach(whereItem => {
                if (where.length < 1) where.push(whereItem)
                else and.push(whereItem)
              })
            }
          }
        })
      }
    }
  })

  //HACK FOR "AND":
  // eslint-disable-next-line no-extend-native
  Array.prototype.customMap = function(cb) {
    const newArr = []
    for (let i = 1; i < this.length; i++) {
      newArr.push(cb(this[i], i, this))
    }
    return newArr
  }

  let queryString
  if (join.length && and.length) {
    queryString = ``
  } else if (!and.length && join.length) {
    queryString = ``
  } else if (!join.length && and.length && select.length) {
    queryString = `
      SELECT ${baseSelect.join('')}, ${select.map(item => `"${item}"`)}
      FROM ${from.join('')}
      WHERE "${baseSelect.join('')}" = '${where[0]}'
      AND ${select.join(`and ${and.map(item => item)}`)}
      ;`
  } else if (!and.length && !join.length) {
    queryString = `select ${select.map(item => `"${item}"`)}from ${from.join(
      ''
    )} where "${select[0]}" = '${where[0]}';`
  }
  return queryString
}
