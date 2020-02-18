import axios from 'axios'
import {act} from 'react-test-renderer'

/**
 * ACTION TYPES
 */
const GET_RESTAURANT_INFO = 'GET_RESTAURANT_INFO'
const GET_NUMBER_OF_WAITERS = 'GET_NUMBER_OF_WAITERS'
const GET_PEAK_TIME_VS_ORDERS = 'GET_PEAK_TIME_VS_ORDERS'
const GET_REVENUE_VS_TIME = 'GET_REVENUE_VS_TIME'
const GET_CALENDAR_DATA = 'GET_CALENDAR_DATA'
const GET_DOW_ANALYSIS_TABLE = 'GET_DOW_ANALYSIS_TABLE'
const GET_YELP_RATING = 'GET_YELP_RATING'
/**
 * INITIAL STATE
 */
const initialState = {
  restaurantInfo: {},
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
  },
  DOWAnalysisTable: [],
  yelpRating: 0
}

/**
 * ACTION CREATORS
 */

const gotRestaurantInfo = restaurantInfo => ({
  type: GET_RESTAURANT_INFO,
  restaurantInfo
})

const gotNumberOfWaiters = numOfWaiters => ({
  type: GET_NUMBER_OF_WAITERS,
  numOfWaiters
})

const gotPeakTimeOrders = (orders, timeInterval) => ({
  type: GET_PEAK_TIME_VS_ORDERS,
  orders,
  timeInterval
})
const gotRevenueVsTime = (chartData, yearQty) => ({
  type: GET_REVENUE_VS_TIME,
  chartData,
  yearQty
})
const gotDOWAnalysisTable = (DOWresults, timeInterval) => ({
  type: GET_DOW_ANALYSIS_TABLE,
  DOWresults,
  timeInterval
})

const gotCalendarData = (revenue, listOfWaiters, popularDish) => ({
  type: GET_CALENDAR_DATA,
  revenue,
  listOfWaiters,
  popularDish
})

const gotYelpRating = yelpRating => ({
  type: GET_YELP_RATING,
  yelpRating
})

export const getRestaurantInfo = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/summary/restaurantInfo')
    dispatch(gotRestaurantInfo(data))
  } catch (error) {
    console.error(error)
  }
}

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

export const getCalendarData = date => async dispatch => {
  const payload = {params: {date}}
  try {
    const revenue = await axios.get('/api/summary/revenueByDay', payload)
    const waiters = await axios.get('/api/summary/waitersOnADay', payload)
    const dish = await axios.get('/api/summary/mostPopularDishOnADay', payload)
    dispatch(gotCalendarData(revenue.data, waiters.data, dish.data))
  } catch (error) {
    console.error(error)
  }
}

export const getDOWAnalysisTable = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/summary/DOWAnalysisTable')
    const correctedDataTypeArr = data.map(row => {
      const correctedRow = {}
      for (let key in row) {
        if (row.hasOwnProperty(key)) {
          if (key !== 'dayOfWeek') {
            correctedRow[key] = +row[key]
          } else {
            correctedRow[key] = row[key]
          }
        }
      }
      return correctedRow
    })
    dispatch(gotDOWAnalysisTable(correctedDataTypeArr))
  } catch (err) {
    console.error(err)
  }
}

export const getYelpRating = (restaurantName, location) => async dispatch => {
  // let Promise = require("bluebird");
  try {
    if (!process.env.REACT_APP_API_KEY) {
      require('../../secrets')
    }
    const apiKey = process.env.REACT_APP_API_KEY
    const {data} = await axios.get(
      `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        params: {
          location,
          term: restaurantName
        }
      }
    )
    dispatch(gotYelpRating(data.businesses[0].rating))
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RESTAURANT_INFO:
      return {
        ...state,
        restaurantInfo: action.restaurantInfo
      }
    case GET_NUMBER_OF_WAITERS:
      return {
        ...state,
        numberOfWaiters: action.numOfWaiters
      }
    case GET_PEAK_TIME_VS_ORDERS:
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
    case GET_DOW_ANALYSIS_TABLE:
      return {
        ...state,
        DOWAnalysisTable: action.DOWresults
      }
    case GET_YELP_RATING:
      return {
        ...state,
        yelpRating: action.yelpRating
      }
    default:
      return state
  }
}
