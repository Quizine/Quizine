// const sql = jsonSql.build({
// type: 'select',
// fields: ['menuItemName', 'mealType'],
// table: 'menuItems',
// join: [],
// condition: {menuItemName: 'lobster', mealType: 'dinner'}
// })

// const anExample = [
// {orders: [{revenue: {dataType: 'integer', options: ['$lte', 50]}}]}
// ]

const ex0 = [
{
orders: [
{revenue: {dataType: 'integer', options: ['$lte', 50]}},
{
timeOfPurchase: {
dataType: 'timestamp with time zone',
options: ['week']
}
}
]
}
]

// const ex2 = [
// //THIS ONE PRODUCTS NULL IN CONDITIONS
// {
// waiters: [{name: {dataType: 'string', options: []}}]
// },
// {
// restaurants: [{restaurantName: {dataType: 'string', options: []}}]
// }
// ]

// const internalObj = {
// type: 'select',
// fields: ['menuItemName', 'mealType'],
// table: 'menuItems',
// join: [],
// condition: {menuItemName: 'lobster', mealType: 'dinner'}
// }

// const externalObj = [
// {orders: [{revenue: {dataType: 'integer', options: ['$lte', 50]}}]}
// ]

//console.log(`here is translate query`, translatedQuery)
//console.log(`conditions further down in the func:`, translatedQuery.condition)
// here is translate query {
// type: 'select',
// fields: [ 'mealType', 'menuItemName' ],
// table: 'menuItems',
// join: {},
// condition: { '$and': [ [Object], [Object] ] }
// }
// for (let key in translatedQuery.condition) {
// if (translatedQuery.condition.hasOwnProperty(key)) {
// if (translatedQuery.condition[key] === '$and') {
// for (let i = 0; i < translatedQuery.condition.\$and.length; i++) {
// let element =
// if (tra)
// }
// }
// else {

// }
// }
// }

//SEE IF COLUMN NAMES HAVE UNDEFINED VALUES
//use delete operator
//for (let key in translatedQuery.condition) {
// const value = translatedQuery.condition[key]
// console.log(`here is the key`, key)
// console.log(`and value`, value)
// if (Array.isArray(value)) {
// value.forEach(item => {
// console.log(`here is an array item`, item)
// })
// }
//}

    // const ex1 = [
    //   {
    //     menuItems: [
    //       {menuItemName: {dataType: 'string', options: []}},
    //       {mealType: {dataType: 'string', options: []}}
    //     ]
    //   }
    // ]
