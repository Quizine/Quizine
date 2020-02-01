const {normalDistributionFunc} = require('./utilities')

//for seeding waiters
let servers = [
  {name: 'Fred Reynolds', sex: 'male', age: 27},
  {name: 'Cynthia Klein', sex: 'female', age: 31},
  {name: 'Adam Essaire', sex: 'male', age: 24},
  {name: 'Paula Davidson', sex: 'female', age: 34},
  {name: 'Nicole Eastman', sex: 'female', age: 26},
  {name: 'Leo Jackson', sex: 'male', age: 37},
  {name: 'Erik Jenson', sex: 'male', age: 32},
  {name: 'John Cho', sex: 'male', age: 21},
  {name: 'Tina Smith', sex: 'female', age: 28},
  {name: 'Desi Shunturova', sex: 'female', age: 32},
  {name: 'Adam Vare', sex: 'male', age: 22},
  {name: 'Slava Adronau', sex: 'male', age: 29}
]

//for seeding menu
let menu = [
  {
    menuName: 'lobster',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 3200
  },
  {
    menuName: 'steak',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 4500
  },
  {
    menuName: 'chicken',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 2700
  },
  {
    menuName: 'pasta',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 2100
  },
  {
    menuName: 'lobster',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 2200
  },
  {
    menuName: 'steak',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 3500
  },
  {
    menuName: 'chicken',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 1700
  },
  {
    menuName: 'pasta',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 1100
  },
  {
    menuName: 'springRolls',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1700
  },
  {
    menuName: 'deviledEggs',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1500
  },
  {
    menuName: 'soup',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1800
  },
  {
    menuName: 'salad',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1900
  },
  {
    menuName: 'springRolls',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1200
  },
  {
    menuName: 'deviledEggs',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1000
  },
  {
    menuName: 'soup',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1300
  },
  {
    menuName: 'salad',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1400
  },
  {
    menuName: 'chocolateCake',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1800
  },
  {
    menuName: 'tiramisu',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1900
  },
  {
    menuName: 'icecream',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1400
  },
  {
    menuName: 'fruit',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1500
  },
  {
    menuName: 'chocolateCake',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1300
  },
  {
    menuName: 'tiramisu',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1400
  },
  {
    menuName: 'icecream',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 900
  },
  {
    menuName: 'fruit',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1000
  },
  {
    menuName: 'coke',
    beverageType: 'nonAlcoholic',
    foodType: null,
    mealType: null,
    price: 500
  },
  {
    menuName: 'sprite',
    beverageType: 'nonAlcoholic',
    foodType: null,
    mealType: null,
    price: 400
  },
  {
    menuName: 'redWine',
    beverageType: 'alcoholic',
    foodType: null,
    mealType: null,
    price: 1200
  },
  {
    menuName: 'whiteWine',
    beverageType: 'alcoholic',
    foodType: null,
    mealType: null,
    price: 1300
  }
]

let serverSkill = [
  {serverId: 1, skill_level: 0.9},
  {serverId: 2, skill_level: 0.7},
  {serverId: 3, skill_level: 0.65},
  {serverId: 4, skill_level: 0.8},
  {serverId: 5, skill_level: 0.75},
  {serverId: 6, skill_level: 0.85},
  {serverId: 7, skill_level: 0.78},
  {serverId: 8, skill_level: 0.73},
  {serverId: 9, skill_level: 0.85},
  {serverId: 10, skill_level: 0.72},
  {serverId: 11, skill_level: 0.76},
  {serverId: 12, skill_level: 0.83}
]

const selectRandomServer = function() {
  let serverIndex = Math.floor(Math.random() * serverSkill.length)
  return serverSkill[serverIndex]
}

let randomizeTime = function(mealType) {
  let meanTimeOfDay
  if (mealType === 'lunch') {
    meanTimeOfDay = 12.5
  } else if (mealType === 'dinner') {
    meanTimeOfDay = 19
  }

  let variance = 1
  let time = meanTimeOfDay + variance * normalDistributionFunc()
  let openingTime = 11
  let closingTime = 22
  time = Math.max(openingTime, time)
  time = Math.min(time, closingTime)

  return time
}

// let randomizeMenu = function() {

// }

const generatePurchase = function() {
  let meal
  let mealRandomNumber = Math.random()
  if (mealRandomNumber < 0.4) {
    meal = 'lunch'
  } else {
    meal = 'dinner'
  }

  let hour = randomizeTime(meal)

  let purchaseData = {}

  let earliestDate = new Date(2018, 0, 1)
  let latestDate = new Date(2020, 1, 20)

  let dateOfPurchase = new Date(
    +earliestDate + Math.random() * (latestDate - earliestDate)
  )
  dateOfPurchase = new Date(dateOfPurchase.toDateString())

  dateOfPurchase.setHours(hour)
  dateOfPurchase.setMinutes((hour % 1) * 60)

  purchaseData.timeOfPurchase = dateOfPurchase

  purchaseData.serverId = selectRandomServer().serverId

  // make sure to round spend amounts
  purchaseData.subtotal = Math.round(
    Math.max(5000 + 2000 * normalDistributionFunc(), 5)
  ) //REVISIT

  // randomly generate number of guests (probably skewed so there's more parties of 2-4 than 5-8)
  // use number of guests as mean of items selected

  // if you want to reflect what they bought, build a menu object and select a random number of items from it and use their prices
  // make alc. drinks more commonly bought in drinking times
  // make sure menu items are in your database...

  //   let menu = [{lobster: {id: 1, price: 32, is_beverage: false}}]

  let tipPercentage =
    (20 + 4 * normalDistributionFunc()) *
    serverSkill[purchaseData.serverId - 1].skill_level

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
}
console.log(purchaseList)
