import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_WAITER_PERFORMANCE_QUERY_INTERVAL =
  'GET_WAITER_PERFORMANCE_QUERY_INTERVAL'

const GET_WAITER_PERFORMANCE_QUERY_DATE = 'GET_WAITER_PERFORMANCE_QUERY_DATE'

/**
 * INITIAL STATE
 */
const initialState = {
  waiterPerformanceQueryResults: {},
  allNames: []
}

/**
 * ACTION CREATORS
 */

const gotWaiterPerformanceQueryResultsInterval = results => ({
  type: GET_WAITER_PERFORMANCE_QUERY_INTERVAL,
  results
})

const gotWaiterPerformanceQueryResultsDate = results => ({
  type: GET_WAITER_PERFORMANCE_QUERY_DATE,
  results
})

/**
 * THUNK CREATORS
 */

export const getWaiterPerformanceQueryResultsInterval = (
  timeInterval,
  queryTitle,
  waiterNames = []
) => async dispatch => {
  try {
    const res = await axios.get(`/api/staffAnalytics/${queryTitle}`, {
      params: {timeInterval, waiterNames}
    })
    dispatch(gotWaiterPerformanceQueryResultsInterval(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getWaiterPerformanceQueryResultsDate = (
  startDate,
  endDate,
  queryTitle,
  waiterNames = []
) => async dispatch => {
  try {
    const res = await axios.get(`/api/staffAnalytics/${queryTitle}`, {
      params: {startDate, endDate, waiterNames}
    })
    console.log('what is this data: ', res.data)
    dispatch(gotWaiterPerformanceQueryResultsDate(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_WAITER_PERFORMANCE_QUERY_INTERVAL:
      if (!state.allNames.length) {
        return {
          ...state,
          waiterPerformanceQueryResults: action.results,
          allNames: action.results.xAxis
        }
      }
      return {
        ...state,
        waiterPerformanceQueryResults: action.results
      }

    case GET_WAITER_PERFORMANCE_QUERY_DATE:
      return {
        ...state,
        waiterPerformanceQueryResults: action.results
      }
    default:
      return state
  }
}
