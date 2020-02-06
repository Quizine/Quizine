import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STOCK_QUERY_RESULTS = 'GET_STOCK_QUERY_RESULTS'
const GET_NUM_ORDERS_PER_HOUR_RESULTS = 'GET_NUM_ORDERS_PER_HOUR_RESULTS'
const GET_AVG_REVENUE_PER_GUEST = 'GET_AVG_REVENUE_PER_GUEST'

/**
 * INITIAL STATE
 */
const initialState = {
  stockQueries: {},
  numOrdersPerHour: {
    year: [],
    month: [],
    week: []
  },
  avgRevPerGuest: {
    year: [],
    month: [],
    week: []
  }
}

/**
 * ACTION CREATORS
 */
const gotStockQueryResults = queryResults => ({
  type: GET_STOCK_QUERY_RESULTS,
  queryResults
})
const gotNumOrdersPerHour = (results, timeInterval) => ({
  type: GET_NUM_ORDERS_PER_HOUR_RESULTS,
  results,
  timeInterval
})
const gotAvgRevPerGuest = (results, timeInterval) => ({
  type: GET_AVG_REVENUE_PER_GUEST,
  results,
  timeInterval
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

export const getNumOrdersPerHour = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get('/api/analytics/numberOfOrdersPerHour', {
      params: {interval: timeInterval}
    })
    dispatch(gotNumOrdersPerHour(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getAvgRevPerGuest = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get('/api/analytics/avgRevPerGuest', {
      params: {interval: timeInterval}
    })
    dispatch(gotAvgRevPerGuest(data, timeInterval))
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
    case GET_NUM_ORDERS_PER_HOUR_RESULTS:
      return {
        ...state,
        numOrdersPerHour: {
          ...state.numOrdersPerHour,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_AVG_REVENUE_PER_GUEST:
      return {
        ...state,
        avgRevPerGuest: {
          ...state.avgRevPerGuest,
          [`${action.timeInterval}`]: action.results
        }
      }
    default:
      return state
  }
}
