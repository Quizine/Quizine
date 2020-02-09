const router = require('express').Router()
const pg = require('pg')
const config = 'postgres://yourname:yourpassword@localhost:5432/nestegg'
const client = new pg.Client(config)
client.connect()

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const {timeInterval, tableName, columnName} = req.query
    const newQuery = await client.query(
      `SELECT "${columnName}"
        FROM ${tableName}
        WHERE ${tableName}."timeOfPurchase" >= NOW() - interval '1 ${timeInterval}'`
    )

    res.json(newQuery.rows)
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

//waiters
