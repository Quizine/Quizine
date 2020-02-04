import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STOCK_QUERY_RESULTS = 'GET_STOCK_QUERY_RESULTS'

/**
 * INITIAL STATE
 */
const initialState = {
  stockQueries: {}
}

/**
 * ACTION CREATORS
 */
const gotStockQueryResults = queryResults => ({
  type: GET_STOCK_QUERY_RESULTS,
  queryResults
})

/**
 * THUNK CREATORS
 */
export const getStockQueryResults = () => async dispatch => {
  try {
    const res = await axios.get('/api/tables/stockQueries')
    console.log(res.data)
    dispatch(gotStockQueryResults(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STOCK_QUERY_RESULTS:
      return {
        ...state,
        stockQueries: action.queryResults
      }
    default:
      return state
  }
}
