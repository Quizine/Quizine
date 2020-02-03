import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MENU_FIELDS = 'GET_MENU_FIELDS'
const GET_MENU = 'GET_MENU'

/**
 * INITIAL STATE
 */
const initialState = {
  rows: [],
  fields: []
}

/**
 * ACTION CREATORS
 */
const gotMenuFields = menuFields => ({
  type: GET_MENU_FIELDS,
  menuFields
})
const gotMenu = menu => ({type: GET_MENU, menu})

/**
 * THUNK CREATORS
 */
export const getMenuFields = () => async dispatch => {
  try {
    const res = await axios.get('/api/menu/fields')
    dispatch(gotMenuFields(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getMenu = () => async dispatch => {
  try {
    const res = await axios.get('/api/menu')
    dispatch(gotMenu(res.data))
  } catch (err) {
    console.error(err)
  }
}

const filterFieldsFunction = function(array) {
  return array
    .filter(
      field =>
        field.name !== 'id' &&
        field.name !== 'createdAt' &&
        field.name !== 'updatedAt' &&
        !field.name.includes('Id')
    )
    .map(field => {
      let name = field.name
      name = name.replace(/([A-Z])/g, ' $1') // COVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
      name = name[0].toUpperCase() + name.slice(1)
      return name
    })
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MENU_FIELDS:
      return {
        ...state,
        fields: filterFieldsFunction(action.menuFields)
      }
    case GET_MENU:
      return {
        ...state,
        rows: action.menu.rows,
        fields: filterFieldsFunction(action.menu.fields)
      }
    default:
      return state
  }
}
