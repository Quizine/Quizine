// const sql = jsonSql.build({
// type: 'select',
// fields: ['menuName', 'mealType'],
// table: 'menus',
// join: [],
// condition: {menuName: 'lobster', mealType: 'dinner'}
// })

// const anExample = [
// {orders: [{total: {dataType: 'integer', options: ['$lte', 50]}}]}
// ]

const ex0 = [
{
orders: [
{total: {dataType: 'integer', options: ['$lte', 50]}},
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
