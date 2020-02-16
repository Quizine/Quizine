/* eslint-disable complexity */
import axios from 'axios'
import {object} from 'prop-types'

/**
 * ACTION TYPES
 */
const GET_TABLE_NAMES = 'GET_TABLE_NAMES'
const GET_TABLE_FIELDS = 'GET_TABLE_FIELDS'
const GET_DATA_TYPE = 'GET_TABLE_TYPE'
const GET_VALUE_OPTIONS_FOR_STRING = 'GET_VALUE_OPTIONS_FOR_STRING'
const GET_JOIN_TABLES = 'GET_JOIN_TABLES'
const UPDATE_TABLE = 'UPDATE_TABLE'
const UPDATE_COLUMN = 'UPDATE_COLUMN'
const UPDATE_OPTION = 'UPDATE_OPTION'
const CLEAR_CUSTOM_QUERY_SELECTION = 'CLEAR_CUSTOM_QUERY_SELECTION '
const ADD_EMPTY_TABLE = 'ADD_EMPTY_TABLE'
const ADD_EMPTY_COLUMN = 'ADD_EMPTY_COLUMN'
const ADD_EMPTY_OPTION = 'ADD_EMPTY_OPTION'
const REMOVE_TABLE = 'REMOVE_TABLE'
const REMOVE_COLUMN = 'REMOVE_COLUMN'
const REMOVE_OPTION = 'REMOVE_OPTION'
const GET_CUSTOM_QUERY_RESULTS = 'GET_CUSTOM_QUERY_RESULTS'
const CLEAR_JOIN_TABLES = 'CLEAR_JOIN_TABLES'

/**
 * INITIAL STATE
 */
const initialState = {
  customQueryResult: {},
  joinTables: [],
  metaData: [],
  customQuery: []
}

/**
 * ACTION CREATORS
 */

export const gotCustomQueryResult = customQueryResult => {
  return {
    type: GET_CUSTOM_QUERY_RESULTS,
    customQueryResult
  }
}

const gotTableNames = tableNames => ({
  type: GET_TABLE_NAMES,
  tableNames
})

const gotTableFields = (tableName, tableFields) => ({
  type: GET_TABLE_FIELDS,
  tableName,
  tableFields
})

const gotDataType = (tableName, columnName, dataType) => ({
  type: GET_DATA_TYPE,
  tableName,
  columnName,
  dataType
})

const gotValueOptionsForString = (
  tableName,
  columnName,
  valueOptionsArray
) => ({
  type: GET_VALUE_OPTIONS_FOR_STRING,
  tableName,
  columnName,
  valueOptionsArray
})

const gotJoinTables = joinTables => ({
  type: GET_JOIN_TABLES,
  joinTables
})

export const updateTable = tableName => {
  return {
    type: UPDATE_TABLE,
    tableName
  }
}

export const updateColumn = (tableName, columnName, dataType, funcType) => {
  return {
    type: UPDATE_COLUMN,
    tableName,
    columnName,
    dataType,
    funcType
  }
}

export const updateOption = (tableName, columnName, option) => {
  return {
    type: UPDATE_OPTION,
    tableName,
    columnName,
    option
  }
}

export const clearCustomQuery = () => ({
  type: CLEAR_CUSTOM_QUERY_SELECTION
})

export const addEmptyTable = () => {
  return {
    type: ADD_EMPTY_TABLE
  }
}

export const addEmptyColumn = tableName => {
  return {
    type: ADD_EMPTY_COLUMN,
    tableName
  }
}

export const addEmptyOption = (tableName, columnName) => {
  return {
    type: ADD_EMPTY_OPTION,
    tableName,
    columnName
  }
}

export const removeTable = () => {
  return {
    type: REMOVE_TABLE
  }
}

export const removeColumn = tableName => {
  return {
    type: REMOVE_COLUMN,
    tableName
  }
}

export const removeOption = (tableName, columnName) => {
  return {
    type: REMOVE_OPTION,
    tableName,
    columnName
  }
}

export const clearJoinTables = () => {
  return {
    type: CLEAR_JOIN_TABLES
  }
}

/**
 * THUNK CREATORS
 */
