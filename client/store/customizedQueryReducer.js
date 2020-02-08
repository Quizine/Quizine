import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_CUSTOMIZED_QUERY = 'GET_CUSTOMIZED_QUERY'

/**
 * INITIAL STATE
 */
const initialState = {
  tableFields: {},
  customizedQuery: []
}

/**
 * ACTION CREATORS
 */
const gotTableFields = tableFields => ({
  type: GET_TABLE_FIELDS,
  tableFields
})

const gotCustomizedQuery = newQuery => ({
  type: GET_CUSTOMIZED_QUERY,
  newQuery
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

export const getCustomizedQuery = (
  tableName,
  columnName,
  timeInterval
) => async dispatch => {
  try {
    const res = await axios.get('/api/customizedQuery/', {
      params: {
        timeInterval,
        tableName,
        columnName
      }
    })
    dispatch(gotCustomizedQuery(res.data))
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
    case GET_CUSTOMIZED_QUERY:
      return {
        ...state,
        newQuery: action.customizedQuery
      }
    default:
      return state
  }
}
