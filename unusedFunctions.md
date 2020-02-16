//func for last selected table obj
// function showSubmitButton(lastSelectedTableObj) {
// let status = false
// const tableName = Object.keys(lastSelectedTableObj)[0]
// if (tableName) {
// const tableArr = lastSelectedTableObj[tableName]
// if (tableArr.length) {
// tableArr.forEach(columnObj => {
// for (const columnName in columnObj) {
// if (columnObj.hasOwnProperty(columnName)) {
// if (columnName) {
// const columnInteriorObj = columnObj[columnName]
// if (
// columnInteriorObj.dataType === 'integer' &&
// columnInteriorObj.funcType
// ) {
// status = true
// } else if (
// columnInteriorObj.dataType === 'timestamp with time zone' &&
// columnInteriorObj.options.length
// ) {
// status = true
// } else if (columnInteriorObj.dataType === 'character varying') {
// status = true
// }
// }
// }
// }
// })
// }
// }

// return status
// }
