import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_DATA_TYPE = 'GET_TABLE_TYPE'
const GET_VALUE_OPTIONS_FOR_STRING = 'GET_VALUE_OPTIONS_FOR_STRING'
const GET_JOIN_TABLES = 'GET_JOIN_TABLES'

/**
 * INITIAL STATE
 */
const initialState = {
  tableFields: [],
  dataType: '',
  valueOptionsForString: [],
  joinTables: []
}

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
    default:
      return state
  }
}
