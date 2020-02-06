import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STOCK_QUERY_RESULTS = 'GET_STOCK_QUERY_RESULTS'
const GET_TIP_PERCENTAGE_CHART = 'GET_TIP_PERCENTAGE_CHART'
const GET_MENU_SALES_NUMBERS_CHART = 'GET_MENU_SALES_NUMBERS_CHART'

/**
 * INITIAL STATE
 */
const initialState = {
  stockQueries: {},
  tipPercentageChart: {
    xAxis: [],
    yAxis: [],
    year: [],
    month: [],
    week: []
  },
  menuSalesNumbersChart: {
    xAxis: [],
    yAxis: [],
    year: [],
    month: [],
    week: []
  }
}

/**
 * ACTION CREATORS
 */
const gotStockQueryResults = queryResults => ({
  type: GET_STOCK_QUERY_RESULTS,
  queryResults
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
export const getStockQueryResults = () => async dispatch => {
  try {
    const res = await axios.get('/api/tables/stockQueries')
    console.log(res.data)
    dispatch(gotStockQueryResults(res.data))
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
    case GET_STOCK_QUERY_RESULTS:
      return {
        ...state,
        stockQueries: action.queryResults
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
