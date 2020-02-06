import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_PEAK_TIME_ORDERS = 'GET_PEAK_TIME_ORDERS'
const GET_REVENUE_VS_TIME = 'GET_REVENUE_VS_TIME'

/**
 * INITIAL STATE
 */
const initialState = {
  peakTimeOrdersVsTime: {
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

export const getPeakTimeOrders = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get('/api/summary/numberOfGuestsVsHour', {
      params: {interval: timeInterval}
    })
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
    const {data} = await axios.get('/api/summary/revenueVsTime', {
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
    case GET_PEAK_TIME_ORDERS:
      return {
        ...state,
        peakTimeOrdersVsTime: {
          ...state.peakTimeOrdersVsTime,
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
