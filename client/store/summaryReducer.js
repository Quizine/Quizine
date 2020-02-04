import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SUMMARY = 'GET_SUMMARY'
const GET_PEAK_TIME_ORDERS = 'GET_PEAK_TIME_ORDERS'

/**
 * INITIAL STATE
 */
const initialState = {
  summary: {},
  peakTimeOrders: {
    year: [],
    month: [],
    week: []
  }
}

/**
 * ACTION CREATORS
 */
const gotSummary = summaryObject => ({type: GET_SUMMARY, summaryObject})
const gotPeakTimeOrders = (orders, timeInterval) => ({
  type: GET_PEAK_TIME_ORDERS,
  orders,
  timeInterval
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

export const getPeakTimeOrders = timeInterval => async dispatch => {
  try {
    const response = await axios.get('/api/orders/searchlast', {
      params: {interval: timeInterval}
    })
    dispatch(gotPeakTimeOrders(response.data, timeInterval))
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
      return {...state, summary: action.summaryObject}
    case GET_PEAK_TIME_ORDERS:
      return {
        ...state,
        peakTimeOrders: {
          ...state.peakTimeOrders,
          [`${action.timeInterval}`]: action.orders
        }
      }
    default:
      return state
  }
}
