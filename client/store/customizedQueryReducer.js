import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_DATA_TYPE = 'GET_TABLE_TYPE'
const GET_VALUE_OPTIONS_FOR_STRING = 'GET_VALUE_OPTIONS_FOR_STRING'
const GET_JOIN_TABLES = 'GET_JOIN_TABLES'
const UPDATE_CUSTOM_QUERY = 'UPDATE_CUSTOM_QUERY'

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
    case UPDATE_CUSTOM_QUERY:
      return {
        ...state,
        customQuery: updateQueryFunc(state.customQuery, action.queryObject)
      }
    default:
      return state
  }
}

function updateQueryFunc(customQuery, queryObject) {
  let isUpdated = false
  let updatedQuery = []
  if (customQuery.length) {
    updatedQuery = customQuery.map(element => {
      let updatedElement = {}
      if (element.tableName === queryObject.tableName) {
        updatedElement.tableName = queryObject.tableName
        for (let key in element) {
          if (element.hasOwnProperty(key)) {
            if (key !== 'tableName') {
              if (Array.isArray(element[key])) {
                updatedElement[key] = [...element[key]]
              } else {
                updatedElement[key] = element[key]
              }
            }
          }
        }
        updatedElement[queryObject.columnName] = [...queryObject.where]
        isUpdated = true
      } else {
        updatedElement.tableName = element.tableName
        for (let key in element) {
          if (element.hasOwnProperty(key)) {
            if (key === 'tableName') {
              updatedElement[key] = element[key]
            } else if (Array.isArray(element[key])) {
                updatedElement[key] = [...element[key]]
              } else {
                updatedElement[key] = element[key]
              }
          }
        }
      }
      return updatedElement
    })
    if (!isUpdated) {
      let newElement = {
        tableName: queryObject.tableName
      }
      if (queryObject.where) {
        newElement[queryObject.columnName] = [...queryObject.where]
      }
      updatedQuery = [...updatedQuery, newElement]
    }
  } else {
    updatedQuery = [{tableName: queryObject.tableName}]
  }
  return updatedQuery
}
