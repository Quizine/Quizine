import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_QUERY_RESULTS = 'GET_FIELDS'

/**
 * INITIAL STATE
 */
const initialState = {
  businessAnalytics: {}
}

/**
 * ACTION CREATORS
 */
const gotQueryResults = queryResults => ({
  type: GET_QUERY_RESULTS,
  queryResults
})

/**
 * THUNK CREATORS
 */
export const getSummary = () => async dispatch => {
  try {
    const res = await axios.get('/api/tables/summary')
    dispatch(gotSummary(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUMMARY:
      return {
        ...state
        // rows: action.menu.rows,
        // fields: filterFieldsFunction(action.menu.fields)   ?????
      }
    default:
      return state
  }
}
