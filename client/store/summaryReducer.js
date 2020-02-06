import axios from 'axios'
import {act} from 'react-test-renderer'

/**
 * ACTION TYPES
 */
const GET_NUMBER_OF_WAITERS = 'GET_NUMBER_OF_WAITERS'
const GET_PEAK_TIME_ORDERS = 'GET_PEAK_TIME_ORDERS'
const GET_REVENUE_VS_TIME = 'GET_REVENUE_VS_TIME'
const GET_CALENDAR_DATA = 'GET_CALENDAR_DATA'

/**
 * INITIAL STATE
 */
const initialState = {
  numberOfWaiters: '',
  peakTimeOrdersVsTime: {
    year: [],
    month: [],
    week: []
  },
  revenueVsTime: {
    allPeriod: {},
    oneYear: {},
    twoYears: {}
  },
  calendarData: {
    revenue: '',
    listOfWaiters: [],
    popularDish: ''
  }
}

/**
 * ACTION CREATORS
 */

const gotNumberOfWaiters = numOfWaiters => ({
  type: GET_NUMBER_OF_WAITERS,
  numOfWaiters
})

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

const gotCalendarData = (revenue, listOfWaiters, popularDish) => ({
  type: GET_CALENDAR_DATA,
  revenue,
  listOfWaiters,
  popularDish
})

export const getNumberOfWaiters = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/summary/numberOfWaiters')
    dispatch(gotNumberOfWaiters(data))
  } catch (error) {
    console.error(error)
  }
}

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

export const getCalendarData = (
  revenue,
  listOfWaiters,
  popularDish,
  date
) => async dispatch => {
  const payload = {params: {date}}
  try {
    const revenue = await axios.get('/api/summary/revenueByDay', payload)
    const waiters = await axios.get('/api/summary/waitersOnADay', payload)
    const dish = await axios.get('/api/summary/mostPopularDishOnADay', payload) //?
    dispatch(gotCalendarData(revenue.data, waiters.data, dish.data))
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NUMBER_OF_WAITERS:
      return {
        ...state,
        numberOfWaiters: action.numOfWaiters
      }
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
    case GET_CALENDAR_DATA:
      return {
        ...state,
        calendarData: {
          revenue: action.revenue,
          listOfWaiters: action.listOfWaiters,
          popularDish: action.popularDish
        }
      }
    default:
      return state
  }
}
