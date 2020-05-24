import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './userReducer'
import summary from './summaryReducer'
import customizedQuery from './customizedQueryReducer'
import revenueAnalytics from './revenueAnalyticsReducer'
import staffAnalytics from './staffAnalyticsReducer'

const reducer = combineReducers({
  user,
  summary,
  customizedQuery,
  revenueAnalytics,
  staffAnalytics
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './userReducer'
