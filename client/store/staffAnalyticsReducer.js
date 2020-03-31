import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_TIP_PERCENTAGE_VS_WAITERS = 'GET_TIP_PERCENTAGE_VS_WAITERS'

/**
 * INITIAL STATE
 */
const initialState = {
  tipPercentageVsWaiters: {
    xAxis: [],
    yAxis: [],
    days: {}
  }
}

/**
 * ACTION CREATORS
 */

const gotTipPercentageVsWaiters = (results, timeInterval) => ({
  type: GET_TIP_PERCENTAGE_VS_WAITERS,
  results,
  timeInterval
})

/**
 * THUNK CREATORS
 */

export const getTipPercentageVsWaiters = timeInterval => async dispatch => {
  try {
    const res = await axios.get('/api/staffAnalytics/tipPercentageVsWaiters', {
      params: {timeInterval}
    })
    dispatch(gotTipPercentageVsWaiters(res.data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TIP_PERCENTAGE_VS_WAITERS:
      return {
        ...state,
        tipPercentageVsWaiters: {
          ...state.tipPercentageVsWaiters,
          xAxis: action.results.xAxis,
          yAxis: action.results.yAxis,
          days: action.results
        }
      }
    default:
      return state
  }
}
