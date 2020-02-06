import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_NUM_ORDERS_PER_HOUR_RESULTS = 'GET_NUM_ORDERS_PER_HOUR_RESULTS'
const GET_AVG_REVENUE_PER_GUEST = 'GET_AVG_REVENUE_PER_GUEST'
const GET_TIP_PERCENTAGE_CHART = 'GET_TIP_PERCENTAGE_CHART'
const GET_MENU_SALES_NUMBERS_CHART = 'GET_MENU_SALES_NUMBERS_CHART'

/**
 * INITIAL STATE
 */
const initialState = {
  numOrdersPerHour: {
    year: [],
    month: [],
    week: []
  },
  tipPercentageChart: {
    xAxis: [],
    yAxis: []
  },
  avgRevPerGuest: {
    year: [],
    month: [],
    week: []
  },
  menuSalesNumbersChart: {
    xAxis: [],
    yAxis: []
  }
}

/**
 * ACTION CREATORS
 */

const gotNumOrdersPerHour = (results, timeInterval) => ({
  type: GET_NUM_ORDERS_PER_HOUR_RESULTS,
  results,
  timeInterval
})
const gotAvgRevPerGuest = (results, timeInterval) => ({
  type: GET_AVG_REVENUE_PER_GUEST,
  results,
  timeInterval
})

const gotTipPercentageChart = chartResults => ({
  type: GET_TIP_PERCENTAGE_CHART,
  chartResults
})
const gotMenuSalesNumbersChart = chartResults => ({
  type: GET_MENU_SALES_NUMBERS_CHART,
  chartResults
})

/**
 * THUNK CREATORS
 */

export const getNumOrdersPerHour = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get('/api/analytics/numberOfOrdersPerHour', {
      params: {interval: timeInterval}
    })
    dispatch(gotNumOrdersPerHour(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}
export const getTipPercentageChart = timeInterval => async dispatch => {
  try {
    const res = await axios.get(
      '/api/analytics/graphs/tipPercentageByWaiters',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotTipPercentageChart(res.data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getAvgRevPerGuest = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get('/api/analytics/avgRevPerGuest', {
      params: {interval: timeInterval}
    })
    dispatch(gotAvgRevPerGuest(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getMenuSalesNumbersChart = timeInterval => async dispatch => {
  try {
    const res = await axios.get('/api/analytics/graphs/menuSalesNumbers', {
      params: {timeInterval}
    })
    dispatch(gotMenuSalesNumbersChart(res.data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NUM_ORDERS_PER_HOUR_RESULTS:
      return {
        ...state,
        numOrdersPerHour: {
          ...state.numOrdersPerHour,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_AVG_REVENUE_PER_GUEST:
      return {
        ...state,
        avgRevPerGuest: {
          ...state.avgRevPerGuest,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_TIP_PERCENTAGE_CHART:
      return {
        ...state,
        tipPercentageChart: {
          ...state.tipPercentageChart,
          xAxis: action.chartResults.xAxis,
          yAxis: action.chartResults.yAxis,
          [`${action.timeInterval}`]: action.chartResults
        }
      }
    case GET_MENU_SALES_NUMBERS_CHART:
      return {
        ...state,
        menuSalesNumbersChart: {
          ...state.menuSalesNumbersChart,
          xAxis: action.chartResults.xAxis,
          yAxis: action.chartResults.yAxis,
          [`${action.timeInterval}`]: action.chartResults
        }
      }
    default:
      return state
  }
}
