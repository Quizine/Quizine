import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './userReducer'
import summary from './summaryReducer'
import customizedQuery from './customizedQueryReducer'
import revenueAnalytics from './revenueAnalyticsReducer'
import staffAnalytics from './staffAnalyticsReducer'

const appReducer = combineReducers({
  user,
  summary,
  customizedQuery,
  revenueAnalytics,
  staffAnalytics
})

// We'd like the redux logger to only log messages when it's running in the
// browser AND is in a development environment, and not when we run the tests from within Mocha.
const middleware =
  process.env.NODE_ENV === 'development' && process.browser
    ? composeWithDevTools(
        applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
      )
    : composeWithDevTools(applyMiddleware(thunkMiddleware))

/** We wrap the entire redux store in a root reducer with a special
 * action, RESET_STORE. It calls our application's reducer with
 * state = undefined. This will trigger each of our sub-reducers
 * to reset back to their initial state. This will come in
 * handy when we need to reset our redux store in between tests.
 */
const RESET_STORE = 'RESET_STORE'
export const resetStore = () => ({type: RESET_STORE})
const reducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined
    return appReducer(state, action)
  }
  return appReducer(state, action)
}

const store = createStore(reducer, middleware)

export default store
export * from './userReducer'
