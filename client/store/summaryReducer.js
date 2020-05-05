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
const GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5 =
  'GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5'
const GET_YELP_RATING = 'GET_YELP_RATING'
/**
 * INITIAL STATE
 */
const initialState = {
  restaurantInfo: {},
  numberOfWaiters: '',
  peakTimeOrdersVsTime: [],
  revenueVsTime: {},
  calendarData: {
    revenue: '',
    listOfWaiters: [],
    popularDish: ''
  },
  menuSalesNumbersVsMenuItemsTopOrBottom5: {
    top5: {},
    bottom5: {}
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

const gotPeakTimeOrders = peakTimeData => ({
  type: GET_PEAK_TIME_VS_ORDERS,
  peakTimeData
})
const gotRevenueVsTime = revenueSummaryData => ({
  type: GET_REVENUE_VS_TIME,
  revenueSummaryData
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

const gotMenuSalesNumbersVsMenuItemsTopOrBottom5 = (top5, bottom5) => ({
  type: GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5,
  top5,
  bottom5
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
    console.log('WHAT IS TIME INTERVAL: ', timeInterval)
    const {data} = await axios.get('/api/summary/numberOfGuestsVsHour', {
      params: {timeInterval}
    })
    dispatch(gotPeakTimeOrders(data))
  } catch (err) {
    console.error(err)
  }
}

export const getRevenueVsTime = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/summary/revenueVsTime')
    dispatch(gotRevenueVsTime(data))
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

export const getMenuSalesNumbersVsMenuItemsTopOrBottom5 = timeInterval => async dispatch => {
  try {
    const top = await axios.get(
      '/api/summary/menuSalesNumbersVsMenuItemsTopOrBottom5',
      {
        params: {timeInterval, topOrBottom: 'desc'}
      }
    )
    const bottom = await axios.get(
      '/api/summary/menuSalesNumbersVsMenuItemsTopOrBottom5',
      {
        params: {timeInterval, topOrBottom: 'asc'}
      }
    )
    dispatch(gotMenuSalesNumbersVsMenuItemsTopOrBottom5(top.data, bottom.data))
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
// eslint-disable-next-line complexity
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
        peakTimeOrdersVsTime: action.peakTimeData
      }
    case GET_REVENUE_VS_TIME:
      return {
        ...state,
        revenueVsTime: action.revenueSummaryData
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
    case GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5:
      return {
        ...state,
        menuSalesNumbersVsMenuItemsTopOrBottom5: {
          ...state.menuSalesNumbersVsMenuItemsTopOrBottom5,
          top5: action.top5,
          bottom5: action.bottom5
        }
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
