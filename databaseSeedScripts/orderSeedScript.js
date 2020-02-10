/* eslint-disable max-statements */
const {normalDistributionFunc} = require('./utilities')

//for seeding waiters
let server = [
  {id: 1, name: 'Fred Reynolds', sex: 'male', age: 27, restaurantId: 1},
  {id: 2, name: 'Cynthia Klein', sex: 'female', age: 31, restaurantId: 1},
  {id: 3, name: 'Adam Essaire', sex: 'male', age: 24, restaurantId: 1},
  {id: 4, name: 'Paula Davidson', sex: 'female', age: 34, restaurantId: 1},
  {id: 5, name: 'Nicole Eastman', sex: 'female', age: 26, restaurantId: 1},
  {id: 6, name: 'Leo Jackson', sex: 'male', age: 37, restaurantId: 1},
  {id: 7, name: 'Erik Jenson', sex: 'male', age: 32, restaurantId: 1},
  {id: 8, name: 'John Cho', sex: 'male', age: 21, restaurantId: 1},
  {id: 9, name: 'Tina Smith', sex: 'female', age: 28, restaurantId: 1},
  {id: 10, name: 'Desi Shunturova', sex: 'female', age: 32, restaurantId: 1},
  {id: 11, name: 'Adam Vare', sex: 'male', age: 22, restaurantId: 1},
  {id: 12, name: 'Slava Adronau', sex: 'male', age: 29, restaurantId: 1}
]

//for seeding menu
let menu = [
  {
    id: 1,
    menuName: 'lobster',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 3200,
    restaurantId: 1
  },
  {
    id: 2,
    menuName: 'steak',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 4500,
    restaurantId: 1
  },
  {
    id: 3,
    menuName: 'chicken',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 2700,
    restaurantId: 1
  },
  {
    id: 4,
    menuName: 'pasta',
    beverageType: null,
    foodType: 'main',
    mealType: 'dinner',
    price: 2100,
    restaurantId: 1
  },
  {
    id: 5,
    menuName: 'lobster',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 2200,
    restaurantId: 1
  },
  {
    id: 6,
    menuName: 'steak',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 3500,
    restaurantId: 1
  },
  {
    id: 7,
    menuName: 'chicken',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 1700,
    restaurantId: 1
  },
  {
    id: 8,
    menuName: 'pasta',
    beverageType: null,
    foodType: 'main',
    mealType: 'lunch',
    price: 1100,
    restaurantId: 1
  },
  {
    id: 9,
    menuName: 'springRolls',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1700,
    restaurantId: 1
  },
  {
    id: 10,
    menuName: 'deviledEggs',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1500,
    restaurantId: 1
  },
  {
    id: 11,
    menuName: 'soup',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1800,
    restaurantId: 1
  },
  {
    id: 12,
    menuName: 'salad',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'dinner',
    price: 1900,
    restaurantId: 1
  },
  {
    id: 13,
    menuName: 'springRolls',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1200,
    restaurantId: 1
  },
  {
    id: 14,
    menuName: 'deviledEggs',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1000,
    restaurantId: 1
  },
  {
    id: 15,
    menuName: 'soup',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1300,
    restaurantId: 1
  },
  {
    id: 16,
    menuName: 'salad',
    beverageType: null,
    foodType: 'appetizer',
    mealType: 'lunch',
    price: 1400,
    restaurantId: 1
  },
  {
    id: 17,
    menuName: 'chocolateCake',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1800,
    restaurantId: 1
  },
  {
    id: 18,
    menuName: 'tiramisu',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1900,
    restaurantId: 1
  },
  {
    id: 19,
    menuName: 'icecream',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1400,
    restaurantId: 1
  },
  {
    id: 20,
    menuName: 'fruit',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'dinner',
    price: 1500,
    restaurantId: 1
  },
  {
    id: 21,
    menuName: 'chocolateCake',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1300,
    restaurantId: 1
  },
  {
    id: 22,
    menuName: 'tiramisu',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1400,
    restaurantId: 1
  },
  {
    id: 23,
    menuName: 'icecream',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 900,
    restaurantId: 1
  },
  {
    id: 24,
    menuName: 'fruit',
    beverageType: null,
    foodType: 'dessert',
    mealType: 'lunch',
    price: 1000,
    restaurantId: 1
  },
  {
    id: 25,
    menuName: 'coke',
    beverageType: 'nonAlcohol',
    foodType: null,
    mealType: null,
    price: 500,
    restaurantId: 1
  },
  {
    id: 26,
    menuName: 'sprite',
    beverageType: 'nonAlcohol',
    foodType: null,
    mealType: null,
    price: 400,
    restaurantId: 1
  },
  {
    id: 27,
    menuName: 'redWine',
    beverageType: 'alcohol',
    foodType: null,
    mealType: null,
    price: 1200,
    restaurantId: 1
  },
  {
    id: 28,
    menuName: 'whiteWine',
    beverageType: 'alcohol',
    foodType: null,
    mealType: null,
    price: 1300,
    restaurantId: 1
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
    meanTimeOfDay = 13
  } else if (mealType === 'dinner') {
    meanTimeOfDay = 19
  }

  let variance = 1.2
  let time = meanTimeOfDay + variance * normalDistributionFunc()
  let openingTime = 11
  let closingTime = 22
  time = Math.max(openingTime, time)
  time = Math.min(time, closingTime)

  return time
}

const pickMenuItem = function(menu) {
  let menuIndex = Math.floor(Math.random() * menu.length)
  let menuItem = menu[menuIndex]
  return menuItem
}

