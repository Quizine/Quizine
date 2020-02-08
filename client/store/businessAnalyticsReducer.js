import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_NUM_ORDERS_VS_HOUR = 'GET_NUM_ORDERS_VS_HOUR'
const GET_AVG_REVENUE_GUEST_VS_DOW = 'GET_AVG_REVENUE_GUEST_VS_DOW'
const GET_TIP_PERCENTAGE_VS_WAITERS = 'GET_TIP_PERCENTAGE_VS_WAITERS'
const GET_AVG_NUMBER_OF_GUESTS_VS_WAITERS_PER_ORDER =
  'GET_AVG_NUMBER_OF_GUESTS_VS_WAITERS_PER_ORDER'
const GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5 =
  'GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5'
/**
 * INITIAL STATE
 */
const initialState = {
  numberOfOrdersVsHour: {
    year: [],
    month: [],
    week: []
  },
  avgRevenuePerGuestVsDOW: {
    year: [],
    month: [],
    week: []
  },
  tipPercentageVsWaiters: {
    xAxis: [],
    yAxis: [],
    year: {},
    month: {},
    week: {}
  },
  menuSalesNumbersVsMenuItemsTopOrBottom5: {
    year: {},
    month: {},
    week: {}
  },
  avgNumberOfGuestsVsWaitersPerOrder: {
    xAxis: [],
    yAxis: [],
    year: {},
    month: {},
    week: {}
  }
}

/**
 * ACTION CREATORS
 */

const gotNumberOfOrdersVsHour = (results, timeInterval) => ({
  type: GET_NUM_ORDERS_VS_HOUR,
  results,
  timeInterval
})
const gotAvgRevenuePerGuestVsDOW = (results, timeInterval) => ({
  type: GET_AVG_REVENUE_GUEST_VS_DOW,
  results,
  timeInterval
})

const gotTipPercentageVsWaiters = (results, timeInterval) => ({
  type: GET_TIP_PERCENTAGE_VS_WAITERS,
  results,
  timeInterval
})
const gotMenuSalesNumbersVsMenuItemsTopOrBottom5 = (
  top5,
  bottom5,
  timeInterval
) => ({
  type: GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5,
  top5,
  bottom5,
  timeInterval
})

const gotAvgNumberOfGuestsVsWaitersPerOrder = (results, timeInterval) => ({
  type: GET_AVG_NUMBER_OF_GUESTS_VS_WAITERS_PER_ORDER,
  results,
  timeInterval
})

/**
 * THUNK CREATORS
 */

export const getNumberOfOrdersVsHour = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get(
      '/api/businessAnalytics/numberOfOrdersVsHour',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotNumberOfOrdersVsHour(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getAvgRevenuePerGuestVsDOW = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get(
      '/api/businessAnalytics/avgRevenuePerGuestVsDOW',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotAvgRevenuePerGuestVsDOW(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getTipPercentageVsWaiters = timeInterval => async dispatch => {
  try {
    const res = await axios.get(
      '/api/businessAnalytics/tipPercentageVsWaiters',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotTipPercentageVsWaiters(res.data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getMenuSalesNumbersVsMenuItemsTopOrBottom5 = timeInterval => async dispatch => {
  try {
    const top = await axios.get(
      '/api/businessAnalytics/menuSalesNumbersVsMenuItemsTopOrBottom5',
      {
        params: {timeInterval, topOrBottom: 'desc'}
      }
    )
    const bottom = await axios.get(
      '/api/businessAnalytics/menuSalesNumbersVsMenuItemsTopOrBottom5',
      {
        params: {timeInterval, topOrBottom: 'asc'}
      }
    )
    dispatch(
      gotMenuSalesNumbersVsMenuItemsTopOrBottom5(
        top.data,
        bottom.data,
        timeInterval
      )
    )
  } catch (err) {
    console.error(err)
  }
}

export const getAvgNumberOfGuestsVsWaitersPerOrder = timeInterval => async dispatch => {
  try {
    const res = await axios.get(
      '/api/businessAnalytics/avgNumberOfGuestsVsWaitersPerOrder',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotAvgNumberOfGuestsVsWaitersPerOrder(res.data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NUM_ORDERS_VS_HOUR:
      return {
        ...state,
        numberOfOrdersVsHour: {
          ...state.numberOfOrdersVsHour,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_AVG_REVENUE_GUEST_VS_DOW:
      return {
        ...state,
        avgRevenuePerGuestVsDOW: {
          ...state.avgRevenuePerGuestVsDOW,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_TIP_PERCENTAGE_VS_WAITERS:
      return {
        ...state,
        tipPercentageVsWaiters: {
          ...state.tipPercentageVsWaiters,
          xAxis: action.results.xAxis,
          yAxis: action.results.yAxis,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_MENU_SALES_NUMBERS_VS_MENU_ITEMS_TOP_OR_BOTTOM_5:
      return {
        ...state,
        menuSalesNumbersVsMenuItemsTopOrBottom5: {
          ...state.menuSalesNumbersVsMenuItemsTopOrBottom5,
          [`${action.timeInterval}`]: {
            top5: action.top5,
            bottom5: action.bottom5
          }
        }
      }
    case GET_AVG_NUMBER_OF_GUESTS_VS_WAITERS_PER_ORDER:
      return {
        ...state,
        avgNumberOfGuestsVsWaitersPerOrder: {
          ...state.avgNumberOfGuestsVsWaitersPerOrder,
          xAxis: action.results.xAxis,
          yAxis: action.results.yAxis,
          [`${action.timeInterval}`]: action.results
        }
      }
    default:
      return state
  }
}
