import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_DATA_TYPE = 'GET_TABLE_TYPE'
const GET_VALUE_OPTIONS_FOR_STRING = 'GET_VALUE_OPTIONS_FOR_STRING'
const GET_JOIN_TABLES = 'GET_JOIN_TABLES'
const UPDATE_CUSTOM_QUERY = 'UPDATE_CUSTOM_QUERY'
const ADD_TABLE = 'ADD_TABLE'
const ADD_COLUMN = 'ADD_COLUMN'
const ADD_OPTION = 'ADD_OPTION'

/**
 * INITIAL STATE
 */
const initialState = {
  tableFields: [],
  dataType: '',
  valueOptionsForString: [],
  joinTables: [],
  customQuery: []
}

// query = [
//   {tableName: 'menu',
//   menuName: [lobster, coke],
//    foodType: [dinner, lunch]
//   }
//   ,
//   {tableName: waiters,
//   age: [>, 25]
//   }
// ]

/**
 * ACTION CREATORS
 */
const gotTableFields = tableFields => ({
  type: GET_TABLE_FIELDS,
  tableFields
})

const gotDataType = dataType => ({
  type: GET_DATA_TYPE,
  dataType
})

const gotValueOptionsForString = valueOptionsForString => ({
  type: GET_VALUE_OPTIONS_FOR_STRING,
  valueOptionsForString
})

const gotJoinTables = joinTables => ({
  type: GET_JOIN_TABLES,
  joinTables
})

export const addTable = tableName => {
  return {
    type: ADD_TABLE,
    tableName
  }
}

export const addColumn = (tableName, columnName) => {
  return {
    type: ADD_COLUMN,
    tableName,
    columnName
  }
}

export const addOption = (tableName, columnName, option) => {
  return {
    type: ADD_OPTION,
    tableName,
    columnName,
    option
  }
}

export const updateCustomQuery = queryObject => ({
  type: UPDATE_CUSTOM_QUERY,
  queryObject
})

// queryObj = {
//   tableName:...,
//   columName: ...,
//   where:...
// }

/**
 * THUNK CREATORS
 */
export const getTableFields = tableName => async dispatch => {
  try {
    const res = await axios.get(`/api/customizedQuery/${tableName}`)
    dispatch(gotTableFields(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getDataType = (tableName, columnName) => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/${columnName}`
    )
    dispatch(gotDataType(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getValueOptionsForString = (
  tableName,
  columnName
) => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/${columnName}/string`
    )
    dispatch(gotValueOptionsForString(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getJoinTables = tableName => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/foreignTableNames`
    )
    dispatch(gotJoinTables(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TABLE:
      return {
        ...state,
        customQuery: addTableFunc(state.customQuery, action.tableName)
      }
    case ADD_COLUMN:
      return {
        ...state,
        customQuery: addColumnFunc(
          state.customQuery,
          action.tableName,
          action.columnName
        )
      }
    case ADD_OPTION:
      return {
        ...state,
        customQuery: addOptionFunc(
          state.customQuery,
          action.tableName,
          action.columnName,
          action.option
        )
      }
    case GET_TABLE_FIELDS:
      return {
        ...state,
        tableFields: action.tableFields
      }
    case GET_DATA_TYPE:
      return {
        ...state,
        dataType: action.dataType
      }
    case GET_VALUE_OPTIONS_FOR_STRING:
      return {
        ...state,
        valueOptionsForString: action.valueOptionsForString
      }
    case GET_JOIN_TABLES:
      return {
        ...state,
        joinTables: action.joinTables
      }
    default:
      return state
  }
}

function addTableFunc(customQuery, tableName) {
  let updatedQuery
  if (customQuery.length) {
    updatedQuery = [...customQuery, {[tableName]: []}]
  } else {
    updatedQuery = [{[tableName]: []}]
  }
  return updatedQuery
}

function addColumnFunc(customQuery, tableName, columnName) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      let updatedColumnList
      if (table[existingTableName].length) {
        updatedColumnList = [...table[existingTableName], {[columnName]: []}]
      } else {
        updatedColumnList = [{[columnName]: []}]
      }
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function addOptionFunc(customQuery, tableName, columnName, option) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      const updatedColumnList = table[existingTableName].map(column => {
        const existingColumnName = Object.keys(column)[0]
        if (columnName === existingColumnName) {
          let updatedOptionList
          if (column[existingColumnName].length) {
            updatedOptionList = [...column[existingColumnName], option]
          } else {
            updatedOptionList = [option]
          }
          column[existingColumnName] = updatedOptionList
        }
        return column
      })
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}
