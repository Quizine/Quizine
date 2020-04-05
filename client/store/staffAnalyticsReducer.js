import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL =
  'GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL'

const GET_TIP_PERCENTAGE_VS_WAITERS_DATE = 'GET_TIP_PERCENTAGE_VS_WAITERS_DATE'

/**
 * INITIAL STATE
 */
const initialState = {
  tipPercentageVsWaiters: {},
  allNames: []
}

/**
 * ACTION CREATORS
 */

const gotTipPercentageVsWaitersInterval = results => ({
  type: GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL,
  results
})

const gotTipPercentageVsWaitersDate = results => ({
  type: GET_TIP_PERCENTAGE_VS_WAITERS_DATE,
  results
})

/**
 * THUNK CREATORS
 */

export const getTipPercentageVsWaitersInterval = (
  timeInterval,
  waiterNames = []
) => async dispatch => {
  try {
    const res = await axios.get('/api/staffAnalytics/tipPercentageVsWaiters', {
      params: {timeInterval, waiterNames}
    })
    dispatch(gotTipPercentageVsWaitersInterval(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getTipPercentageVsWaitersDate = (
  startDate,
  endDate,
  waiterNames = []
) => async dispatch => {
  try {
    const res = await axios.get('/api/staffAnalytics/tipPercentageVsWaiters', {
      params: {startDate, endDate, waiterNames}
    })
    dispatch(gotTipPercentageVsWaitersDate(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL:
      if (!state.allNames.length) {
        return {
          ...state,
          tipPercentageVsWaiters: action.results,
          allNames: action.results.xAxis
        }
      }
      return {
        ...state,
        tipPercentageVsWaiters: action.results
      }

    case GET_TIP_PERCENTAGE_VS_WAITERS_DATE:
      return {
        ...state,
        tipPercentageVsWaiters: action.results
      }
    default:
      return state
  }
}
