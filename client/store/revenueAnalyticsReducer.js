import axios from 'axios'
import {object} from 'prop-types'

/**
 * ACTION TYPES
 */
const GET_REVENUE_QUERY_INTERVAL = 'GET_REVENUE_QUERY_INTERVAL'
const GET_REVENUE_QUERY_DATE = 'GET_REVENUE_QUERY_DATE'

/**
 * INITIAL STATE
 */
const initialState = {
  revenueQueryResults: {}
}

/**
 * ACTION CREATORS
 */

const gotRevenueQueryResultsInterval = results => ({
  type: GET_REVENUE_QUERY_INTERVAL,
  results
})

const gotRevenueQueryResultsDate = results => ({
  type: GET_REVENUE_QUERY_DATE,
  results
})

/**
 * THUNK CREATORS
 */

export const getRevenueQueryResultsInterval = (
  timeInterval,
  queryTitle
) => async dispatch => {
  try {
    const res = await axios.get(`/api/revenueAnalytics/${queryTitle}`, {
      params: {timeInterval}
    })
    console.log('what is the response, ', res.data)
    dispatch(gotRevenueQueryResultsInterval(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getRevenueQueryResultsDate = (
  startDate,
  endDate,
  queryTitle
) => async dispatch => {
  try {
    const res = await axios.get(`/api/revenueAnalytics/${queryTitle}`, {
      params: {startDate, endDate}
    })
    dispatch(gotRevenueQueryResultsDate(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REVENUE_QUERY_INTERVAL:
      return {
        ...state,
        revenueQueryResults: action.results
      }
    case GET_REVENUE_QUERY_DATE:
      return {
        ...state,
        revenueQueryResults: action.results
      }
    default:
      return state
  }
}