export const getTableNames = () => async dispatch => {
  try {
    const res = await axios.get(`/api/customizedQuery`)
    dispatch(gotTableNames(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getTableFields = tableName => async dispatch => {
  try {
    const res = await axios.get(`/api/customizedQuery/${tableName}`)
    dispatch(gotTableFields(tableName, res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getDataType = (tableName, columnName) => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/${columnName}`
    )
    dispatch(gotDataType(tableName, columnName, res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getValueOptionsForString = (
  tableName,
  columnName
) => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/${columnName}/string`
    )
    dispatch(gotValueOptionsForString(tableName, columnName, res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getJoinTables = tableName => async dispatch => {
  try {
    const res = await axios.get(
      `/api/customizedQuery/${tableName}/foreignTableNames`
    )
    dispatch(gotJoinTables(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getQueryResults = customQueryArr => async dispatch => {
  try {
    const {data} = await axios.post('/api/customizedQuery/customQuery', {
      customQueryRequest: customQueryArr
    })
    dispatch(gotCustomQueryResult(data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TABLE_NAMES:
      return {
        ...state,
        metaData: [
          ...state.metaData,
          ...mapTablesToMetaData(state.metaData, action.tableNames)
        ]
      }
    case GET_TABLE_FIELDS:
      return {
        ...state,
        metaData: mapColumnsToMetaData(
          state.metaData,
          action.tableName,
          action.tableFields
        )
      }
    case GET_DATA_TYPE:
      return {
        ...state,
        metaData: mapDataTypeToMetaData(
          state.metaData,
          action.tableName,
          action.columnName,
          action.dataType
        )
      }
    case GET_VALUE_OPTIONS_FOR_STRING:
      return {
        ...state,
        metaData: mapStringOptionsToMetaData(
          state.metaData,
          action.tableName,
          action.columnName,
          action.valueOptionsArray
        )
      }
    case UPDATE_TABLE:
      return {
        ...state,
        customQuery: updateTableFunc(state.customQuery, action.tableName)
      }
    case UPDATE_COLUMN:
      return {
        ...state,
        customQuery: updateColumnFunc(
          state.customQuery,
          action.tableName,
          action.columnName,
          action.dataType,
          action.funcType
        )
      }
    case UPDATE_OPTION:
      return {
        ...state,
        customQuery: updateOptionFunc(
          state.customQuery,
          action.tableName,
          action.columnName,
          action.option
        )
      }
    case CLEAR_CUSTOM_QUERY_SELECTION:
      return {
        ...state,
        customQuery: initialState.customQuery
      }
    case ADD_EMPTY_TABLE:
      return {
        ...state,
        customQuery: addEmptyTableFunc(state.customQuery)
      }
    case ADD_EMPTY_COLUMN:
      return {
        ...state,
        customQuery: addEmptyColumnFunc(state.customQuery, action.tableName)
      }
    case ADD_EMPTY_OPTION:
      return {
        ...state,
        customQuery: addEmptyOptionFunc(
          state.customQuery,
          action.tableName,
          action.columnName
        )
      }
    case REMOVE_TABLE:
      return {
        ...state,
        customQuery: removeTableFunc(state.customQuery)
      }
    case REMOVE_COLUMN:
      return {
        ...state,
        customQuery: removeColumnFunc(state.customQuery, action.tableName)
      }
    case REMOVE_OPTION:
      return {
        ...state,
        customQuery: removeOptionFunc(
          state.customQuery,
          action.tableName,
          action.columnName
        )
      }
    case GET_JOIN_TABLES:
      return {
        ...state,
        joinTables: action.joinTables
      }
    case GET_CUSTOM_QUERY_RESULTS:
      return {
        ...state,
        customQueryResult: action.customQueryResult
      }
    case CLEAR_JOIN_TABLES:
      return {
        ...state,
        joinTables: []
      }
    default:
      return state
  }
}

function updateTableFunc(customQuery, tableName) {
  let updatedQuery
  if (customQuery.length) {
    updatedQuery = [...customQuery].slice(0, customQuery.length - 1)
    updatedQuery = [...updatedQuery, {[tableName]: []}]
  } else {
    updatedQuery = [{[tableName]: []}]
  }
  return updatedQuery
}

function updateColumnFunc(
  customQuery,
  tableName,
  columnName,
  receivedDataType,
  receivedFuncType = ''
) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      let updatedColumnList
      if (table[existingTableName].length) {
        updatedColumnList = [...table[existingTableName]].slice(
          0,
          table[existingTableName].length - 1
        )
        updatedColumnList = [
          ...updatedColumnList,
          {
            [columnName]: {
              funcType: receivedFuncType,
              dataType: receivedDataType,
              options: []
            }
          }
        ]
      } else {
        updatedColumnList = [
          {
            [columnName]: {
              funcType: receivedFuncType,
              dataType: receivedDataType,
              options: []
            }
          }
        ]
      }
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function updateOptionFunc(customQuery, tableName, columnName, option) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      const updatedColumnList = table[existingTableName].map(column => {
        const existingColumnName = Object.keys(column)[0]
        if (columnName === existingColumnName) {
          let updatedOptionList = option
          column[existingColumnName].options = updatedOptionList
        }
        return column
      })
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function addEmptyTableFunc(customQuery) {
  let updatedQuery
  if (customQuery.length) {
    if (Object.keys(customQuery[customQuery.length - 1]).length) {
      updatedQuery = [...customQuery, {}]
    }
  } else {
    updatedQuery = [{}]
  }
  return updatedQuery
}

function addEmptyColumnFunc(customQuery, tableName) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      let updatedColumnList
      if (table[existingTableName].length) {
        updatedColumnList = [...table[existingTableName], {}]
      } else {
        updatedColumnList = [{}]
      }
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function addEmptyOptionFunc(customQuery, tableName, columnName) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      const updatedColumnList = table[existingTableName].map(column => {
        const existingColumnName = Object.keys(column)[0]
        if (columnName === existingColumnName) {
          let updatedOptionList
          if (column[existingColumnName].options.length) {
            updatedOptionList = [...column[existingColumnName].options, '']
          } else {
            updatedOptionList = ['']
          }
          column[existingColumnName].options = updatedOptionList
        }
        return column
      })
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function removeTableFunc(customQuery) {
  let updatedQuery
  if (customQuery.length) {
    updatedQuery = [...customQuery].slice(0, customQuery.length - 1)
  } else {
    updatedQuery = []
  }
  return updatedQuery
}
// function removeColumnFunc(customQuery, tableName) {
//   const updatedQuery = customQuery.map(table => {
//    const existingTableName = Object.keys(table)[0]
//    if (tableName === existingTableName){
//      if (table[existingTableName.length]){

//      }
//    }
//   })
// }

function removeColumnFunc(customQuery, tableName) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      let updatedColumnList
      if (table[existingTableName].length) {
        updatedColumnList = [...table[existingTableName]].slice(
          0,
          table[existingTableName].length - 1
        )
      } else {
        updatedColumnList = []
      }
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function removeOptionFunc(customQuery, tableName, columnName) {
  const updatedQuery = customQuery.map(table => {
    const existingTableName = Object.keys(table)[0]
    if (tableName === existingTableName) {
      const updatedColumnList = table[existingTableName].map(column => {
        const existingColumnName = Object.keys(column)[0]
        if (columnName === existingColumnName) {
          let updatedOptionList
          if (column[existingColumnName].length) {
            updatedOptionList = [...column[existingColumnName].options].slice(
              0,
              column[existingColumnName].options.length - 1
            )
          } else {
            updatedOptionList = []
          }
          column[existingColumnName].options = updatedOptionList
        }
        return column
      })
      table[existingTableName] = updatedColumnList
    }
    return table
  })
  return updatedQuery
}

function mapColumnsToMetaData(array, tableName, columnsArray) {
  let updatedColumnNames = columnsArray.map(element => {
    const keyName = element.column_name
    return {[keyName]: {dataType: '', options: []}}
  })
  let metaData = array.map(element => {
    if (Object.keys(element)[0] === tableName) {
      element[tableName] = updatedColumnNames
    }
    return element
  })

  return metaData
}

function mapTablesToMetaData(metadata, tableNameArray) {
  if (!metadata.length) {
    return tableNameArray.map(element => {
      const keyName = element.table_name
      return {[keyName]: []}
    })
  }
  return []
}

function mapDataTypeToMetaData(array, tableName, columnName, dataType) {
  let metaData = array.map(element => {
    if (Object.keys(element)[0] === tableName) {
      element[tableName].map(columnElement => {
        if (Object.keys(columnElement)[0] === columnName) {
          columnElement[columnName].dataType = dataType
        }
        return columnElement
      })
    }
    return element
  })
  return metaData
}

function mapStringOptionsToMetaData(
  array,
  tableName,
  columnName,
  valueOptionsArray
) {
  let updatedValueOptions = valueOptionsArray.map(element => {
    return element.aliasname
  })
  let metaData = array.map(element => {
    if (Object.keys(element)[0] === tableName) {
      element[tableName].map(columnElement => {
        if (Object.keys(columnElement)[0] === columnName) {
          if (
            columnElement[columnName].dataType !== 'timestamp with time zone' &&
            columnElement[columnName].dataType !== 'integer'
          ) {
            columnElement[columnName].options = updatedValueOptions
          }
        }
        return columnElement
      })
    }
    return element
  })
  return metaData
}