let randomizeMenuOrder = function(mealType, isFood, type) {
  let selectedList = []
  if (isFood) {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].mealType === mealType && menu[i].foodType === type) {
        selectedList.push(menu[i])
      }
    }
  } else {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].mealType === null && menu[i].beverageType === type) {
        selectedList.push(menu[i])
      }
    }
  }
  const selectedMenu = pickMenuItem(selectedList)

  return selectedMenu.id
}

let randomizeSinglePersonPurchase = function(orderHour) {
  let personOrder = []
  let mealType
  let foodType = ['appetizer', 'dessert']
  let beverageType = ['alcohol', 'nonAlcohol']
  if (orderHour < 16) {
    mealType = 'lunch'
  } else {
    mealType = 'dinner'
  }
  personOrder.push(randomizeMenuOrder(mealType, true, 'main'))
  for (let i = 0; i < foodType.length; i++) {
    let foodRandomNumber = Math.random()
    if (foodRandomNumber < 0.5) {
      personOrder.push(randomizeMenuOrder(mealType, true, foodType[i]))
    }
  }
  let beverageRandomNumber = Math.random()
  if (mealType === 'lunch') {
    if (beverageRandomNumber < 0.8) {
      personOrder.push(randomizeMenuOrder(null, false, beverageType[1]))
    } else {
      personOrder.push(randomizeMenuOrder(null, false, beverageType[0]))
    }
  } else if (mealType === 'dinner') {
    if (beverageRandomNumber < 0.2) {
      personOrder.push(randomizeMenuOrder(null, false, beverageType[1]))
    } else {
      personOrder.push(randomizeMenuOrder(null, false, beverageType[0]))
    }
  }
  return personOrder
}

const generatePurchase = function() {
  let purchaseData = {}

  let earliestDate = new Date(2018, 0, 1)
  let latestDate = new Date(2020, 11, 1)

  let dateOfPurchase = new Date(
    +earliestDate + Math.random() * (latestDate - earliestDate)
  )

  while (
    [0, 6].indexOf(dateOfPurchase.getDay()) === -1 &&
    Math.random() < 0.4
  ) {
    dateOfPurchase = new Date(
      +earliestDate + Math.random() * (latestDate - earliestDate)
    )
  }

  dateOfPurchase = new Date(dateOfPurchase.toDateString())

  let dayOfWeekOfOrder = dateOfPurchase.getDay()

  let meal
  let mealRandomNumber = Math.random()
  let lunchProportion
  if (dayOfWeekOfOrder === 0 || dayOfWeekOfOrder === 6) {
    lunchProportion = 0.42
  } else {
    lunchProportion = 0.26
  }

  if (mealRandomNumber < lunchProportion) {
    meal = 'lunch'
  } else {
    meal = 'dinner'
  }

  let hour = randomizeTime(meal)

  dateOfPurchase.setHours(hour)
  dateOfPurchase.setMinutes((hour % 1) * 60)

  purchaseData.timeOfPurchase = dateOfPurchase

  purchaseData.waiterId = selectRandomServer().serverId

  let numberOfGuests
  let guestRandomNumber = Math.random()
  if (guestRandomNumber > 0.3) {
    numberOfGuests = Math.floor(Math.random() * (4 - 2 + 1)) + 2
  } else {
    numberOfGuests = Math.floor(Math.random() * (8 - 5 + 1)) + 5
  }
  purchaseData.numberOfGuests = numberOfGuests
  purchaseData.menuOrderList = []
  for (let i = 1; i <= numberOfGuests; i++) {
    purchaseData.menuOrderList = purchaseData.menuOrderList.concat(
      randomizeSinglePersonPurchase(hour)
    )
  }
  let hashOfMenuOrderList = {}
  menu.forEach(item => {
    hashOfMenuOrderList[item.id] = item.price
  })
  purchaseData.subtotal = purchaseData.menuOrderList.reduce((acc, currVal) => {
    return acc + hashOfMenuOrderList[currVal]
  }, 0)

  let tipPercentage =
    (20 + 4 * normalDistributionFunc()) *
    serverSkill[purchaseData.waiterId - 1].skill_level

  purchaseData.tip = Math.floor(tipPercentage / 100 * purchaseData.subtotal)
  purchaseData.tax = Math.floor(0.1 * purchaseData.subtotal)
  purchaseData.total =
    purchaseData.subtotal + purchaseData.tip + purchaseData.tax
  return purchaseData
}

let purchaseList = []
for (let i = 0; i < 100; i++) {
  let potentialPurchase = generatePurchase()
  potentialPurchase.id = i + 1
  potentialPurchase.restaurantId = 1
  purchaseList.push(potentialPurchase)
}

let orderMenuTable = []

for (let i = 0; i < purchaseList.length; i++) {
  let singlePurchase = purchaseList[i]
  let hashOfMenuQty = {}
  for (let j = 0; j < singlePurchase.menuOrderList.length; j++) {
    let singleMenuId = singlePurchase.menuOrderList[j]
    let singleOrderPerMenu
    if (hashOfMenuQty[singleMenuId]) {
      for (let k = 0; k < orderMenuTable.length; k++) {
        if (
          singleMenuId === orderMenuTable[k].menuId &&
          singlePurchase.id === orderMenuTable[k].orderId
        ) {
          orderMenuTable[k].quantity++
        }
      }
    } else {
      hashOfMenuQty[singleMenuId] = true
      singleOrderPerMenu = {
        quantity: 1,
        orderId: singlePurchase.id,
        menuId: singleMenuId
      }
      orderMenuTable.push(singleOrderPerMenu)
    }
  }
  delete singlePurchase.menuOrderList
}

module.exports = {
  server,
  menu,
  purchaseList,
  orderMenuTable
}
