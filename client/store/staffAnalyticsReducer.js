import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL =
  'GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL'

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

const gotTipPercentageVsWaitersInterval = (results, timeInterval) => ({
  type: GET_TIP_PERCENTAGE_VS_WAITERS_INTERVAL,
  results,
  timeInterval
})

/**
 * THUNK CREATORS
 */

export const getTipPercentageVsWaitersInterval = timeInterval => async dispatch => {
  try {
    const res = await axios.get('/api/staffAnalytics/tipPercentageVsWaiters', {
      params: {timeInterval}
    })
    dispatch(gotTipPercentageVsWaitersInterval(res.data, timeInterval))
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
      return {
        ...state,
        tipPercentageVsWaiters: {
          ...state.tipPercentageVsWaitersInterval,
          xAxis: action.results.xAxis,
          yAxis: action.results.yAxis,
          days: action.results
        }
      }
    default:
      return state
  }
}
