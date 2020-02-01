const {normalDistributionFunc} = require('./utilities')

//for seeing waiters
let waiters = [
  {name: 'Fred Reynolds', sex: 'male', age: 27, shift: 'breakfast'},
  {name: 'Cynthia Klein', sex: 'female', age: 31, shift: 'breakfast'},
  {name: 'Adam Essaire', sex: 'male', age: 24, shift: 'breakfast'},
  {name: 'Paula Davidson', sex: 'female', age: 34, shift: 'breakfast'},
  {name: 'Nicole Eastman', sex: 'female', age: 26, shift: 'breakfast'},
  {name: 'Leo Jackson', sex: 'male', age: 37, shift: 'breakfast'},
  {name: 'Paula Davidson', sex: 'female', age: 34, shift: 'lunch'},
  {name: 'Nicole Eastman', sex: 'female', age: 26, shift: 'lunch'},
  {name: 'Leo Jackson', sex: 'male', age: 37, shift: 'lunch'},
  {name: 'Paula Davidson', sex: 'female', age: 34, shift: 'lunch'},
  {name: 'Nicole Eastman', sex: 'female', age: 26, shift: 'lunch'},
  {name: 'Leo Jackson', sex: 'male', age: 37, shift: 'lunch'}
]

waiters.filter(function(waiter) {
  return (waiter.shift = 'breakfast')
})
// end

let servers = [
  {id: 1, skill_level: 0.7},
  {id: 2, name: 'Cynthia X', skill_level: 0.9, age: 34},
  {id: 3, name: 'Adam S.R.', skill_level: 0.6, age: 23},
  {id: 4, name: 'Paula D.', skill_level: 0.8, age: 40}
]

const selectRandomServer = function() {
  let serverIndex = Math.floor(Math.random() * servers.length)
  return servers[serverIndex]
}

let randomizeTime = function(mealType) {
  let meanTimeOfDay
  if (mealType === 'breakfast') {
    meanTimeOfDay = 10
  } else if (mealType === 'lunch') {
    meanTimeOfDay = 12.5
  } else if (mealType === 'dinner') {
    meanTimeOfDay = 19
  }

  let variance = 1
  let time = meanTimeOfDay + variance * normalDistributionFunc()
  let openingTime = 8
  let closingTime = 22
  time = Math.max(openingTime, time)
  time = Math.min(time, closingTime)

  return time
}

const generatePurchase = function() {
  //   Math.random();

  let meal
  let mealRandomNumber = Math.random()
  if (mealRandomNumber < 0.2) {
    meal = 'breakfast'
  } else if (mealRandomNumber < 0.5) {
    meal = 'lunch'
  } else {
    meal = 'dinner'
  }

  let hour = randomizeTime(meal)

  //     if(Math.random )
  //   let meal = Math.random() < 0.6 ? 'dinner' : 'lunch';

  let purchaseData = {}

  let earliestDate = new Date(2018, 0, 1)
  let latestDate = new Date(2020, 1, 20)

  let dateOfPurchase = new Date(
    +earliestDate + Math.random() * (latestDate - earliestDate)
  )
  dateOfPurchase = new Date(dateOfPurchase.toDateString())

  dateOfPurchase.setHours(hour) //hours from function )
  dateOfPurchase.setMinutes((hour % 1) * 60) // from function)

  //   let timeUnix = 1530000000000 + 1000000000 * normalDistributionFunc()

  // make sure purchases are during business hours...
  //   purchaseData.timeOfPurchase = new Date(timeUnix)
  purchaseData.timeOfPurchase = dateOfPurchase

  //   purchaseData.server = Object.keys(servers)[
  //     Math.floor(Math.random() * Object.keys(servers).length)
  //   ]

  if (purchaseData.timeOfPurchase.getHours)
    purchaseData.server_id = selectRandomServer().id

  // make sure to round spend amounts
  purchaseData.subtotal = Math.max(50 + 20 * normalDistributionFunc(), 5)

  // randomly generate number of guests (probably skewed so there's more parties of 2-4 than 5-8)
  // use number of guests as mean of items selected
  // if you want to reflect what they bought, build a menu object and select a random number of items from it and use their prices
  // make alc. drinks more commonly bought in drinking times
  // make sure menu items are in your database...
  let menu = [{lobster: {id: 1, price: 32, is_beverage: false}}]

  console.log(purchaseData)
  let tipPercentage =
    (20 + 4 * normalDistributionFunc()) *
    servers[purchaseData.server_id - 1].skill_level // servers[purchaseData.server]
  console.log(tipPercentage)
  purchaseData.tip = tipPercentage / 100 * purchaseData.subtotal
  purchaseData.tax = 0.1 * purchaseData.subtotal
  purchaseData.total =
    purchaseData.subtotal + purchaseData.tip + purchaseData.tax
  return purchaseData
}

let purchaseList = []
for (let i = 0; i < 10; i++) {
  let potentialPurchase = generatePurchase()

  // if purchase on holiday, 40% chance of NOT pushing it into list...
  purchaseList.push(potentialPurchase)

  // might want to make this instead write to a .csv file
}
console.log(purchaseList)
