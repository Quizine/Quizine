import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_NEW_QUERY = 'GET_NEW_QUERY'

/**
 * INITIAL STATE
 */
const initialState = {
  tableFields: {},
  newQuery: []
}

/**
 * ACTION CREATORS
 */
const gotTableFields = tableFields => ({
  type: GET_TABLE_FIELDS,
  tableFields
})

const gotNewQuery = newQuery => ({
  type: GET_NEW_QUERY,
  newQuery
})

/**
 * THUNK CREATORS
 */
export const getTableFields = () => async dispatch => {
  try {
    const res = await axios.get('/api/customizedQuery/fields')
    dispatch(gotTableFields(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getNewQuery = (
  tableName,
  columnName,
  timeInterval
) => async dispatch => {
  try {
    console.log('parameters ------->', tableName, columnName, timeInterval)
    const res = await axios.get('/api/customizedQuery/', {
      params: {
        timeInterval,
        tableName,
        columnName
      }
    })
    dispatch(gotNewQuery(res.data))
  } catch (err) {
    console.error(err)
  }
}

const filterFieldsFunction = function(obj) {
  let filteredObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      filteredObj[key] = obj[key].filter(
        element =>
          element.column_name !== 'id' &&
          element.column_name !== 'createdAt' &&
          element.column_name !== 'updatedAt' &&
          !element.column_name.includes('Id')
      )
    }
  }
  return filteredObj
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TABLE_FIELDS:
      return {
        ...state,
        tableFields: filterFieldsFunction(action.tableFields)
      }
    case GET_NEW_QUERY:
      return {
        ...state,
        newQuery: action.newQuery
      }
    default:
      return state
  }
}
