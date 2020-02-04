import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './userReducer'
import waiters from './waiterReducer'
import orders from './orderReducer'
import menu from './menuReducer'
import summary from './summaryReducer'
import stockQueries from './stockQueryReducer'

const reducer = combineReducers({
  user,
  summary,
  waiters,
  menu,
  orders,
  stockQueries
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './userReducer'
