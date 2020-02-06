import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SUMMARY = 'GET_SUMMARY'
const GET_PEAK_TIME_ORDERS = 'GET_PEAK_TIME_ORDERS'
const GET_REVENUE_VS_TIME = 'GET_REVENUE_VS_TIME'

/**
 * INITIAL STATE
 */
const initialState = {
  summary: {}, //?????????
  peakTimeOrders: {
    year: [],
    month: [],
    week: []
  },
  revenueVsTime: {
    allPeriod: {},
    oneYear: {},
    twoYears: {}
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
const gotRevenueVsTime = (chartData, yearQty) => ({
  type: GET_REVENUE_VS_TIME,
  chartData,
  yearQty
})
/**
 * THUNK CREATORS
 */

// NOT USED FOR NOW

// export const getSummary = () => async dispatch => {
//   try {
//     const res = await axios.get('/api/tables/summary')
//     dispatch(gotSummary(res.data))
//   } catch (err) {
//     console.error(err)
//   }
// }

export const getPeakTimeOrders = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get(
      '/api/tables/summary/graphs/numberOfGuestsByHour',
      {
        params: {interval: timeInterval}
      }
    )
    dispatch(gotPeakTimeOrders(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getRevenueVsTime = yearQty => async dispatch => {
  let sendYear
  if (yearQty === 'oneYear') sendYear = '1'
  else if (yearQty === 'twoYears') sendYear = '2'
  else sendYear = '3'
  try {
    const {data} = await axios.get('/api/tables/summary/graphs/revenueVsTime', {
      params: {year: sendYear}
    })
    dispatch(gotRevenueVsTime(data, yearQty))
  } catch (error) {
    console.error(error)
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
    case GET_REVENUE_VS_TIME:
      return {
        ...state,
        revenueVsTime: {
          ...state.revenueVsTime,
          [`${action.yearQty}`]: action.chartData
        }
      }
    default:
      return state
  }
}
